import { auth } from "@/app/(auth)/auth";
import { 
  saveDefinition, 
  getDefinitionsByUserId, 
  getDefinitionById, 
  deleteDefinitionById,
  updateDefinition
} from "@/db/definition-queries";

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
      // Get specific definition
      const definition = await getDefinitionById({ id, userId });
      
      if (!definition) {
        return new Response("Definition not found", { status: 404 });
      }
      
      return new Response(JSON.stringify(definition), {
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Get all definitions for user
      const definitions = await getDefinitionsByUserId({ userId });
      
      return new Response(JSON.stringify(definitions), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error fetching definitions:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { name, description, content } = await request.json();
    
    if (!name || !content) {
      return new Response("Invalid definition data", { status: 400 });
    }
    
    const userId = session.user.id;
    const savedDefinition = await saveDefinition({
      userId,
      name,
      description,
      content,
    });
    
    return new Response(JSON.stringify(savedDefinition[0]), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving definition:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return new Response("Definition ID is required", { status: 400 });
  }

  try {
    const { name, description, content } = await request.json();
    
    if (!name || !content) {
      return new Response("Invalid definition data", { status: 400 });
    }
    
    const userId = session.user.id;
    
    // First check if the definition exists and belongs to the user
    const existingDefinition = await getDefinitionById({ id, userId });
    
    if (!existingDefinition) {
      return new Response("Definition not found or you don't have permission to update it", { status: 404 });
    }
    
    // Update the definition
    await updateDefinition({
      id,
      userId,
      name,
      description,
      content,
    });
    
    // Fetch the updated definition to return
    const updatedDefinition = await getDefinitionById({ id, userId });
    
    return new Response(JSON.stringify(updatedDefinition), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating definition:", error);
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
    return new Response("Definition ID is required", { status: 400 });
  }

  try {
    const userId = session.user.id;
    await deleteDefinitionById({ id, userId });
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting definition:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
