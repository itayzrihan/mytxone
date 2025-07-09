// Anna Actions - Simplified to only include SingleStepAgent tool
// Anna is a simple assistant that forwards complex requests to the full Mytx system

export async function callSingleStepAgentAction({
  userAnswer,
  singleStepRequest,
  originalMessage,
  languageInstruction,
  userTimezone,
}: {
  userAnswer: string;
  singleStepRequest: string;
  originalMessage: string;
  languageInstruction?: string;
  userTimezone?: string;
}) {
  console.log(`[Anna CallSingleStepAgent] Processing request`);
  console.log(`[Anna CallSingleStepAgent] User Answer: ${userAnswer}`);
  console.log(`[Anna CallSingleStepAgent] SingleStepAgent Request: ${singleStepRequest}`);
  console.log(`[Anna CallSingleStepAgent] Original Message: ${originalMessage}`);
  console.log(`[Anna CallSingleStepAgent] Language Instruction: ${languageInstruction}`);
  console.log(`[Anna CallSingleStepAgent] User Timezone: ${userTimezone || 'not provided'}`);
  
  // This function now serves as a logging/tracking point for the CallSingleStepAgent action
  // The actual SingleStepAgent communication is handled in the route.ts file after calling this function
  // This allows us to track and process the CallSingleStepAgent action while keeping the complex
  // stream handling logic in the route file where it has access to the request context
  
  // Return the processed request data for the route handler to use
  return {
    userAnswer,
    singleStepRequest,
    originalMessage,
    languageInstruction,
    userTimezone,
    status: "processed" as const,
    timestamp: new Date().toISOString(),
  };
}
