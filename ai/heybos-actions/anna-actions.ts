// Anna Actions - Simplified to only include CallMytx tool
// Anna is a simple assistant that forwards complex requests to the full Mytx system

export async function callMytxAction({
  userAnswer,
  mytxRequest,
  originalMessage,
  languageInstruction,
  userTimezone,
}: {
  userAnswer: string;
  mytxRequest: string;
  originalMessage: string;
  languageInstruction?: string;
  userTimezone?: string;
}) {
  console.log(`[Anna CallMytx] Processing request`);
  console.log(`[Anna CallMytx] User Answer: ${userAnswer}`);
  console.log(`[Anna CallMytx] Mytx Request: ${mytxRequest}`);
  console.log(`[Anna CallMytx] Original Message: ${originalMessage}`);
  console.log(`[Anna CallMytx] Language Instruction: ${languageInstruction}`);
  console.log(`[Anna CallMytx] User Timezone: ${userTimezone || 'not provided'}`);
  
  // This function now serves as a logging/tracking point for the CallMytx action
  // The actual Mytx communication is handled in the route.ts file after calling this function
  // This allows us to track and process the CallMytx action while keeping the complex
  // stream handling logic in the route file where it has access to the request context
  
  // Return the processed request data for the route handler to use
  return {
    userAnswer,
    mytxRequest,
    originalMessage,
    languageInstruction,
    userTimezone,
    status: "processed" as const,
    timestamp: new Date().toISOString(),
  };
}
