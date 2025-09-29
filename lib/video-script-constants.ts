// Video Script Languages (10 most popular + Hebrew)
export const VIDEO_LANGUAGES = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "russian", label: "Russian" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "arabic", label: "Arabic" },
  { value: "hebrew", label: "Hebrew" },
] as const;

// Main Content Types for Video Scripts (70+ powerful content types organized by category)
export interface ContentType {
  value: string;
  label: string;
  description: string;
  example: string;
  structure: string;
  category?: string;
  isTrending?: boolean;
  isPowerful?: boolean;
  isAuthorityBuilding?: boolean;
}

export const MAIN_CONTENT_TYPES: ContentType[] = [
  // � EDUCATIONAL & INSTRUCTIONAL
  {
    value: "storytelling",
    label: "Storytelling",
    description: "Share compelling narratives that connect emotionally with your audience",
    example: "How I went from broke to building a million-dollar business by age 25",
    structure: "Setting: [Where/when it happened] + Challenge: [What went wrong] + Journey: [How you overcame it] + Transformation: [What changed] + Lesson: [What others can learn]",
    category: "Educational & Instructional"
  },
  {
    value: "tutorial",
    label: "Tutorial",
    description: "Step-by-step instructional content that teaches specific skills",
    example: "How to edit videos like a pro in 10 minutes using free software",
    structure: "Introduction: [What they'll learn] + Prerequisites: [What they need] + Step 1, 2, 3... [Clear sequential steps] + Final result: [What they've achieved]",
    category: "Educational & Instructional"
  },
  {
    value: "case-study",
    label: "Case Study",
    description: "Detailed analysis of real results, strategies, or processes",
    example: "How this small business increased sales by 300% in 90 days",
    structure: "Situation: [Initial state] + Strategy: [What was implemented] + Results: [Specific outcomes] + Analysis: [Why it worked] + Application: [How others can replicate]",
    category: "Educational & Instructional"
  },
  {
    value: "behind-scenes",
    label: "Behind the Scenes",
    description: "Exclusive look at your process, workspace, or personal life",
    example: "What my morning routine actually looks like as a content creator",
    structure: "Setup: [What you're showing] + Reality: [Honest behind-the-scenes moments] + Insights: [What most people don't see] + Takeaways: [Lessons for viewers]",
    category: "Educational & Instructional"
  },
  {
    value: "product-demo",
    label: "Product Demo",
    description: "Showcase how products work and their benefits in action",
    example: "Testing the viral productivity app everyone's talking about",
    structure: "Introduction: [What you're testing] + Setup: [How you'll test it] + Demo: [Show it in action] + Pros/Cons: [Honest assessment] + Verdict: [Your recommendation]",
    category: "Educational & Instructional"
  },
  {
    value: "testimonial",
    label: "Testimonial",
    description: "Share success stories and social proof from real users",
    example: "Students share how this course changed their careers in 30 days",
    structure: "Background: [Who they were before] + Problem: [What they struggled with] + Solution: [What helped them] + Results: [Specific outcomes] + Advice: [What they'd tell others]",
    category: "Educational & Instructional"
  },
  {
    value: "listicle",
    label: "Listicle",
    description: "Numbered or bulleted list content that's easy to consume",
    example: "7 habits that will make you 10x more productive starting today",
    structure: "Hook: [Why this list matters] + Item 1, 2, 3... [Each with explanation/example] + Bonus tip: [Extra value] + Call to action: [What to do next]",
    category: "Educational & Instructional"
  },
  {
    value: "comparison",
    label: "Comparison",
    description: "Side-by-side analysis of different options, tools, or methods",
    example: "iPhone vs Android: Which is actually better for content creators?",
    structure: "Context: [What you're comparing] + Criteria: [How you'll judge] + Option A vs B: [Direct comparisons] + Winner: [Best choice] + Recommendation: [For different users]",
    category: "Educational & Instructional"
  },
  {
    value: "challenge",
    label: "Challenge",
    description: "Time-bound goals or experiments that engage your audience",
    example: "I tried waking up at 4 AM for 30 days - here's what happened",
    structure: "Challenge: [What you're attempting] + Rules: [The parameters] + Day-by-day: [Progress updates] + Results: [What you achieved] + Lessons: [What you learned]",
    category: "Educational & Instructional"
  },
  {
    value: "q-and-a",
    label: "Q&A",
    description: "Answer audience questions to provide value and build connection",
    example: "Answering your most asked questions about starting an online business",
    structure: "Introduction: [How you collected questions] + Question 1, 2, 3... [Each with detailed answer] + Follow-up: [Additional resources] + Ask more: [Encourage more questions]",
    category: "Educational & Instructional"
  },
  {
    value: "transformation",
    label: "Transformation",
    description: "Document dramatic before-and-after changes or improvements",
    example: "My complete life transformation: From depressed to thriving",
    structure: "Before: [Starting point/problems] + Catalyst: [What sparked change] + Process: [Steps taken] + After: [Current state] + Lessons: [Key insights for others]",
    category: "Educational & Instructional"
  },
  {
    value: "myth-busting",
    label: "Myth Busting",
    description: "Debunk common misconceptions in your industry or topic",
    example: "5 productivity myths that are actually making you less efficient",
    structure: "Myth: [Common belief] + Reality: [The truth] + Evidence: [Why it's wrong] + Better approach: [What works instead] + Impact: [How this changes things]",
    category: "Educational & Instructional"
  },
  {
    value: "day-in-life",
    label: "Day in the Life",
    description: "Take viewers through your typical day or routine",
    example: "What a day in the life of a successful entrepreneur really looks like",
    structure: "Morning: [How you start] + Work time: [Your productive hours] + Breaks: [How you recharge] + Evening: [How you wind down] + Insights: [Productivity tips]",
    category: "Educational & Instructional"
  },
  {
    value: "reaction",
    label: "Reaction",
    description: "Respond to trending content, news, or viral topics",
    example: "Marketing expert reacts to viral TikTok business advice",
    structure: "Context: [What you're reacting to] + Initial thoughts: [First impressions] + Analysis: [Deeper breakdown] + Agreement/disagreement: [Your stance] + Better advice: [Your recommendations]",
    category: "Educational & Instructional"
  },
  {
    value: "experiment",
    label: "Experiment",
    description: "Test theories, strategies, or ideas and share the results",
    example: "I spent $1000 on Instagram ads - here's exactly what happened",
    structure: "Hypothesis: [What you're testing] + Method: [How you'll test it] + Variables: [What you're measuring] + Results: [What actually happened] + Conclusions: [What it means]",
    category: "Educational & Instructional"
  },
  {
    value: "interview",
    label: "Interview",
    description: "Conversations with experts, influencers, or interesting people",
    example: "How this 22-year-old built a 7-figure business from her dorm room",
    structure: "Guest intro: [Who they are] + Background: [Their story] + Key insights: [Their expertise] + Practical tips: [Actionable advice] + Contact: [How to follow them]",
    category: "Educational & Instructional"
  },
  {
    value: "unboxing",
    label: "Unboxing",
    description: "First-time reveal and exploration of new products or packages",
    example: "Unboxing the most expensive productivity setup on Amazon",
    structure: "Expectation: [What you hope to find] + Reveal: [Opening process] + First impressions: [Initial thoughts] + Testing: [Quick trial] + Value assessment: [Worth the price?]",
    category: "Educational & Instructional"
  },
  {
    value: "mistake-lesson",
    label: "Mistake & Lesson",
    description: "Share failures and what you learned from them",
    example: "The $50,000 mistake that taught me everything about business",
    structure: "Context: [The situation] + Mistake: [What went wrong] + Consequences: [What it cost you] + Learning: [What you discovered] + Prevention: [How others can avoid it]",
    category: "Educational & Instructional"
  },
  {
    value: "prediction",
    label: "Prediction",
    description: "Share forecasts about industry trends or future developments",
    example: "5 marketing trends that will dominate 2024 (and how to prepare)",
    structure: "Current state: [Where things are now] + Trend 1, 2, 3... [Each prediction with reasoning] + Timeline: [When to expect changes] + Preparation: [How to get ready]",
    category: "Educational & Instructional"
  },
  {
    value: "collaboration",
    label: "Collaboration",
    description: "Work with others to create content or solve problems together",
    example: "3 creators compete to see who can gain the most followers in 24 hours",
    structure: "Participants: [Who's involved] + Challenge: [What you're doing together] + Individual approaches: [Different strategies] + Results: [Who won/what happened] + Lessons: [What everyone learned]",
    category: "Educational & Instructional"
  },
  {
    value: "motivation-tips",
    label: "Motivation Tips",
    description: "Inspire and energize your audience with actionable motivation",
    example: "5 mindset shifts that will change how you approach every challenge",
    structure: "Current struggle: [What's holding people back] + Mindset shift: [New way of thinking] + Evidence: [Why it works] + Action steps: [How to implement] + Encouragement: [Motivational close]",
    category: "Educational & Instructional"
  },
  {
    value: "knowledge-spreading",
    label: "Knowledge Spreading",
    description: "Share valuable information and insights to educate your audience",
    example: "Everything you need to know about cryptocurrency in 10 minutes",
    structure: "Foundation: [Basic concepts] + Deep dive: [Key details] + Practical application: [How to use this knowledge] + Common mistakes: [What to avoid] + Next steps: [Further learning]",
    category: "Educational & Instructional"
  },
  {
    value: "experiences",
    label: "Experiences",
    description: "Share personal experiences and adventures with your audience",
    example: "What I learned traveling to 20 countries in one year",
    structure: "Setup: [What you experienced] + Journey: [Key moments] + Challenges: [Difficult parts] + Highlights: [Best moments] + Takeaways: [What you gained]",
    category: "Educational & Instructional"
  },
  {
    value: "promotion",
    label: "Promotion",
    description: "Present offers, products, or services in an engaging way",
    example: "Why this course is different from every other business program",
    structure: "Problem: [What they're struggling with] + Solution: [Your offer] + Unique value: [What makes it special] + Proof: [Results/testimonials] + Call to action: [How to get it]",
    category: "Business & Marketing"
  },
  {
    value: "claims",
    label: "Claims",
    description: "Make bold statements and back them up with evidence",
    example: "This simple habit is more powerful than a college degree",
    structure: "Bold claim: [Your statement] + Context: [Why this matters] + Evidence: [Proof/examples] + Counter-arguments: [Address doubts] + Call to action: [What to do with this info]",
    category: "Business & Marketing"
  },
  {
    value: "problems",
    label: "Problems",
    description: "Identify and discuss widespread issues in your niche",
    example: "The hidden problem destroying most online businesses",
    structure: "Problem identification: [What's wrong] + Scope: [How widespread it is] + Causes: [Why it happens] + Consequences: [What it leads to] + Solutions: [How to fix it]",
    category: "Business & Marketing"
  },
  {
    value: "difficulties",
    label: "Difficulties",
    description: "Address challenging situations and how to overcome them",
    example: "How to stay motivated when everything seems to go wrong",
    structure: "Common difficulty: [What people struggle with] + Why it's hard: [Root causes] + Strategies: [How to cope] + Mindset shifts: [Mental approach] + Support: [Getting help]",
    category: "Business & Marketing"
  },
  {
    value: "pain-points",
    label: "Pain Points",
    description: "Identify and solve your audience's biggest frustrations",
    example: "Why you're not seeing results (and how to fix it immediately)",
    structure: "Pain point: [Specific frustration] + Validation: [You're not alone] + Root cause: [Why it happens] + Solution: [Step-by-step fix] + Prevention: [Avoiding it in future]",
    category: "Business & Marketing"
  },
  {
    value: "reveal",
    label: "Reveal",
    description: "Unveil secrets, hidden information, or exclusive insights",
    example: "The secret strategy top influencers use to go viral every time",
    structure: "Buildup: [Why this is secret] + The reveal: [What it actually is] + Explanation: [How it works] + Examples: [Who uses it] + Implementation: [How you can use it]",
    category: "Business & Marketing"
  },
  {
    value: "trends-analysis",
    label: "Trends Analysis",
    description: "Break down current trends and their implications",
    example: "Why everyone is obsessed with this new productivity method",
    structure: "Trend identification: [What's trending] + Origin: [Where it started] + Analysis: [Why it's popular] + Evaluation: [Is it worth it?] + Future: [What's next]",
    category: "Business & Marketing"
  },
  {
    value: "lifestyle-showcase",
    label: "Lifestyle Showcase",
    description: "Display aspirational lifestyle elements and how to achieve them",
    example: "How I built a laptop lifestyle that lets me work from anywhere",
    structure: "Current lifestyle: [What you have now] + Journey: [How you got here] + Systems: [What makes it work] + Challenges: [Honest difficulties] + Blueprint: [How others can do it]",
    category: "Lifestyle & Personal"
  },
  {
    value: "industry-secrets",
    label: "Industry Secrets",
    description: "Share insider knowledge and behind-the-scenes industry insights",
    example: "What content agencies don't want you to know about viral content",
    structure: "Secret: [What insiders know] + Why it's hidden: [Reasons it's not public] + Evidence: [How you know this] + Impact: [What this means] + Action: [How to use this knowledge]",
    category: "Business & Marketing"
  },
  {
    value: "mindset-shifts",
    label: "Mindset Shifts",
    description: "Help audience change their thinking patterns for better results",
    example: "The mindset shift that turned my failures into my biggest advantages",
    structure: "Old mindset: [Limiting belief] + Problem: [Why it holds you back] + New mindset: [Empowering belief] + Evidence: [Why it works better] + Practice: [How to develop it]",
    category: "Lifestyle & Personal"
  },
  {
    value: "resource-compilation",
    label: "Resource Compilation",
    description: "Curate and share valuable tools, books, or resources",
    example: "The ultimate toolkit for starting your online business in 2024",
    structure: "Category: [Type of resources] + Tool 1, 2, 3... [Each with description and why it's useful] + How to use: [Implementation tips] + Free alternatives: [Budget options]",
    category: "Educational & Instructional"
  },
  {
    value: "rapid-fire-tips",
    label: "Rapid Fire Tips",
    description: "Share multiple quick, actionable tips in fast succession",
    example: "50 productivity hacks in 5 minutes that will change your life",
    structure: "Theme: [What all tips relate to] + Tip 1, 2, 3... [Quick, actionable advice] + Implementation: [How to start using them] + Priority: [Which ones to try first]",
    category: "Educational & Instructional"
  },
  {
    value: "controversial-takes",
    label: "Controversial Takes",
    description: "Share unpopular opinions that challenge conventional wisdom",
    example: "Why following your passion is terrible career advice",
    structure: "Controversial statement: [Your unpopular opinion] + Common belief: [What most people think] + Your argument: [Why they're wrong] + Evidence: [Supporting facts] + Alternative: [Better approach]",
    category: "Controversial & Debate"
  },
  {
    value: "progress-updates",
    label: "Progress Updates",
    description: "Document ongoing journeys and share incremental improvements",
    example: "Month 6 of building my startup: brutal honest update",
    structure: "Timeline: [Where you are in the journey] + Progress: [What you've achieved] + Setbacks: [What went wrong] + Lessons: [What you learned] + Next steps: [What's coming]",
    category: "Lifestyle & Personal"
  },
  {
    value: "system-breakdowns",
    label: "System Breakdowns",
    description: "Explain the systems and processes behind your success",
    example: "The exact system I use to create viral content every week",
    structure: "System overview: [What it accomplishes] + Components: [Each part explained] + Flow: [How it all works together] + Tools: [What you need] + Customization: [How to adapt it]",
    category: "Business & Marketing"
  },
  {
    value: "emotional-storytelling",
    label: "Emotional Storytelling",
    description: "Share deeply personal stories that create strong emotional connections",
    example: "The day I almost quit everything and what saved me",
    structure: "Emotional setup: [The feeling/situation] + Crisis point: [The breaking moment] + Internal struggle: [What you felt] + Resolution: [How you overcame] + Connection: [How others relate]",
    category: "Lifestyle & Personal"
  },
  {
    value: "future-visioning",
    label: "Future Visioning",
    description: "Paint pictures of possible futures and how to create them",
    example: "What your life could look like in 5 years if you start today",
    structure: "Current state: [Where they are now] + Vision: [What's possible] + Path: [Steps to get there] + Obstacles: [What might stop them] + Motivation: [Why it's worth it]",
    category: "Lifestyle & Personal"
  },
  {
    value: "hidden-interest",
    label: "Hidden Interest (🔥 Powerful & Trending)",
    description: "Content that appears purely entertaining with no promotional intent, but ends with a powerful CTA that catches viewers off-guard",
    example: "Vibe coding vs actual coding - explaining the difference through a creative river-crossing metaphor, then suddenly pivoting to recruiting for a startup unicorn project",
    structure: "Entertainment hook: [Engaging story/metaphor with no apparent agenda] + Deep storytelling: [Extended narrative that captivates audience] + Educational value: [Teach something valuable within the story] + Reality shift: [Brief transition that changes the context] + Powerful CTA: [Unexpected but relevant call-to-action that leverages the story's momentum]",
    category: "Viral & Trending",
    isTrending: true,
    isPowerful: true
  },
  {
    value: "spiritual-guidance",
    label: "Spiritual Guidance",
    description: "Provide spiritual insights, wisdom, and guidance for personal growth and inner peace",
    example: "How to find your life purpose through ancient wisdom and modern psychology",
    structure: "Spiritual context: [Universal truth or wisdom] + Personal connection: [How it relates to viewer's journey] + Ancient wisdom: [Traditional teachings or practices] + Modern application: [How to apply it today] + Transformation: [What changes when you embrace this]",
    category: "Spiritual & Consciousness"
  },
  {
    value: "meditation-guide",
    label: "Meditation Guide",
    description: "Lead viewers through meditation practices and mindfulness techniques",
    example: "5-minute morning meditation that will change your entire day",
    structure: "Preparation: [Setting the scene and mindset] + Breathing technique: [How to breathe properly] + Guided visualization: [Step-by-step mental journey] + Present moment: [Bringing awareness to now] + Integration: [How to carry this feeling forward]",
    category: "Spiritual & Consciousness"
  },
  {
    value: "subtle-hypnosis",
    label: "Subtle Hypnosis",
    description: "Use hypnotic language patterns and suggestions to create positive change in viewers",
    example: "Why successful people think differently (and how you can too)",
    structure: "Relaxation induction: [Gentle, calming opening] + Embedded commands: [Subtle suggestions within stories] + Future pacing: [Helping them imagine positive outcomes] + Anchoring: [Associating feelings with actions] + Post-hypnotic suggestion: [What they'll do after watching]",
    category: "Spiritual & Consciousness"
  },
  {
    value: "nested-loops",
    label: "Nested Loops (Arabian Nights)",
    description: "Multiple interconnected stories that create suspense and keep viewers engaged until all loops are closed",
    example: "The entrepreneur who lost everything, the monk who found happiness, and the lesson that changed my life forever",
    structure: "Story 1 opening: [Start first narrative] + Story 2 opening: [Begin second story within first] + Story 3 opening: [Third layer of storytelling] + Story 3 resolution: [Complete innermost story] + Story 2 resolution: [Close second story] + Story 1 resolution: [Final payoff that ties everything together]",
    category: "Advanced Storytelling"
  },
  {
    value: "energy-healing",
    label: "Energy Healing",
    description: "Guide viewers through energy work, chakra balancing, and healing practices",
    example: "Clear your energy blocks in 10 minutes using this ancient technique",
    structure: "Energy assessment: [Help them feel their current state] + Cleansing ritual: [Remove negative energy] + Activation: [Awaken healing energy] + Balancing: [Align energy centers] + Protection: [Seal and maintain the healing]",
    category: "Spiritual & Consciousness"
  },
  {
    value: "metaphysical-insights",
    label: "Metaphysical Insights",
    description: "Explore deeper spiritual truths, universal laws, and consciousness expansion",
    example: "The hidden law of attraction principle that quantum physics just discovered",
    structure: "Universal principle: [The metaphysical law or truth] + Scientific backing: [Modern validation] + Personal examples: [How you've experienced this] + Practical application: [How viewers can use it] + Consciousness shift: [New way of seeing reality]",
    category: "Spiritual & Consciousness"
  },
  {
    value: "dream-interpretation",
    label: "Dream Interpretation",
    description: "Help viewers understand their dreams and subconscious messages",
    example: "What your recurring dreams are trying to tell you about your future",
    structure: "Dream symbols: [Common meanings and interpretations] + Personal context: [How to relate symbols to their life] + Subconscious messages: [What the deeper mind is communicating] + Action steps: [What to do with the insights] + Dream work: [How to continue exploring]",
    category: "Spiritual & Consciousness"
  },
  {
    value: "manifestation-mastery",
    label: "Manifestation Mastery",
    description: "Teach powerful manifestation techniques and reality creation methods",
    example: "The manifestation technique that brought me $100k in 90 days",
    structure: "Mindset alignment: [Getting into the right mental state] + Visualization technique: [Detailed manifestation process] + Energy matching: [Becoming the vibration of what you want] + Inspired action: [Taking aligned steps] + Receiving: [How to allow and accept what comes]",
    category: "Spiritual & Consciousness"
  },
  {
    value: "ancient-wisdom",
    label: "Ancient Wisdom",
    description: "Share timeless teachings from ancient civilizations and spiritual traditions",
    example: "The Stoic practice that modern billionaires use to stay unshakeable",
    structure: "Historical context: [Where this wisdom comes from] + Original teaching: [The ancient principle] + Modern translation: [How it applies today] + Practical implementation: [Step-by-step practice] + Timeless truth: [Why this works across centuries]",
    category: "Spiritual & Consciousness"
  },
  {
    value: "consciousness-expansion",
    label: "Consciousness Expansion",
    description: "Guide viewers to higher levels of awareness and understanding",
    example: "How to access higher states of consciousness without drugs or meditation",
    structure: "Current awareness: [Where most people are] + Expansion trigger: [What shifts consciousness] + Higher perspective: [New level of understanding] + Integration process: [Making it permanent] + Evolved living: [How life changes at this level]",
    category: "Spiritual & Consciousness"
  },
  {
    value: "shadow-work",
    label: "Shadow Work",
    description: "Help viewers integrate their shadow aspects for personal healing and growth",
    example: "The dark side of success and why embracing it makes you unstoppable",
    structure: "Shadow recognition: [Identifying hidden aspects] + Safe exploration: [How to look at difficult parts] + Integration practice: [Accepting all parts of yourself] + Healing process: [Transforming shadow into strength] + Wholeness: [Living with full authenticity]",
    category: "Spiritual & Consciousness"
  },
  {
    value: "intuitive-guidance",
    label: "Intuitive Guidance",
    description: "Help viewers develop and trust their intuitive abilities",
    example: "How I learned to trust my intuition and it changed everything",
    structure: "Intuition vs thinking: [Distinguishing inner knowing from mind chatter] + Opening practice: [How to access intuitive guidance] + Trust building: [Learning to follow inner wisdom] + Practical application: [Using intuition in daily life] + Mastery: [Living from intuitive flow]",
    category: "Spiritual & Consciousness"
  },
  {
    value: "archetypal-storytelling",
    label: "Archetypal Storytelling",
    description: "Use universal archetypes and mythic patterns to create deeply resonant content",
    example: "Every entrepreneur's journey follows this ancient hero's pattern",
    structure: "Archetypal introduction: [Present the universal pattern] + Hero's journey: [Map their experience to the archetype] + Challenges and tests: [Universal obstacles they face] + Transformation: [How they change through the journey] + Return with wisdom: [What they bring back to help others]",
    category: "Advanced Storytelling"
  },
  {
    value: "frequency-healing",
    label: "Frequency Healing",
    description: "Use sound, vibration, and frequency concepts for healing and transformation",
    example: "The specific frequency that heals anxiety in 3 minutes",
    structure: "Vibrational science: [How frequency affects reality] + Diagnostic: [Identifying energetic imbalances] + Healing frequencies: [Specific sounds or vibrations] + Resonance practice: [How to attune to healing frequencies] + Maintenance: [Staying in optimal frequency]",
    category: "Spiritual & Consciousness"
  },
  {
    value: "viral-nonsense-twist",
    label: "Viral Nonsense with Twist (🔥 Trending)",
    description: "Absurd, seemingly random scenarios that lead to unexpected profound revelations or life lessons",
    example: "Man stuck under car asks for help lifting it, reveals giant playing card with QR code, leads to alternate dimension where he meets android version of himself who gives life-changing advice",
    structure: "Absurd setup: [Ridiculous but relatable situation] + Helper arrives: [Someone tries to help] + Unexpected element: [Bizarre twist that makes no logical sense] + Portal/transition: [Gateway to something deeper] + Profound revelation: [Meaningful life lesson or insight from the chaos] + Reality return: [How it connects back to real life]",
    category: "Viral & Trending",
    isTrending: true
  },
  {
    value: "aggressive-humor",
    label: "Aggressive Humor",
    description: "Bold, in-your-face comedy that pushes boundaries while entertaining",
    example: "Why your productivity guru is probably more unproductive than a sloth on sedatives",
    structure: "Provocative hook: [Outrageous statement that grabs attention] + Comedic exaggeration: [Over-the-top comparisons and metaphors] + Truth bombs: [Real insights hidden in the humor] + Relentless pacing: [Rapid-fire jokes and observations] + Meaningful punchline: [Serious point delivered through comedy]",
    category: "Humor & Entertainment"
  },
  {
    value: "aggressive-sarcasm",
    label: "Aggressive Sarcasm",
    description: "Heavy sarcasm and irony to make points while entertaining the audience",
    example: "Oh wow, another morning routine from someone who clearly has their life together - let me guess, 4am wake up?",
    structure: "Sarcastic opener: [Mock enthusiasm for common topics] + Ironic observations: [Point out obvious contradictions] + Exaggerated praise: [Over-the-top fake admiration] + Reality check: [Drop the sarcasm to reveal truth] + Sarcastic conclusion: [Return to irony with actual wisdom]",
    category: "Humor & Entertainment"
  },
  {
    value: "cynicism",
    label: "Cynicism",
    description: "Skeptical, pessimistic takes on popular topics that reveal uncomfortable truths",
    example: "Why every success story you see online is probably lying to you",
    structure: "Cynical premise: [Skeptical view of popular belief] + Evidence gathering: [Point out flaws and contradictions] + Reality exposure: [Reveal uncomfortable truths] + Systematic debunking: [Methodically tear down illusions] + Harsh wisdom: [Brutal but valuable life lesson]",
    category: "Controversial & Debate"
  },
  {
    value: "provocative",
    label: "Provocative",
    description: "Intentionally controversial content designed to challenge thinking and spark debate",
    example: "Why being happy is overrated and might be ruining your life",
    structure: "Controversial statement: [Challenge widely accepted beliefs] + Counterintuitive argument: [Present opposite viewpoint] + Supporting evidence: [Back up controversial claims] + Address backlash: [Anticipate and respond to criticism] + Thought-provoking conclusion: [Leave audience questioning everything]",
    category: "Controversial & Debate"
  },
  {
    value: "viral-nonsense-examples",
    label: "Viral Nonsense Collection (5 Examples)",
    description: "Collection of absurd viral scenarios with meaningful twists",
    example: "5 viral nonsense scenarios: 1) Pizza delivery to wrong address leads to parallel universe. 2) Elevator breaks, passengers discover it's actually a time machine. 3) Wrong Uber ride takes you to meet your future self. 4) Vending machine dispenses life advice instead of snacks. 5) GPS malfunction leads to dimension where traffic lights give relationship advice",
    structure: "Scenario 1: [Normal activity] + Weird malfunction + [Supernatural discovery] + [Life lesson from alternate reality]. Scenario 2: [Everyday situation] + [Unexpected breakdown] + [Time/space anomaly] + [Wisdom from future/past self]. Scenario 3: [Service mix-up] + [Wrong destination] + [Meet different version of yourself] + [Profound realization]. Scenario 4: [Technology glitch] + [Dispenses wrong thing] + [Item has consciousness] + [Gives life-changing advice]. Scenario 5: [Navigation error] + [Impossible location] + [Inanimate objects speak] + [Relationship/life wisdom]",
    category: "Viral & Trending"
  },
  {
    value: "meta-humor",
    label: "Meta Humor",
    description: "Self-aware comedy that breaks the fourth wall and comments on itself",
    example: "This video about making viral videos is ironically not going viral",
    structure: "Self-awareness: [Acknowledge what you're doing] + Commentary on format: [Joke about the content type itself] + Audience awareness: [Directly address viewers' thoughts] + Medium critique: [Mock social media conventions] + Recursive joke: [Humor about the humor itself]",
    category: "Humor & Entertainment"
  },
  {
    value: "absurdist-philosophy",
    label: "Absurdist Philosophy",
    description: "Use absurd scenarios to explore deep philosophical questions",
    example: "What a conversation between your left shoe and right shoe reveals about free will",
    structure: "Absurd premise: [Completely illogical starting point] + Philosophical framework: [Apply serious philosophical concepts] + Logical progression: [Follow absurd logic to its conclusion] + Profound insight: [Extract real wisdom from nonsense] + Reality bridge: [Connect back to meaningful life application]",
    category: "Humor & Entertainment"
  },
  {
    value: "chaos-narrative",
    label: "Chaos Narrative",
    description: "Deliberately chaotic storytelling that somehow leads to clarity",
    example: "My morning routine: Coffee machine declares independence, toothbrush starts a revolution, and somehow I learned the meaning of productivity",
    structure: "Chaotic opening: [Multiple random elements happening at once] + Escalating madness: [Each element gets more absurd] + Peak chaos: [Everything happening simultaneously] + Sudden pattern: [Order emerges from chaos] + Clarity moment: [Simple truth revealed through the madness]",
    category: "Advanced Storytelling"
  },
  {
    value: "reverse-psychology-humor",
    label: "Reverse Psychology Humor",
    description: "Use humor to tell people NOT to do things while actually encouraging them",
    example: "Please don't watch this video about becoming successful - you're probably too comfortable being mediocre",
    structure: "Reverse hook: [Tell them not to engage] + Mock discouragement: [Humorously discourage positive action] + Sarcastic barriers: [List 'reasons' they can't succeed] + Ironic warnings: [Warn about positive outcomes] + Psychological trigger: [Make them want to prove you wrong]",
    category: "Humor & Entertainment"
  },
  {
    value: "expertise-showcase",
    label: "Expertise Showcase (👑 Authority Building)",
    description: "Demonstrate deep knowledge and mastery in your field to establish credibility",
    example: "The 3 fundamental principles every successful entrepreneur must master (that business schools don't teach)",
    structure: "Credibility opener: [Establish your expertise/background] + Deep insights: [Share advanced knowledge others don't have] + Practical application: [Show how to implement at expert level] + Common mistakes: [What amateurs get wrong] + Authority statement: [Position yourself as the go-to expert]",
    category: "Authority Building",
    isAuthorityBuilding: true
  },
  {
    value: "thought-leadership",
    label: "Thought Leadership (👑 Authority Building)",
    description: "Share original ideas and perspectives that position you as an industry innovator",
    example: "Why the future of marketing isn't about selling - it's about solving (my revolutionary framework)",
    structure: "Contrarian thesis: [Present your unique perspective] + Industry analysis: [Show deep understanding of current state] + Original framework: [Introduce your innovative approach] + Future prediction: [Where you see the industry going] + Call to follow: [Invite others to join your movement]",
    category: "Authority Building",
    isAuthorityBuilding: true
  },
  {
    value: "master-class-mini",
    label: "Mini Master Class (👑 Authority Building)",
    description: "Deliver condensed, high-value educational content that showcases your teaching ability",
    example: "Master Class: How to build a million-dollar personal brand in 90 days (complete framework)",
    structure: "Master class intro: [Set high expectations] + Core principles: [Teach fundamental concepts] + Step-by-step system: [Detailed implementation guide] + Advanced strategies: [Insider techniques] + Action plan: [Specific next steps for immediate implementation]",
    category: "Authority Building",
    isAuthorityBuilding: true
  },
  {
    value: "credentials-story",
    label: "Credentials Story (👑 Authority Building)",
    description: "Share your background, achievements, and journey to establish authority without bragging",
    example: "How I went from college dropout to advising Fortune 500 CEOs (the unconventional path)",
    structure: "Humble beginnings: [Where you started] + Key challenges: [Obstacles you overcame] + Breakthrough moments: [Critical turning points] + Major achievements: [Significant wins and recognition] + Lessons learned: [Wisdom gained that others can apply]",
    category: "Authority Building",
    isAuthorityBuilding: true
  },
  {
    value: "industry-analysis",
    label: "Industry Analysis (👑 Authority Building)",
    description: "Provide deep analysis of industry trends, data, and insights that show your expertise",
    example: "I analyzed 10,000 successful businesses - here's what separates winners from losers",
    structure: "Research scope: [Scale and depth of your analysis] + Key findings: [Important discoveries and patterns] + Data insights: [Specific numbers and trends] + Strategic implications: [What this means for the industry] + Actionable conclusions: [How others can apply these insights]",
    category: "Authority Building",
    isAuthorityBuilding: true
  },

  // � STORYTELLING & ANALOGIES
  {
    value: "animal-analogy",
    label: "Animal Analogy Storytelling",
    description: "Use animals and their behaviors as metaphors to explain complex concepts",
    example: "Why successful entrepreneurs think like lions but act like ants",
    structure: "Animal introduction: [Choose relevant animal] + Behavioral trait: [Specific animal characteristic] + Business parallel: [How it applies to your topic] + Story development: [Extended analogy with examples] + Lesson extraction: [What humans can learn and apply]",
    category: "Storytelling & Analogies"
  },
  {
    value: "fairy-tale-analogy",
    label: "Fairy Tale Analogy",
    description: "Retell classic fairy tales as metaphors for modern life and business challenges",
    example: "Why your business journey is exactly like Cinderella (and how to find your glass slipper)",
    structure: "Fairy tale setup: [Classic story everyone knows] + Modern parallel: [Current situation that mirrors the tale] + Character mapping: [Who represents what in real life] + Plot development: [Key story beats applied to your topic] + Moral application: [Modern lesson from ancient wisdom]",
    category: "Storytelling & Analogies"
  },
  {
    value: "kingdom-analogy",
    label: "Kingdom & Medieval Analogies",
    description: "Use kingdoms, castles, and medieval elements to explain hierarchy and strategy",
    example: "Building your business empire: Why you need knights, not just a castle",
    structure: "Kingdom establishment: [Set the medieval scene] + Royal hierarchy: [Explain the power structure] + Modern translation: [How kingdoms relate to business/life] + Battle strategy: [Medieval tactics applied to modern challenges] + Empire building: [Long-term kingdom expansion lessons]",
    category: "Storytelling & Analogies"
  },
  {
    value: "talking-animals",
    label: "Talking Animals Stories",
    description: "Create fables with personified animals that deliver business and life wisdom",
    example: "The entrepreneurial rabbit and the corporate turtle: A modern fable about success",
    structure: "Animal characters: [Introduce personified animals with distinct personalities] + Conflict setup: [Present the challenge they face] + Different approaches: [Show how each animal handles the situation] + Interaction dialogue: [Conversations that reveal wisdom] + Fable conclusion: [Clear moral that applies to human life]",
    category: "Storytelling & Analogies"
  },
  {
    value: "farmer-analogy",
    label: "Farming & Agriculture Analogies",
    description: "Use farming, seasons, and agriculture as metaphors for growth and patience",
    example: "Why building wealth is exactly like growing crops (and why most people fail at harvest)",
    structure: "Seasonal setup: [Introduce farming cycle] + Planting phase: [Initial investment/effort] + Growing season: [Patience and nurturing required] + Weather challenges: [Obstacles and setbacks] + Harvest wisdom: [Reaping what you sow and timing lessons]",
    category: "Storytelling & Analogies"
  },
  {
    value: "alien-perspective",
    label: "Alien Observer Stories",
    description: "Use alien visitors observing human behavior to highlight absurdities and insights",
    example: "Aliens studying human work habits are confused by one bizarre behavior pattern",
    structure: "Alien arrival: [Outsider perspective introduced] + Observation mission: [What they're trying to understand] + Human behavior analysis: [Strange human habits through alien eyes] + Cultural confusion: [What makes no sense to outsiders] + Universal wisdom: [Insights that transcend species]",
    category: "Storytelling & Analogies"
  },
  {
    value: "business-ecosystem",
    label: "Business Ecosystem Stories",
    description: "Compare business environments to natural ecosystems and food chains",
    example: "The business jungle: Why some companies are predators and others are prey",
    structure: "Ecosystem introduction: [Set up the natural environment] + Species roles: [Different business types as animals] + Food chain dynamics: [Who feeds on whom in business] + Survival strategies: [Adaptation and evolution tactics] + Ecosystem balance: [How healthy business environments work]",
    category: "Storytelling & Analogies"
  },
  {
    value: "ocean-voyage",
    label: "Ocean Voyage Analogies",
    description: "Use sea adventures, ships, and navigation as metaphors for life journeys",
    example: "Why your career is like sailing the ocean: storms, treasure, and finding your true north",
    structure: "Ship departure: [Beginning the journey] + Navigation challenges: [Finding direction and purpose] + Storm weathering: [Handling major obstacles] + Treasure discovery: [Unexpected opportunities and rewards] + Harbor return: [Coming home changed and wiser]",
    category: "Storytelling & Analogies"
  },
  {
    value: "superhero-origin",
    label: "Superhero Origin Stories",
    description: "Frame personal or business transformations as superhero origin stories",
    example: "The day I discovered my entrepreneurial superpower (and how you can find yours)",
    structure: "Normal life: [Before the transformation] + The incident: [Catalyst moment that changes everything] + Power discovery: [Realizing your unique ability] + Training montage: [Developing and mastering the skill] + Hero emergence: [Using powers to help others and make impact]",
    category: "Storytelling & Analogies"
  },
  {
    value: "video-game-quest",
    label: "Video Game Quest Analogies",
    description: "Structure content like video game levels, quests, and achievement systems",
    example: "Life is an RPG: How to level up your skills and unlock new abilities",
    structure: "Character creation: [Starting stats and choosing your path] + Tutorial level: [Learning basic skills] + Main quest: [Primary life/business objectives] + Side quests: [Additional opportunities and skills] + Boss battles: [Major challenges and how to defeat them] + Achievement unlock: [Rewards and new levels of capability]",
    category: "Storytelling & Analogies"
  },
  {
    value: "cooking-recipe",
    label: "Cooking & Recipe Analogies",
    description: "Use cooking, ingredients, and recipes as metaphors for creating success",
    example: "The recipe for viral content: Why most people are missing the secret ingredient",
    structure: "Ingredient gathering: [Collecting necessary components] + Preparation phase: [Setting up and organizing] + Cooking process: [Step-by-step execution] + Seasoning and timing: [Fine-tuning and patience] + Final presentation: [Delivering the finished result]",
    category: "Storytelling & Analogies"
  },
  {
    value: "space-exploration",
    label: "Space Exploration Analogies",
    description: "Use space travel, planets, and cosmic themes for scaling and exploration stories",
    example: "Building your business is like colonizing Mars: here's your survival guide",
    structure: "Mission planning: [Strategy and preparation] + Launch phase: [Taking the initial leap] + Space travel: [Journey through unknown territory] + Planet exploration: [Discovering new opportunities] + Colony establishment: [Building sustainable systems]",
    category: "Storytelling & Analogies"
  },
  {
    value: "house-construction",
    label: "Construction & Building Analogies",
    description: "Compare building projects to business and life development processes",
    example: "Why your personal brand is like building a house (and most people forget the foundation)",
    structure: "Blueprint design: [Planning and vision] + Foundation laying: [Core principles and basics] + Frame construction: [Building the main structure] + Interior finishing: [Adding details and refinements] + Home warming: [Enjoying the completed project]",
    category: "Storytelling & Analogies"
  },
  {
    value: "time-travel-story",
    label: "Time Travel Stories",
    description: "Use past, present, and future perspectives to provide insights and motivation",
    example: "A letter from your future self: What you need to know about the next 5 years",
    structure: "Time machine setup: [The premise of time travel] + Past visit: [Lessons from history] + Future glimpse: [What's possible ahead] + Present moment: [Where you are now] + Timeline impact: [How choices today affect tomorrow]",
    category: "Storytelling & Analogies"
  },
  {
    value: "school-classroom",
    label: "School & Education Analogies",
    description: "Use classroom, tests, and academic metaphors for learning and growth",
    example: "Life's biggest lessons aren't taught in school: here's your real-world curriculum",
    structure: "Enrollment: [Entering the learning experience] + Curriculum overview: [What needs to be learned] + Classroom lessons: [Theoretical knowledge] + Practical exams: [Real-world testing] + Graduation: [Mastery and moving to the next level]",
    category: "Storytelling & Analogies"
  },
  {
    value: "sports-championship",
    label: "Sports & Championship Analogies",
    description: "Use sports, training, and competition metaphors for achievement and teamwork",
    example: "Building a business is like training for the Olympics: here's your gold medal strategy",
    structure: "Training camp: [Preparation and skill building] + Practice sessions: [Daily discipline and improvement] + Team dynamics: [Working with others] + Competition day: [Performing under pressure] + Victory ceremony: [Celebrating achievements and what's next]",
    category: "Storytelling & Analogies"
  },
  {
    value: "military-strategy",
    label: "Military & War Strategy Analogies",
    description: "Use military tactics, battles, and strategic planning for business and life challenges",
    example: "Marketing is warfare: How to win the battle for customer attention",
    structure: "Intelligence gathering: [Research and reconnaissance] + Strategic planning: [Developing the battle plan] + Troop deployment: [Resource allocation] + Tactical execution: [Implementing the strategy] + Victory consolidation: [Securing and expanding gains]",
    category: "Storytelling & Analogies"
  },
  {
    value: "detective-mystery",
    label: "Detective & Mystery Stories",
    description: "Frame problems as mysteries to solve with clues, investigation, and revelation",
    example: "The mystery of why 95% of startups fail (and the hidden clue everyone misses)",
    structure: "Crime scene: [Presenting the mystery/problem] + Clue gathering: [Evidence and observations] + Investigation: [Analyzing the information] + Red herrings: [Common misconceptions] + Case solved: [Revealing the truth and solution]",
    category: "Storytelling & Analogies"
  },
  {
    value: "movie-genres",
    label: "Movie Genre Analogies",
    description: "Structure content like different movie genres (thriller, comedy, drama, etc.)",
    example: "Your career change story: A thriller in three acts with plot twists",
    structure: "Opening scene: [Set the stage] + Character development: [Who you are/were] + Plot progression: [Rising action and challenges] + Climax moment: [The turning point] + Resolution: [How it all ends and what's learned]",
    category: "Storytelling & Analogies"
  },
  {
    value: "weather-seasons",
    label: "Weather & Seasons Analogies",
    description: "Use weather patterns and seasonal changes as metaphors for life cycles",
    example: "Your business has seasons: How to survive winter and thrive in spring",
    structure: "Seasonal setup: [Current weather/season] + Climate description: [What this season represents] + Weather patterns: [Challenges and opportunities] + Adaptation strategies: [How to thrive in these conditions] + Seasonal transition: [Preparing for what's coming next]",
    category: "Storytelling & Analogies"
  },
  {
    value: "music-composition",
    label: "Music & Orchestra Analogies",
    description: "Use musical concepts, harmony, and performance metaphors for teamwork and creation",
    example: "Building a team is like conducting an orchestra: every instrument matters",
    structure: "Composition writing: [Planning and design] + Instrument selection: [Choosing team members/tools] + Practice sessions: [Preparation and rehearsal] + Performance night: [Execution under pressure] + Standing ovation: [Success and recognition]",
    category: "Storytelling & Analogies"
  },
  {
    value: "art-creation",
    label: "Art & Creative Process Analogies",
    description: "Use artistic creation, painting, and creative processes for innovation stories",
    example: "Your personal brand is a masterpiece: here's how to paint it perfectly",
    structure: "Canvas preparation: [Foundation and planning] + Sketch outline: [Basic structure] + Color mixing: [Combining different elements] + Brushwork details: [Fine-tuning and perfecting] + Gallery display: [Sharing your creation with the world]",
    category: "Storytelling & Analogies"
  },
  {
    value: "treasure-hunting",
    label: "Treasure Hunting & Adventure Stories",
    description: "Frame goals and achievements as treasure hunts with maps, clues, and discoveries",
    example: "Finding your life purpose is like treasure hunting: here's your map",
    structure: "Map discovery: [Finding direction and purpose] + Clue following: [Signs and indicators along the way] + Obstacle navigation: [Challenges and barriers] + Treasure location: [Getting close to the goal] + Chest opening: [Achieving the ultimate reward]",
    category: "Storytelling & Analogies"
  },
  {
    value: "laboratory-experiment",
    label: "Science Lab & Experiment Analogies",
    description: "Use scientific methods, experiments, and discoveries for testing and learning",
    example: "I turned my life into a science experiment: here are the results",
    structure: "Hypothesis formation: [Theory and predictions] + Experiment design: [Setting up the test] + Data collection: [Gathering results and observations] + Analysis phase: [Understanding what happened] + Scientific conclusion: [What the experiment proves]",
    category: "Storytelling & Analogies"
  },
  {
    value: "restaurant-kitchen",
    label: "Restaurant & Kitchen Analogies",
    description: "Use restaurant operations, cooking pressure, and service excellence for business metaphors",
    example: "Running a startup is like being a chef during dinner rush: controlled chaos",
    structure: "Menu planning: [Strategy and offering decisions] + Prep work: [Behind-the-scenes preparation] + Service rush: [High-pressure execution] + Customer satisfaction: [Delivering quality results] + Kitchen cleanup: [Learning and improving for next time]",
    category: "Storytelling & Analogies"
  },
  {
    value: "mountain-climbing",
    label: "Mountain Climbing & Peak Analogies",
    description: "Use mountain climbing, peaks, and summit achievements for goal accomplishment stories",
    example: "Reaching your goals is like climbing Everest: preparation is everything",
    structure: "Base camp: [Starting point and preparation] + Acclimatization: [Getting comfortable with challenges] + Technical climbing: [Developing necessary skills] + Summit push: [Final intense effort] + Peak moment: [Achievement and the view from the top]",
    category: "Storytelling & Analogies"
  },
  {
    value: "library-books",
    label: "Library & Knowledge Analogies",
    description: "Use libraries, books, and knowledge collection for learning and wisdom themes",
    example: "Your mind is a library: here's how to organize it for maximum success",
    structure: "Library entrance: [Beginning the knowledge journey] + Book selection: [Choosing what to learn] + Reading process: [Absorbing information] + Knowledge cataloging: [Organizing and understanding] + Wisdom sharing: [Teaching others what you've learned]",
    category: "Storytelling & Analogies"
  },
  {
    value: "theater-performance",
    label: "Theater & Performance Analogies",
    description: "Use stage performance, actors, and theatrical elements for presentation and authenticity",
    example: "Life is a stage, but most people are reading from the wrong script",
    structure: "Casting call: [Finding your role] + Rehearsal process: [Practice and preparation] + Opening night: [Performance under pressure] + Audience reaction: [Feedback and response] + Curtain call: [Recognition and what comes next]",
    category: "Storytelling & Analogies"
  },
  {
    value: "garden-growth",
    label: "Garden & Plant Growth Analogies",
    description: "Use gardening, plant growth, and nurturing metaphors for development and patience",
    example: "Growing your skills is like tending a garden: patience yields the best harvest",
    structure: "Soil preparation: [Creating the right conditions] + Seed planting: [Starting with small actions] + Daily watering: [Consistent effort and care] + Pruning process: [Removing what doesn't serve] + Harvest celebration: [Enjoying the fruits of your labor]",
    category: "Storytelling & Analogies"
  },
  {
    value: "archaeological-discovery",
    label: "Archaeological Discovery Analogies",
    description: "Use archaeology, digging, and ancient discoveries for uncovering hidden truths",
    example: "Success secrets are like ancient artifacts: you have to dig deep to find them",
    structure: "Site selection: [Choosing where to focus] + Excavation process: [Careful digging and exploration] + Artifact discovery: [Finding valuable insights] + Historical context: [Understanding the bigger picture] + Museum display: [Sharing discoveries with others]",
    category: "Storytelling & Analogies"
  }
];

// Video Script Status
export const VIDEO_STATUS = [
  { value: "in-progress", label: "In Progress", color: "red" },
  { value: "ready", label: "Ready", color: "green" },
] as const;

// Script Length Options (30-200 seconds)
export const SCRIPT_LENGTHS = [
  { value: "30", label: "30 seconds - Ultra Short" },
  { value: "45", label: "45 seconds - TikTok Optimal" },
  { value: "60", label: "60 seconds - Standard Short" },
  { value: "90", label: "90 seconds - Extended Short" },
  { value: "120", label: "2 minutes - Medium" },
  { value: "150", label: "2.5 minutes - Long Form" },
  { value: "180", label: "3 minutes - Extended" },
  { value: "200", label: "3+ minutes - Maximum" },
] as const;

// Hook Types for Video Scripts
export interface Hook {
  id: string;
  name: string;
  description: string;
  example: string;
  structure: string;
}

export const VIDEO_HOOKS: Hook[] = [
  {
    id: "heres-how",
    name: "Here's How",
    description: "Start with a clear promise of valuable information that solves a specific problem",
    example: "Here's how to double your income in 6 months without working 80-hour weeks.",
    structure: "Here's how to [achieve specific outcome] without [common struggle/obstacle]."
  },
  {
    id: "scenario-setting",
    name: "Scenario Setting",
    description: "Create a relatable situation that immediately connects with your audience's experience",
    example: "You're scrolling through your bank account at 2 AM, wondering how you'll pay rent. I've been there.",
    structure: "You're [in relatable situation], [experiencing common emotion/thought]. [Personal connection]."
  },
  {
    id: "if-then",
    name: "If-Then Logic",
    description: "Present a common problem and reveal the hidden reason behind it",
    example: "If you're working hard but still broke, it's probably because nobody taught you this one thing.",
    structure: "If you're [experiencing problem], it's probably because [hidden reason/missing piece]."
  },
  {
    id: "social-proof",
    name: "Social Proof",
    description: "Show transformation results to build credibility and desire",
    example: "Six months of applying this method, and I went from living paycheck to paycheck to financial freedom.",
    structure: "[Time period] of [applying method/strategy], and I went from [before state] to [after state]."
  },
  {
    id: "borrowed-social-proof",
    name: "Authority Proof",
    description: "Reference successful people who use your method to build instant credibility",
    example: "Elon Musk, Warren Buffett, and Jeff Bezos all follow this one principle. If you want their success, you need it too.",
    structure: "[Authority figure 1], [Authority figure 2], and [Authority figure 3] all [do this thing]. If you want [their success], you need [this] too."
  },
  {
    id: "cost-narration",
    name: "Investment Story",
    description: "Share your personal investment to demonstrate value and build trust",
    example: "I spent $50,000 and 3 years learning from the world's top mentors. This one insight changed everything.",
    structure: "I spent [amount/time/effort] [doing research/learning]. This one [insight/method] changed everything."
  },
  {
    id: "relate-to-viewer",
    name: "Shared Struggle",
    description: "Create instant connection by acknowledging shared experiences and transformation",
    example: "Just like you, I was trapped in the 9-to-5 grind, feeling like I'd never escape—until I discovered this.",
    structure: "Just like you, I was [struggling with problem], feeling [common emotion]—until I [discovered solution]."
  },
  {
    id: "mystery-revelation",
    name: "Mystery Revelation",
    description: "Build curiosity by describing a universal problem before revealing the solution",
    example: "There's one invisible force that controls your entire life. It's active every moment, shaping every decision. Most people never realize it exists. That force is your subconscious programming.",
    structure: "There's one [mysterious thing] that [major impact]. It's [everywhere/constant]. Most people [don't realize]. That [thing] is [revelation]."
  },
  {
    id: "action-sequence",
    name: "Action Sequence",
    description: "Create energy with rapid-fire action words that mirror the entrepreneurial journey",
    example: "Start, fail, pivot, learn, build, test, fail again, adjust, breakthrough, scale, repeat! This is the real path to success.",
    structure: "[Action], [obstacle], [action], [growth], [action], [test], [setback], [adjust], [breakthrough], [scale], [continue]! [Key message]."
  },
  {
    id: "rsv-method",
    name: "Dream Scene Hook",
    description: "Paint a vivid picture of success, then provide the vehicle to achieve it",
    example: "You wake up to $10,000 in your account from work you did months ago. Your phone buzzes with new opportunities. Here are 3 systems that create this reality.",
    structure: "You [experience dream outcome]. [Additional success details]. Here are [number] [methods/systems] that create this reality."
  },
  {
    id: "blue-ball",
    name: "Curiosity Gap",
    description: "Create irresistible curiosity by hinting at valuable information without revealing it",
    example: "This one mistake destroys 90% of businesses in their first year. I see everyone making it, even smart people. Let me show you what it is and how to avoid it.",
    structure: "This one [mistake/secret/method] [major impact]. I see [who does it], even [surprising group]. Let me show you [what it is/how to use it]."
  },
  {
    id: "question-hook",
    name: "Power Question",
    description: "Start with a thought-provoking question that immediately engages the audience",
    example: "What if I told you the biggest lie about money isn't what you think it is?",
    structure: "What if I told you [surprising/contrarian statement about important topic]?"
  },
  {
    id: "contradiction-hook",
    name: "Contradiction Hook",
    description: "Challenge common beliefs or expectations to create immediate attention",
    example: "Everyone tells you to work harder. That's exactly why you're still broke.",
    structure: "Everyone tells you to [common advice]. That's exactly why you're [still struggling/failing]."
  },
  {
    id: "time-sensitive",
    name: "Urgency Hook",
    description: "Create immediate urgency around a time-sensitive opportunity or threat",
    example: "You have exactly 72 hours to make this decision before the opportunity disappears forever.",
    structure: "You have exactly [time limit] to [take action] before [consequence/opportunity ends]."
  },
  {
    id: "big-number",
    name: "Shocking Statistics",
    description: "Lead with a surprising number or statistic that demands attention",
    example: "95% of people will watch this video and do absolutely nothing with the information. Don't be one of them.",
    structure: "[Shocking percentage/number] of people [surprising behavior/outcome]. Don't be one of them."
  },
  {
    id: "immediate-storytelling",
    name: "Immediate Storytelling",
    description: "Jump straight into a compelling story beginning with the hero, problem, or situation without any setup",
    example: "Sarah was staring at her laptop screen at 3 AM, tears streaming down her face. Her business was failing, she had $47 left in her bank account, and her family thought she was crazy. Three months later, she made her first million.",
    structure: "[Character name] was [in dramatic situation], [experiencing intense emotion/problem]. [Additional crisis details]. [Time jump] later, [incredible transformation/outcome]."
  }
];

export const getHookById = (hookId: string): Hook | undefined => {
  return VIDEO_HOOKS.find(hook => hook.id === hookId);
};

export const getLanguageLabel = (languageValue: string): string => {
  const language = VIDEO_LANGUAGES.find(lang => lang.value === languageValue);
  return language?.label || languageValue;
};

export const getContentTypeLabel = (contentTypeValue: string): string => {
  const contentType = MAIN_CONTENT_TYPES.find(type => type.value === contentTypeValue);
  return contentType?.label || contentTypeValue;
};

export const getContentTypeById = (contentTypeValue: string): ContentType | undefined => {
  return MAIN_CONTENT_TYPES.find(type => type.value === contentTypeValue);
};

export const getStatusInfo = (statusValue: string) => {
  const status = VIDEO_STATUS.find(s => s.value === statusValue);
  return status || { value: statusValue, label: statusValue, color: "gray" };
};

// Group content types by category for organized dropdown display
export const getContentTypesByCategory = () => {
  const categories: Record<string, ContentType[]> = {};
  
  MAIN_CONTENT_TYPES.forEach(contentType => {
    const category = contentType.category || "Other";
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(contentType);
  });
  
  return categories;
};

// Category display order and icons
export const CATEGORY_CONFIG = {
  "Educational & Instructional": { icon: "📚", order: 1 },
  "Business & Marketing": { icon: "💼", order: 2 },
  "Authority Building": { icon: "👑", order: 3 },
  "Storytelling & Analogies": { icon: "📖", order: 4 },
  "Spiritual & Consciousness": { icon: "🧠", order: 5 },
  "Viral & Trending": { icon: "🔥", order: 6 },
  "Advanced Storytelling": { icon: "🎭", order: 7 },
  "Humor & Entertainment": { icon: "😄", order: 8 },
  "Controversial & Debate": { icon: "🗣️", order: 9 },
  "Lifestyle & Personal": { icon: "🌟", order: 10 },
  "Other": { icon: "📝", order: 11 }
} as const;

// Script length options
export type ScriptLength = '30' | '60' | '90' | '120' | '150' | '180' | '200';

// Custom content types and hooks interfaces (matching database schema)
export interface CustomHook {
  id: string;
  userId: string;
  value: string;
  label: string;
  description: string;
  example: string;
  structure: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomContentType {
  id: string;
  userId: string;
  value: string;
  label: string;
  description: string;
  example: string;
  structure: string;
  category: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateCustomItemRequest {
  type: 'hook' | 'contentType';
  prompt: string;
  isPublic: boolean;
  category?: string; // For content types only
}

export interface GenerateCustomItemResponse {
  success: boolean;
  data?: {
    value: string;
    label: string;
    description: string;
    example: string;
    structure: string;
    category?: string;
  };
  error?: string;
}