import { auth } from "@/app/(auth)/auth";
import { 
  saveProtocol, 
  getProtocolsByUserId, 
  getProtocolById, 
  deleteProtocolById 
} from "@/db/protocol-queries";

export async function GET(request: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  try {
    if (id) {
      // Get specific protocol
      const protocol = await getProtocolById({ id, userId });
      
      if (!protocol) {
        return new Response("Protocol not found", { status: 404 });
      }
      
      return new Response(JSON.stringify(protocol), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Get all protocols for user
      const protocols = await getProtocolsByUserId({ userId });
      
      return new Response(JSON.stringify(protocols), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error fetching protocols:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { name, description, parts } = await request.json();
    
    if (!name || !parts || !Array.isArray(parts) || parts.length === 0) {
      return new Response("Invalid protocol data", { status: 400 });
    }
    
    const userId = session.user.id;
    const savedProtocol = await saveProtocol({
      userId,
      name,
      description,
      parts,
    });
    
    return new Response(JSON.stringify(savedProtocol[0]), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving protocol:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response("Protocol ID is required", { status: 400 });
  }

  try {
    const userId = session.user.id;
    await deleteProtocolById({ id, userId });
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting protocol:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
