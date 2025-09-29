import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";

import { auth } from "@/app/(auth)/auth";
import { buildStreamingVideoScriptPrompt, videoScriptModel } from "@/ai/video-script-actions";

const encoder = new TextEncoder();

function parseStreamedScript(fullText: string, fallbackTitle: string) {
  const START_MARKER = "SCRIPT_START";
  const END_MARKER = "SCRIPT_END";
  const TITLE_MARKER = "SUGGESTED_TITLE:";

  let script = fullText.trim();
  let suggestedTitle = fallbackTitle;

  const startIndex = fullText.indexOf(START_MARKER);
  if (startIndex >= 0) {
    const afterStart = fullText.slice(startIndex + START_MARKER.length);
    const endIndex = afterStart.indexOf(END_MARKER);

    if (endIndex >= 0) {
      script = afterStart.slice(0, endIndex).replace(/^[\s\r\n]+/, "").replace(/[\s\r\n]+$/, "");
      const afterEnd = afterStart.slice(endIndex + END_MARKER.length);
      const titleIndex = afterEnd.indexOf(TITLE_MARKER);
      if (titleIndex >= 0) {
        const rawTitle = afterEnd.slice(titleIndex + TITLE_MARKER.length).trim();
        if (rawTitle) {
          suggestedTitle = rawTitle;
        }
      }
    } else {
      script = afterStart.replace(/^[\s\r\n]+/, "").trimEnd();
    }
  }

  return {
    script,
    suggestedTitle,
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, language, hookType, contentType, scriptLength, motif, strongReferenceId } = await request.json();

    if (!title || !description || !language || !hookType || !contentType || !scriptLength) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prompt = await buildStreamingVideoScriptPrompt({
      title,
      description,
      language,
      hookType,
      contentType,
      scriptLength,
      motif,
      strongReferenceId,
      userId: session.user.id,
    });

    const result = await streamText({
      model: videoScriptModel,
      prompt,
      experimental_telemetry: {
        isEnabled: true,
        functionId: "generate-video-script",
      },
    });

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const sendEvent = (event: string, data: unknown) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        sendEvent("start", { status: "started" });

        let aggregated = "";

        try {
          for await (const chunk of result.textStream) {
            aggregated += chunk;
            sendEvent("chunk", { content: chunk });
          }

          const { script, suggestedTitle } = parseStreamedScript(aggregated, title);
          sendEvent("complete", { script, suggestedTitle });
          sendEvent("end", {});
          controller.close();
        } catch (error) {
          console.error("Streaming error in generate-video-script API:", error);
          const message = error instanceof Error ? error.message : "Unknown streaming error";
          sendEvent("error", { message });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in generate-video-script API:", error);
    console.error("Error details:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");

    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}