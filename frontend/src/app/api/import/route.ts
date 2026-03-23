import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

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

    // Call Gemini 1.5 Flash for fast multimodal extraction
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert financial data extraction AI. Extract the exact trading history from the provided screenshot or statement text. Return the data as a precise JSON array of trades. 
    Each trade must include exactly these fields:
    - symbol (string)
    - entry_price (number)
    - exit_price (number)
    - type ('BUY' or 'SELL')
    - volume (number)
    - open_time (ISO string date)
    - close_time (ISO string date)
    - profit (number)
    
    IMPORTANT: Respond ONLY with a valid JSON array. Do not include markdown formatting like \`\`\`json. Just the raw array starting with [ and ending with ].`;

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

    const result = await model.generateContent([finalPrompt, ...imageParts]);
    const aiContent = result.response.text();
    let extractedTrades: any[] = [];
    
    try {
      if (aiContent) {
         // Clean up potential markdown formatting that Gemini might forcefully add
         let cleanContent = aiContent.trim();
         if (cleanContent.startsWith('```json')) {
             cleanContent = cleanContent.replace(/^```json/, '').replace(/```$/, '').trim();
         }
         
         const parsed = JSON.parse(cleanContent);
         extractedTrades = parsed.trades || parsed;
         if (!Array.isArray(extractedTrades)) extractedTrades = [];
      }
    } catch (e) {
      console.error("Failed to parse AI output:", e);
      console.log("Raw output was:", aiContent);
      return NextResponse.json({ message: 'Failed to extract structured data from statement.' }, { status: 500 });
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
