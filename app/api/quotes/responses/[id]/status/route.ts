import { auth } from '@/app/(auth)/auth';
import { 
  updateQuoteResponseStatus,
  getQuoteResponseById
} from '@/db/quote-queries';
import { getQuoteTemplateById } from '@/db/quote-queries';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Get the response to check ownership
    const response = await getQuoteResponseById(params.id);
    if (!response) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 });
    }

    // Get the template to check ownership
    const template = await getQuoteTemplateById(response.templateId);
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    if (template.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updatedResponse = await updateQuoteResponseStatus(params.id, status);
    return NextResponse.json(updatedResponse);
  } catch (error) {
    console.error('Error updating quote response status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}