import { auth } from '@/app/(auth)/auth';
import { 
  getUserQuoteResponses,
  createQuoteResponse
} from '@/db/quote-queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const responses = await getUserQuoteResponses(session.user.id);
    return NextResponse.json(responses);
  } catch (error) {
    console.error('Error fetching quote responses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      templateId,
      customerName,
      customerEmail,
      customerPhone,
      selectedItems,
      selectedOptions,
      parameterValues,
      totalMinPrice,
      totalMaxPrice,
      notes
    } = body;

    if (!templateId || !selectedItems) {
      return NextResponse.json(
        { error: 'Template ID and selected items are required' }, 
        { status: 400 }
      );
    }

    const response = await createQuoteResponse({
      templateId,
      customerName,
      customerEmail,
      customerPhone,
      selectedItems,
      selectedOptions: selectedOptions || [],
      parameterValues,
      totalMinPrice,
      totalMaxPrice,
      notes,
    });

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating quote response:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}