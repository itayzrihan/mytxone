import { auth } from '@/app/(auth)/auth';
import { 
  createQuoteTemplate, 
  getUserQuoteTemplates,
  createQuoteItem,
  createQuoteOption
} from '@/db/quote-queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await getUserQuoteTemplates(session.user.id);
    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching quote templates:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, businessType, allowGuestSubmissions, items } = body;

    if (!title || !businessType) {
      return NextResponse.json({ error: 'Title and business type are required' }, { status: 400 });
    }

    // Create the template
    const template = await createQuoteTemplate({
      userId: session.user.id,
      title,
      description,
      businessType,
      allowGuestSubmissions,
    });

    // Create items if provided
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        const createdItem = await createQuoteItem({
          templateId: template.id,
          title: item.title,
          description: item.description,
          isRequired: item.isRequired,
          itemType: item.itemType,
          fixedPrice: item.fixedPrice,
          minPrice: item.minPrice,
          maxPrice: item.maxPrice,
          parameterType: item.parameterType,
          parameterUnit: item.parameterUnit,
          pricePerUnit: item.pricePerUnit,
          minUnits: item.minUnits,
          maxUnits: item.maxUnits,
          displayOrder: i,
        });

        // Create options if this is an option group
        if (item.itemType === 'option_group' && item.options && item.options.length > 0) {
          for (let j = 0; j < item.options.length; j++) {
            const option = item.options[j];
            
            await createQuoteOption({
              itemId: createdItem.id,
              title: option.title,
              description: option.description,
              fixedPrice: option.fixedPrice,
              minPrice: option.minPrice,
              maxPrice: option.maxPrice,
              displayOrder: j,
            });
          }
        }
      }
    }

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error('Error creating quote template:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}