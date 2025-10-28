# Create Meeting Dialog - Step 1 Layout

## Visual Structure

```
┌─────────────────────────────────────────────────────┐
│                 CREATE NEW MEETING                  │
│                   Step 1 of 3                       │
│                                                     │
│                    ℹ️ Basic Information              │
│              Tell us about your meeting             │
│                                                     │
│ Title *                                             │
│ [_________________________________]               │
│                                                     │
│ Description                                         │
│ [_________________________________]               │
│ [_________________________________]               │
│ [_________________________________]               │
│                                                     │
│ ┌─────────────────────────────────┐               │
│ │   Meeting Type *   │  Category * │               │
│ ├─────────────────────┼─────────────┤               │
│ │ [Webinar ▼]       │ [Business ▼] │               │
│ │                   │              │               │
│ │ • Webinar         │ • Business 💼│               │
│ │ • Conference      │ • Technology 💻               │
│ │ • Workshop        │ • Health 🏥   │               │
│ │ • Training        │ • Education 📚               │
│ │ • Consultation    │ • Entertainment 🎬           │
│ │ • Demo            │ • Sports ⚽    │               │
│ │ • Networking      │ • Travel ✈️   │               │
│ │ • Seminar         │ • Food 🍕     │               │
│ │ • Panel           │ • Music 🎵    │               │
│ │ • Hackathon       │ • Art 🎨      │               │
│ │ • Meetup          │ • Science 🔬  │               │
│ │ • Masterclass     │ • Finance 💰  │               │
│ │ • Office Hours    │ • Fashion 👗  │               │
│ │ • Q&A             │ • Gaming 🎮   │               │
│ │ • Other           │ • Nature 🌿   │               │
│ └─────────────────────┴─────────────┘               │
│                                                     │
│                          [Cancel]  [Next ▶]        │
└─────────────────────────────────────────────────────┘
```

## Form Fields

### Field 1: Title
- **Type**: Text Input
- **Required**: Yes
- **Placeholder**: "Enter meeting title"
- **Validation**: Non-empty string

### Field 2: Description
- **Type**: Textarea
- **Required**: No
- **Rows**: 3
- **Placeholder**: "Describe your meeting (optional)"

### Field 3: Meeting Type (Left Column - 50%)
- **Type**: Select Dropdown
- **Required**: Yes
- **Default**: "webinar"
- **Options** (15 types):
  1. Webinar
  2. Conference
  3. Workshop
  4. Training Session
  5. Consultation
  6. Product Demo
  7. Networking Event
  8. Seminar
  9. Panel Discussion
  10. Hackathon
  11. Meetup
  12. Masterclass
  13. Office Hours
  14. Q&A Session
  15. Other

### Field 4: Category (Right Column - 50%)
- **Type**: Select Dropdown
- **Required**: Yes
- **Default**: First category (Business)
- **Options** (15 categories with emojis):
  1. 💼 Business
  2. 💻 Technology
  3. 🏥 Health
  4. 📚 Education
  5. 🎬 Entertainment
  6. ⚽ Sports
  7. ✈️ Travel
  8. 🍕 Food
  9. 🎵 Music
  10. 🎨 Art
  11. 🔬 Science
  12. 💰 Finance
  13. 👗 Fashion
  14. 🎮 Gaming
  15. 🌿 Nature

## Two-Column Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Meeting Type *              │  Category *                 │
│  ┌─────────────────────────┐  │  ┌──────────────────────┐  │
│  │ Webinar ▼              │  │  │ Business 💼 ▼       │  │
│  │                         │  │  │                      │  │
│  │ • Webinar               │  │  │ • Business 💼        │  │
│  │ • Conference            │  │  │ • Technology 💻      │  │
│  │ • Workshop              │  │  │ • Health 🏥         │  │
│  │ • Training Session      │  │  │ • Education 📚      │  │
│  │ • Consultation          │  │  │ • Entertainment 🎬  │  │
│  │ • Product Demo          │  │  │ • Sports ⚽         │  │
│  │ • Networking Event      │  │  │ • Travel ✈️        │  │
│  │ • Seminar               │  │  │ • Food 🍕          │  │
│  │ • Panel Discussion      │  │  │ • Music 🎵         │  │
│  │ • Hackathon             │  │  │ • Art 🎨           │  │
│  │ • Meetup                │  │  │ • Science 🔬       │  │
│  │ • Masterclass           │  │  │ • Finance 💰       │  │
│  │ • Office Hours          │  │  │ • Fashion 👗       │  │
│  │ • Q&A Session           │  │  │ • Gaming 🎮        │  │
│  │ • Other                 │  │  │ • Nature 🌿        │  │
│  └─────────────────────────┘  │  └──────────────────────┘  │
│                                │                            │
│  (50% width, gap-4)           │  (50% width, gap-4)        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Responsive Behavior

- **Desktop**: Two columns side-by-side (grid-cols-2)
- **Tablet**: Adjusts with gap-4 spacing
- **Mobile**: Stacks to single column (automatic grid wrapping)

## Integration Points

### Used In:
1. **Create Meeting Dialog** - Step 1 form
2. **Main Page Categories** - Filter capsules (uses same category list)

### Data Flow:
1. User selects Meeting Type (15 options)
2. User selects Category (15 options with emoji)
3. Both values stored in `formData` state
4. Passed to API on form submission
5. Stored in database

### Validation:
- Both fields are required for Step 1 to pass
- Validates in `validateStep(1)` function
- Shows error toast if either field is missing
