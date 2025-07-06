# Anna Enhancement: Complexity Detection and StepsDesigning Integration

## Overview
Enhanced Anna to intelligently detect request complexity and route them to appropriate services:
- **Single-step operations** → CallMytx (existing behavior)  
- **Multi-step complex operations** → CallStepsDesigning (new service)

## Changes Made

### 1. Created StepsDesigningService
**File**: `d:\Ordered\DEV\GeminiChat\mytx-ai\services\stepsDesigningService.ts`

- **Purpose**: Enhanced agent that can interact with crew of agents
- **Current Function**: Structure steps for completing complex missions and stream them to user
- **Future Enhancement**: Will coordinate with other specialized agents
- **Key Features**:
  - Analyzes complex multi-step requests
  - Provides detailed step-by-step planning
  - Streams structured guidance to users
  - Responds in user's language (Hebrew/English)

### 2. Enhanced Anna Agent Route
**File**: `d:\Ordered\DEV\GeminiChat\mytx-ai\app\api\heybos\anna\route.ts`

#### Added Import
```typescript
import { stepsDesigningService } from "@/services/stepsDesigningService";
```

#### Enhanced System Prompt
- Added **COMPLEXITY ANALYSIS** section
- Clear distinction between single-step vs multi-step operations
- Examples for each complexity level
- Detailed tool usage rules

#### Added CallStepsDesigning Tool
New tool alongside existing CallMytx:
```typescript
CallStepsDesigning: {
  description: "Call the StepsDesigning agent to handle COMPLEX MULTI-STEP operations...",
  parameters: z.object({
    userAnswer: z.string().describe("Natural response indicating planning assistance"),
    stepsRequest: z.string().describe("Description of complex operation needing step-by-step planning"),
    originalMessage: z.string().describe("Exact original user message"),
  }),
  execute: async ({ userAnswer, stepsRequest, originalMessage }) => {
    // Implementation with stepsDesigningService call
  }
}
```

#### Enhanced Stream Processing
- Modified transform stream to handle both tool types
- CallMytx results: Stream userAnswer + inject tool invocations
- CallStepsDesigning results: Stream userAnswer + stream steps content as text chunks
- Proper error handling for both tool types

## Request Routing Logic

### Single-Step Operations (Use CallMytx)
- Add one task (simple creation)
- Find/search for existing tasks, memories, information
- Simple deletions with clear identification
- Basic memory storage
- Simple meditation creation
- Weather lookup
- Any action requiring only ONE step

**Examples:**
- "תוסיף לי משימה לקנות חלב" → CallMytx
- "חפש לי משימה עם המילה ריצה" → CallMytx

### Multi-Step Complex Operations (Use CallStepsDesigning)
- Delete specific task by name/description (search → identify → confirm → delete)
- Edit/update tasks with new information (find → select → gather → update → verify)
- Add AND remove memories in same request (multiple operations)
- Complex task management with multiple operations
- Operations requiring confirmation or verification steps

**Examples:**
- "תמחק משימה שנקראת לרוץ 2 קילומטר" → CallStepsDesigning
- "תערוך משימה ותשנה אותה לאכול פירות" → CallStepsDesigning
- "תוסיף זיכרון ותמחק זיכרון" → CallStepsDesigning

## Streaming Behavior

### Anna's Response Flow
1. **Anna streams her userAnswer first** (always shown to user immediately)
2. **Then streams appropriate content**:
   - **CallMytx**: Injects tool invocations for UI rendering
   - **CallStepsDesigning**: Streams step-by-step guidance as text chunks

### User Experience
- **Single-step requests**: Anna's friendly response + task/memory UI components
- **Complex requests**: Anna's planning response + detailed step-by-step guidance
- **Seamless experience**: User always sees Anna's personality + appropriate functionality

## Technical Implementation Details

### StepsDesigning Service Features
- Input validation with Zod schema
- Stream-based response for real-time feedback
- Comprehensive error handling
- Telemetry support
- User language preservation

### Enhanced Anna Stream Transform
- Detects tool result types
- Handles CallMytx tool injection (existing)
- Handles CallStepsDesigning text streaming (new)
- Chunks large step content for better streaming
- Maintains backward compatibility

### Error Handling
- Service-level error handling in StepsDesigningService
- Stream-level error handling in Anna's transform
- Graceful degradation for both tool types
- User-friendly error messages

## Future Enhancements

### StepsDesigning Agent Evolution
- **Phase 1** (Current): Step-by-step planning and guidance
- **Phase 2** (Future): Coordinate with crew of specialized agents
- **Phase 3** (Future): Execute multi-step plans with agent coordination

### Additional Complexity Detection
- Could add more sophisticated complexity analysis
- Machine learning-based routing decisions
- User preference learning for tool selection

## Testing Recommendations

### Simple Operations (Should use CallMytx)
- "Add task to buy groceries"
- "Find tasks about exercise"
- "Save memory about meeting"
- "Get weather for New York"

### Complex Operations (Should use CallStepsDesigning)
- "Delete the task called 'run 2 miles'"
- "Edit my exercise task to be about swimming instead"
- "Add a memory about my birthday and remove the old one"
- "Update my morning routine tasks and reorganize them"

## Benefits

1. **Intelligent Routing**: Right tool for right complexity
2. **Enhanced User Experience**: Appropriate response type for each request
3. **Scalable Architecture**: Easy to add more specialized agents
4. **Maintained Simplicity**: Single Anna interface for all interactions
5. **Future-Ready**: Foundation for multi-agent coordination

## Backwards Compatibility

- All existing CallMytx functionality preserved
- Existing tool invocations work unchanged
- UI components render normally
- No breaking changes to frontend integration
