import { auth } from '@/app/(auth)/auth';
import { 
  getQuoteTemplateWithItems,
  deleteQuoteTemplate,
  updateQuoteTemplate,
  updateQuoteTemplateWithItems
} from '@/db/quote-queries';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const template = await getQuoteTemplateWithItems(params.id);
    
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching quote template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const template = await getQuoteTemplateWithItems(params.id);
    
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    if (template.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await deleteQuoteTemplate(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quote template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const template = await getQuoteTemplateWithItems(params.id);
    
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    if (template.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const updatedTemplate = await updateQuoteTemplateWithItems(params.id, body);
    
    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error('Error updating quote template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}