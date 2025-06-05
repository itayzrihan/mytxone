# Meditation Flow Implementation Guide

## Overview

The meditation tool has been successfully updated to use UI cards instead of text-based prompts. When a user asks for meditation or the AI recognizes they might need one, the system now automatically shows interactive UI cards that guide them through the meditation creation process.

## New Flow Architecture

### 1. Trigger Phase
- **User Request**: "I need meditation" or AI recognizes stress/meditation need
- **AI Response**: Automatically calls `showMeditationTypeSelector` tool
- **UI Display**: Shows cards with 10 meditation types

### 2. Type Selection Phase
- **User Action**: Clicks on desired meditation type card
- **Component**: `MeditationTypesSelector` sends chat message
- **AI Response**: Calls `showMeditationPromptSelector` tool with selected type
- **UI Display**: Shows intention options card

### 3. Intention Selection Phase
- **User Action**: Chooses between "Chat History" or "Custom Intention" 
- **Component**: `MeditationPromptSelector` sends appropriate chat message
- **AI Response**: Calls `generateMeditationContent` with selected approach
- **UI Display**: Shows generated meditation content

## Available Meditation Types

The system offers 10 meditation types through interactive cards:

1. **Visualization** - Guided imagery and mental visualization
2. **Mindfulness** - Present moment awareness and observation  
3. **Sleep Story** - Calming narratives for peaceful sleep
4. **Loving Kindness** - Compassion and love meditation
5. **Chakra Balancing** - Energy center alignment and healing
6. **Breath Awareness** - Focus on breathing patterns and rhythms
7. **Affirmations** - Positive self-talk and empowerment
8. **Concentration** - Single-pointed focus and attention training
9. **Body Scan** - Progressive relaxation and body awareness
10. **Memory Palace Enhancement** - Cognitive enhancement and memory techniques

## Implementation Details

### New Action Functions
- `showMeditationTypeSelectorAction()` - Returns signal to show type selector UI
- `showMeditationPromptSelectorAction(type)` - Returns signal to show intention selector UI

### New AI Tools
- `showMeditationTypeSelector` - Displays meditation type cards
- `showMeditationPromptSelector` - Displays intention selection options

### Updated System Prompt
```
- here's the optimal meditation flow
  - when user asks for meditation or you recognize they might need one, ALWAYS use showMeditationTypeSelector tool to show the UI cards
  - DO NOT ask what type of meditation they want - always show the UI selector instead
  - after they select a type (they will tell you which one), use showMeditationPromptSelector tool to show the intention options
  - then proceed with generateMeditationContent based on their choice
```

### Component Integration
- `MeditationTypesSelector` - Grid of 10 meditation type cards with icons and descriptions
- `MeditationPromptSelector` - Two options for creating meditation based on chat history or custom intention
- Both components integrate with chat via `useChat` hook to trigger next steps

## File Structure

```
components/meditations/
├── meditation-types-selector.tsx      # Main type selection UI
├── meditation-prompt-selector.tsx     # Intention selection UI  
├── meditation-display.tsx             # Generated meditation display
├── meditation-confirmation.tsx        # Save/delete confirmations
└── list-meditations.tsx              # Saved meditations list

ai/
└── actions.ts                         # New action functions added

app/(chat)/api/chat/
└── route.ts                          # New tools and updated system prompt

components/custom/
└── message.tsx                       # Updated to render new tool results
```

## Usage Examples

### Trigger Meditation Flow
- User: "I'm feeling stressed, can you help me meditate?"
- AI: Automatically shows meditation type selector cards

### Select Meditation Type  
- User clicks "Mindfulness" card
- AI: Shows prompt selector with chat history vs custom intention options

### Choose Creation Method
- User clicks "Based on Our Conversation" 
- AI: Generates mindfulness meditation based on recent chat context

## Benefits

1. **Visual Interface**: Users can see all options at once instead of guessing
2. **Guided Flow**: Clear step-by-step process with visual feedback
3. **Consistent UX**: Matches existing pattern used for tasks and other features
4. **Reduced Friction**: No need to type meditation types or remember options
5. **Accessible**: Icons and descriptions help users understand each meditation type
6. **Chat Integration**: Seamless integration with existing chat conversation flow

## Testing

1. Start the application: `npm run dev`
2. Navigate to chat interface
3. Type: "I need meditation" or "Help me relax"
4. Verify meditation type selector cards appear
5. Click any meditation type card
6. Verify intention selector appears
7. Test both "Chat History" and "Custom Intention" flows
8. Confirm meditation content is generated and displayed properly

The implementation successfully replaces text-based meditation type requests with an intuitive, visual UI that enhances user experience and follows the established patterns in the application.
