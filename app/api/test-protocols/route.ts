import { getProtocolsByUserId, saveProtocol } from "@/db/protocol-queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // This is only for testing - in production, always use authenticated user ID
    const testUserId = 'test-user-id';
    
    const protocols = await getProtocolsByUserId({ userId: testUserId });
    
    return NextResponse.json({
      message: 'Protocols fetched successfully',
      data: protocols
    });
  } catch (error) {
    console.error('Error fetching protocols:', error);
    return NextResponse.json(
      { error: 'Failed to fetch protocols' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // This is only for testing - in production, always use authenticated user ID
    const testUserId = 'test-user-id';
    
    const testProtocol = {
      name: 'Test Protocol',
      description: 'This is a test protocol',
      parts: [
        { content: 'Part 1 content' },
        { content: 'Part 2 content' }
      ]
    };
    
    const savedProtocol = await saveProtocol({
      userId: testUserId,
      name: testProtocol.name,
      description: testProtocol.description,
      parts: testProtocol.parts
    });
    
    return NextResponse.json({
      message: 'Protocol created successfully',
      data: savedProtocol
    });
  } catch (error) {
    console.error('Error creating protocol:', error);
    return NextResponse.json(
      { error: 'Failed to create protocol' },
      { status: 500 }
    );
  }
}
