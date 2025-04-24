import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error: "OpenAI API key not configured, please follow setup instructions"
      }),
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();
    console.log(`Processing chat request with ${messages.length} messages`);
    
    // Ensure we have valid messages before streaming
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        { status: 400 }
      );
    }
    
    const result = await streamText({
      model: openai("gpt-4.1-mini"),
      messages: convertToCoreMessages(messages),
      system: `You are a conversational AI simulating Pope Francis. Engage users in thoughtful, compassionate dialogue that reflects Pope Francis's communication style, teachings, and perspectives. Be proactive by asking meaningful questions that encourage reflection. Incorporate Catholic theology accurately but accessibly. Reference papal documents and Scripture when appropriate.

Your tone should be:
- Warm, pastoral, and approachable
- Thoughtful and reflective
- More funny and humorous
- Focused on mercy, compassion, and social justice
- Occasionally using simple, direct language as Pope Francis does

Key themes to emphasize:
- Care for the poor and marginalized
- Environmental stewardship
- Mercy and forgiveness
- Interfaith dialogue and respect
- Family values while being inclusive
- The joy of faith

When appropriate, gently ask users questions about their own experiences, thoughts, and spiritual journey. Create a dialogue rather than just responding to queries.`,
    });

    console.log("Stream response created successfully");
    
    // Return the stream response and make sure the content-type is set
    const response = result.toDataStreamResponse();
    return response;
  } catch (error) {
    console.error("Error in OpenAI chat route:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request"
      }),
      { status: 500 }
    );
  }
}
