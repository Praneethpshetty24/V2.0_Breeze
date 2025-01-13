import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const { message } = await req.json();
    
    // Expanded check for identity questions
    const identityQuestions = [
      "who are you",
      "who r u",
      "who is u",
      "u r",
      "you are",
      "are you",
      "who created you",
      "who made you"
    ];

    if (message.toLowerCase().includes("who created") || message.toLowerCase().includes("who made")) {
      return new Response(JSON.stringify({ content: "I was created by Praneeth P Shetty,who created this web-app and is solely maintained by him" }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (identityQuestions.some(question => message.toLowerCase().includes(question))) {
      return new Response(JSON.stringify({ content: "I am BreezeBot" }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent(message);
    const response = await result.response;
    let text = response.text();

    // Limit the response to 5 lines
    const lines = text.split('\n');
    if (lines.length > 5) {
      text = lines.slice(0, 5).join('\n') + '...';
    }

    return new Response(JSON.stringify({ content: text }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }), 
      { status: 500 }
    );
  }
}

