import "server-only";

import { desc, eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
const { 
  quoteTemplates, 
  quoteItems, 
  quoteOptions, 
  quoteResponses 
} = schema;
import type { 
  QuoteTemplate,
  QuoteItem,
  QuoteOption,
  QuoteResponse
} from "./schema";

// Lazy database initialization
let pool: ReturnType<typeof postgres> | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getDb() {
  if (!dbInstance) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL or POSTGRES_URL environment variable is not set");
    }
    pool = postgres(connectionString, { max: 1 });
    dbInstance = drizzle(pool, { schema });
  }
  return dbInstance;
}

const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(target, prop) {
    return (getDb() as any)[prop];
  }
});

// Quote Template Queries
export async function createQuoteTemplate(data: {
  userId: string;
  title: string;
  description?: string;
  businessType: string;
  allowGuestSubmissions?: boolean;
}) {
  const [template] = await db
    .insert(quoteTemplates)
    .values({
      userId: data.userId,
      title: data.title,
      description: data.description,
      businessType: data.businessType,
      allowGuestSubmissions: data.allowGuestSubmissions ?? true,
    })
    .returning();
  
  return template;
}

export async function getUserQuoteTemplates(userId: string) {
  return await db
    .select()
    .from(quoteTemplates)
    .where(eq(quoteTemplates.userId, userId))
    .orderBy(desc(quoteTemplates.createdAt));
}

export async function getQuoteTemplateById(templateId: string) {
  const [template] = await db
    .select()
    .from(quoteTemplates)
    .where(eq(quoteTemplates.id, templateId));
  
  return template;
}

export async function getQuoteTemplateWithItems(templateId: string) {
  const template = await getQuoteTemplateById(templateId);
  if (!template) return null;

  const items = await db
    .select()
    .from(quoteItems)
    .where(eq(quoteItems.templateId, templateId))
    .orderBy(quoteItems.displayOrder);

  const itemsWithOptions = await Promise.all(
    items.map(async (item: QuoteItem) => {
      const options = await db
        .select()
        .from(quoteOptions)
        .where(eq(quoteOptions.itemId, item.id))
        .orderBy(quoteOptions.displayOrder);
      
      return { ...item, options };
    })
  );

  return { ...template, items: itemsWithOptions };
}

export async function updateQuoteTemplate(
  templateId: string, 
  data: Partial<Pick<QuoteTemplate, 'title' | 'description' | 'businessType' | 'isActive' | 'allowGuestSubmissions'>>
) {
  const [updatedTemplate] = await db
    .update(quoteTemplates)
    .set({ 
      ...data, 
      updatedAt: new Date() 
    })
    .where(eq(quoteTemplates.id, templateId))
    .returning();
  
  return updatedTemplate;
}

export async function deleteQuoteTemplate(templateId: string) {
  await db
    .delete(quoteTemplates)
    .where(eq(quoteTemplates.id, templateId));
}

// Quote Item Queries
export async function createQuoteItem(data: {
  templateId: string;
  title: string;
  description?: string;
  isRequired?: boolean;
  itemType: string;
  fixedPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  parameterType?: string;
  parameterUnit?: string;
  parameterPricingMode?: string;
  pricePerUnit?: number;
  minPricePerUnit?: number;
  maxPricePerUnit?: number;
  minUnits?: number;
  maxUnits?: number;
  displayOrder?: number;
}) {
  const [item] = await db
    .insert(quoteItems)
    .values({
      templateId: data.templateId,
      title: data.title,
      description: data.description,
      isRequired: data.isRequired ?? false,
      itemType: data.itemType,
      fixedPrice: data.fixedPrice?.toString(),
      minPrice: data.minPrice?.toString(),
      maxPrice: data.maxPrice?.toString(),
      parameterType: data.parameterType,
      parameterUnit: data.parameterUnit,
      parameterPricingMode: data.parameterPricingMode,
      pricePerUnit: data.pricePerUnit?.toString(),
      minPricePerUnit: data.minPricePerUnit?.toString(),
      maxPricePerUnit: data.maxPricePerUnit?.toString(),
      minUnits: data.minUnits,
      maxUnits: data.maxUnits,
      displayOrder: data.displayOrder ?? 0,
    })
    .returning();
  
  return item;
}

export async function updateQuoteItem(
  itemId: string,
  data: Partial<Omit<QuoteItem, 'id' | 'templateId' | 'createdAt'>>
) {
  const [updatedItem] = await db
    .update(quoteItems)
    .set(data)
    .where(eq(quoteItems.id, itemId))
    .returning();
  
  return updatedItem;
}

export async function deleteQuoteItem(itemId: string) {
  await db
    .delete(quoteItems)
    .where(eq(quoteItems.id, itemId));
}

// Quote Option Queries
export async function createQuoteOption(data: {
  itemId: string;
  title: string;
  description?: string;
  pricingType?: string;
  fixedPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  displayOrder?: number;
}) {
  const [option] = await db
    .insert(quoteOptions)
    .values({
      itemId: data.itemId,
      title: data.title,
      description: data.description,
      pricingType: data.pricingType || 'fixed',
      fixedPrice: data.fixedPrice?.toString(),
      minPrice: data.minPrice?.toString(),
      maxPrice: data.maxPrice?.toString(),
      displayOrder: data.displayOrder ?? 0,
    })
    .returning();
  
  return option;
}

export async function updateQuoteOption(
  optionId: string,
  data: Partial<Omit<QuoteOption, 'id' | 'itemId' | 'createdAt'>>
) {
  const [updatedOption] = await db
    .update(quoteOptions)
    .set(data)
    .where(eq(quoteOptions.id, optionId))
    .returning();
  
  return updatedOption;
}

export async function deleteQuoteOption(optionId: string) {
  await db
    .delete(quoteOptions)
    .where(eq(quoteOptions.id, optionId));
}

// Quote Response Queries
export async function createQuoteResponse(data: {
  templateId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  selectedItems: any[];
  selectedOptions: any[];
  parameterValues?: any;
  totalMinPrice?: number;
  totalMaxPrice?: number;
  notes?: string;
}) {
  const [response] = await db
    .insert(quoteResponses)
    .values({
      templateId: data.templateId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      selectedItems: data.selectedItems,
      selectedOptions: data.selectedOptions,
      parameterValues: data.parameterValues,
      totalMinPrice: data.totalMinPrice?.toString(),
      totalMaxPrice: data.totalMaxPrice?.toString(),
      notes: data.notes,
    })
    .returning();
  
  return response;
}

export async function getTemplateResponses(templateId: string) {
  return await db
    .select()
    .from(quoteResponses)
    .where(eq(quoteResponses.templateId, templateId))
    .orderBy(desc(quoteResponses.createdAt));
}

export async function getUserQuoteResponses(userId: string) {
  return await db
    .select({
      response: quoteResponses,
      template: quoteTemplates,
    })
    .from(quoteResponses)
    .innerJoin(quoteTemplates, eq(quoteResponses.templateId, quoteTemplates.id))
    .where(eq(quoteTemplates.userId, userId))
    .orderBy(desc(quoteResponses.createdAt));
}

export async function updateQuoteResponseStatus(responseId: string, status: string) {
  const [updatedResponse] = await db
    .update(quoteResponses)
    .set({ status })
    .where(eq(quoteResponses.id, responseId))
    .returning();
  
  return updatedResponse;
}

export async function getQuoteResponseById(responseId: string) {
  const [response] = await db
    .select()
    .from(quoteResponses)
    .where(eq(quoteResponses.id, responseId));
  
  return response;
}

// Helper function to update template items
export async function updateTemplateItems(templateId: string, items: any[]) {
  // First get all item IDs for this template
  const existingItems = await db
    .select({ id: quoteItems.id })
    .from(quoteItems)
    .where(eq(quoteItems.templateId, templateId));

  // Delete all existing options for these items
  if (existingItems.length > 0) {
    for (const item of existingItems) {
      await db
        .delete(quoteOptions)
        .where(eq(quoteOptions.itemId, item.id));
    }
  }
  
  // Delete all existing items for this template
  await db
    .delete(quoteItems)
    .where(eq(quoteItems.templateId, templateId));

  // Now create the new items
  for (const [index, item] of items.entries()) {
    const [newItem] = await db
      .insert(quoteItems)
      .values({
        templateId,
        title: item.title,
        description: item.description || null,
        isRequired: item.isRequired || false,
        itemType: item.itemType,
        fixedPrice: item.fixedPrice ? item.fixedPrice.toString() : null,
        minPrice: item.minPrice ? item.minPrice.toString() : null,
        maxPrice: item.maxPrice ? item.maxPrice.toString() : null,
        parameterType: item.parameterType || null,
        parameterUnit: item.parameterUnit || null,
        parameterPricingMode: item.parameterPricingMode || null,
        pricePerUnit: item.pricePerUnit ? item.pricePerUnit.toString() : null,
        minPricePerUnit: item.minPricePerUnit ? item.minPricePerUnit.toString() : null,
        maxPricePerUnit: item.maxPricePerUnit ? item.maxPricePerUnit.toString() : null,
        minUnits: item.minUnits || null,
        maxUnits: item.maxUnits || null,
        displayOrder: index,
      })
      .returning();

    // Create options for this item
    if (item.options && item.options.length > 0) {
      for (const [optionIndex, option] of item.options.entries()) {
        await db
          .insert(quoteOptions)
          .values({
            itemId: newItem.id,
            title: option.title,
            description: option.description || null,
            pricingType: option.pricingType || 'fixed',
            fixedPrice: option.fixedPrice ? option.fixedPrice.toString() : null,
            minPrice: option.minPrice ? option.minPrice.toString() : null,
            maxPrice: option.maxPrice ? option.maxPrice.toString() : null,
            displayOrder: optionIndex,
          });
      }
    }
  }
}

// Enhanced updateQuoteTemplate that handles both template and items
export async function updateQuoteTemplateWithItems(
  templateId: string, 
  data: {
    title?: string;
    description?: string;
    businessType?: string;
    isActive?: boolean;
    allowGuestSubmissions?: boolean;
    items?: any[];
  }
) {
  // Update template properties
  const { items, ...templateData } = data;
  
  const [updatedTemplate] = await db
    .update(quoteTemplates)
    .set({ 
      ...templateData, 
      updatedAt: new Date() 
    })
    .where(eq(quoteTemplates.id, templateId))
    .returning();

  // Update items if provided
  if (items !== undefined) {
    await updateTemplateItems(templateId, items);
  }
  
  return updatedTemplate;
}