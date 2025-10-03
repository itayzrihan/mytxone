import { getQuoteTemplateWithItems } from '@/db/quote-queries';
import { notFound } from 'next/navigation';
import { QuoteResponseForm } from '@/components/quotes/quote-response-form';

interface QuoteResponsePageProps {
  params: {
    id: string;
  };
}

export default async function QuoteResponsePage({ params }: QuoteResponsePageProps) {
  const template = await getQuoteTemplateWithItems(params.id);
  
  if (!template || !template.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{template.title}</h1>
          {template.description && (
            <p className="text-zinc-300 text-lg">{template.description}</p>
          )}
        </div>
        
        <QuoteResponseForm template={template} />
      </div>
    </div>
  );
}