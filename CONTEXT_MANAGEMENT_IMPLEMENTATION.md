# Context Management System Implementation

## Overview
The Anna API now implements a comprehensive Context Management System with **backward compatibility**. The system accepts both the new context management format and the legacy message format, ensuring smooth transition without breaking existing functionality.

## Supported Request Formats

### Format 1: New Context Management Structure (Recommended)
```json
{
  "contextManagement": {
    "currentMessage": {
      "role": "user", // or "frontend_operator"
      "content": "Add a task to buy milk",
      "timestamp": "2025-07-07T10:30:00Z",
      "messageId": "msg-123"
    },
    "conversationContext": [
      {
        "role": "user",
        "content": "Hello",
        "timestamp": "2025-07-07T10:29:00Z",
        "messageId": "msg-122"
      },
      {
        "role": "assistant",
        "content": "Hi! How can I help you?",
        "timestamp": "2025-07-07T10:29:30Z",
        "messageId": "msg-122-response"
      }
    ]
  },
  "userLanguage": "en",
  "userTimezone": "America/New_York"
}
```

### Format 2: Legacy Format (Backward Compatible)
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant", 
      "content": "Hi! How can I help you?"
    },
    {
      "role": "user",
      "content": "Add a task to buy milk"
    }
  ],
  "userLanguage": "en",
  "userTimezone": "America/New_York"
}
```

## Automatic Format Detection & Processing

The system automatically detects which format is being used and processes accordingly:

### Context Management Format Processing
- Current message is clearly flagged with `[CURRENT MESSAGE FROM USER/FRONTEND_OPERATOR]`
- Historical context is preserved for understanding
- Full context awareness throughout the agent chain

### Legacy Format Processing  
- Last message in the array is treated as the current message
- Previous messages provide conversation context
- Internally converted to context management structure for consistency

## System Behavior Based on Format

### When Using Context Management Format
- Anna receives clear instructions about context vs. current message
- Agents get structured context information
- Enhanced logging and debugging capabilities
- Full support for frontend operator messages

### When Using Legacy Format
- System automatically converts to internal context management structure
- Last message becomes the "current message"  
- Previous messages become "conversation context"
- Maintains full compatibility with existing clients

## Internal Processing

### Message Transformation (Context Management)
```typescript
const currentMessage: Message = {
  role: contextManagement.currentMessage.role === 'frontend_operator' ? 'assistant' : 'user',
  content: `[CURRENT MESSAGE FROM ${contextManagement.currentMessage.role.toUpperCase()}]: ${contextManagement.currentMessage.content}`,
  id: contextManagement.currentMessage.messageId || `current-${Date.now()}`
};
```

### Message Transformation (Legacy)
```typescript
// Converts legacy format to context management structure internally
const lastMessage = legacyMessages[legacyMessages.length - 1];
const historicalMessages = legacyMessages.slice(0, -1);
```

## Benefits of the Dual-Format Approach

1. **Zero Breaking Changes**: Existing clients continue to work without modification
2. **Gradual Migration**: Teams can migrate to context management format at their own pace
3. **Enhanced Features**: New format provides better context awareness and debugging
4. **Future-Proof**: Foundation for advanced context management features
5. **Consistent Internal Processing**: Both formats use the same backend logic

## Migration Strategy

### Phase 1: Backward Compatibility (Current)
- ✅ Support both formats simultaneously
- ✅ Maintain existing functionality
- ✅ Enhanced logging for both formats

### Phase 2: Gradual Adoption
- Update frontend clients to use context management format
- Monitor usage patterns and format adoption
- Provide migration guides and examples

### Phase 3: Full Context Management
- Deprecate legacy format with proper notice
- Full context management features enabled
- Advanced context-aware functionality

## Format Detection Logic

The system uses Zod union schemas to automatically detect and validate the format:

```typescript
const chatRequestSchema = z.union([
  // New Context Management Format
  z.object({
    contextManagement: z.object({...}),
    userLanguage: z.string().optional().default('en'),
    userTimezone: z.string().optional(),
  }),
  // Legacy Format (for backward compatibility)  
  z.object({
    messages: z.array(z.object({...})).min(1),
    userLanguage: z.string().optional().default('en'),
    userTimezone: z.string().optional(),
  })
]);
```

## Error Handling

- Invalid formats are clearly rejected with descriptive error messages
- Both formats undergo proper validation
- Graceful fallbacks for edge cases
- Comprehensive logging for debugging

This implementation ensures that the transition to context management is smooth and non-breaking while providing the foundation for enhanced context-aware AI interactions.
