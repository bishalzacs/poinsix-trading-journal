import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { message: 'Gemini API Key is missing! Please add it to your .env.local file.' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ message: 'Missing file or user ID' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type;

    console.log(`Processing ${file.name} (${mimeType}) using Gemini for user ${userId}`);

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert financial data extraction AI. Extract the exact trading history from the provided screenshot or statement text. Return the data as a precise JSON array of trades. 
    Each trade must include exactly these fields:
    - symbol (string, e.g. "XAUUSD")
    - entry_price (number)
    - exit_price (number)
    - type ('BUY' or 'SELL')
    - volume (number, lot size)
    - open_time (ISO string date)
    - close_time (ISO string date)
    - profit (number, in currency)
    
    IMPORTANT: Respond ONLY with a valid JSON array. Do not include any text or markdown formatting outside the array.`;

    let imageParts: any[] = [];
    let finalPrompt = prompt;

    if (mimeType.includes('text') || mimeType.includes('csv')) {
      const textData = buffer.toString('utf-8');
      finalPrompt += `\n\nHere is the text/CSV data to analyze:\n${textData}`;
    } else {
      imageParts = [
        {
          inlineData: {
            data: buffer.toString("base64"),
            mimeType
          }
        }
      ];
    }

    const payload = imageParts.length > 0 ? [finalPrompt, ...imageParts] : [finalPrompt];
    const result = await model.generateContent(payload);
    
    const aiContent = result.response.text();
    let extractedTrades: any[] = [];
    
    try {
      if (aiContent) {
         // More robust JSON cleaning
         let cleanContent = aiContent.trim();
         
         // Remove markdown code blocks if present
         if (cleanContent.includes('```')) {
           const match = cleanContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
           if (match) {
             cleanContent = match[1];
           }
         }
         
         const parsed = JSON.parse(cleanContent);
         extractedTrades = Array.isArray(parsed) ? parsed : (parsed.trades || []);
      }
    } catch (e) {
      console.error("AI Parse Error:", e);
      console.log("Raw content was:", aiContent);
      return NextResponse.json({ 
        message: 'Failed to extract structured data. AI output was: ' + aiContent.substring(0, 100),
        raw: aiContent 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      status: 'success', 
      message: `Extracted ${extractedTrades.length} trades`, 
      data: extractedTrades 
    });

  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
