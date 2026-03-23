import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// We initialize OpenAI with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { message: 'OpenAI API Key is missing! Please add it to your .env.local file.' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json({ message: 'Missing file or user ID' }, { status: 400 });
    }

    // Convert file to base64 for OpenAI (if image or PDF supported)
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Content = buffer.toString('base64');
    const mimeType = file.type;

    console.log(`Processing ${file.name} (${mimeType}) for user ${userId}`);

    // Call OpenAI Structured Outputs to extract trades
    // Note: For actual production images, gpt-4o vision is used. 
    // Here we construct a generic prompt that asks for structured trade data.
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert financial data extraction AI. Extract the exact trading history from the provided screenshot or statement text. Return the data as a precise JSON array of trades. Each trade must include: symbol (string), entry_price (number), exit_price (number), type ('BUY' or 'SELL'), volume (number), open_time (ISO string), close_time (ISO string), profit (number)."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract the list of closed trades from this broker statement." },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Content}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" }
    });

    const aiContent = response.choices[0].message.content;
    let extractedTrades: any[] = [];
    
    try {
      if (aiContent) {
         // GPT-4o JSON mode returns {"trades": [...]} or similar depending on luck, or we assume a strict structure.
         const parsed = JSON.parse(aiContent);
         extractedTrades = parsed.trades || parsed; // fallback
         if (!Array.isArray(extractedTrades)) extractedTrades = [];
      }
    } catch (e) {
      console.error("Failed to parse AI output:", e);
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
