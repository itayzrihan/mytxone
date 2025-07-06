// Language Detection Utility for mytx-ai project
// Detects the language of user input to enforce consistent response language

/**
 * Detects the primary language of a text message
 * @param text - The input text to analyze
 * @returns Language code ('he' for Hebrew, 'en' for English, 'ar' for Arabic, etc.)
 */
export function detectLanguage(text: string): string {
    if (!text || typeof text !== 'string') {
        return 'en'; // Default to English
    }

    const cleanText = text.trim();
    if (cleanText.length === 0) {
        return 'en';
    }

    // Hebrew detection: Check for Hebrew characters
    const hebrewRegex = /[\u0590-\u05FF]/;
    const hebrewMatches = cleanText.match(hebrewRegex);
    const hebrewCharCount = hebrewMatches ? hebrewMatches.length : 0;

    // Arabic detection: Check for Arabic characters
    const arabicRegex = /[\u0600-\u06FF]/;
    const arabicMatches = cleanText.match(arabicRegex);
    const arabicCharCount = arabicMatches ? arabicMatches.length : 0;

    // English/Latin detection: Check for Latin characters
    const latinRegex = /[a-zA-Z]/;
    const latinMatches = cleanText.match(latinRegex);
    const latinCharCount = latinMatches ? latinMatches.length : 0;

    // Calculate percentages
    const totalChars = cleanText.replace(/\s/g, '').length; // Remove spaces for calculation
    
    if (totalChars === 0) {
        return 'en'; // Default to English if no meaningful characters
    }

    const hebrewPercentage = (hebrewCharCount / totalChars) * 100;
    const arabicPercentage = (arabicCharCount / totalChars) * 100;
    const latinPercentage = (latinCharCount / totalChars) * 100;

    // Determine primary language based on character distribution
    // If Hebrew characters are more than 30%, consider it Hebrew
    if (hebrewPercentage > 30) {
        return 'he';
    }
    
    // If Arabic characters are more than 30%, consider it Arabic
    if (arabicPercentage > 30) {
        return 'ar';
    }
    
    // If Latin characters are more than 50%, consider it English
    if (latinPercentage > 50) {
        return 'en';
    }

    // Mixed language fallback: Choose the language with the highest percentage
    if (hebrewPercentage >= arabicPercentage && hebrewPercentage >= latinPercentage) {
        return 'he';
    } else if (arabicPercentage >= latinPercentage) {
        return 'ar';
    } else {
        return 'en';
    }
}

/**
 * Converts language code to full language name for API requests
 * @param langCode - Short language code ('he', 'en', 'ar')
 * @returns Full language name
 */
export function getLanguageName(langCode: string): string {
    switch (langCode.toLowerCase()) {
        case 'he':
            return 'Hebrew';
        case 'ar':
            return 'Arabic';
        case 'en':
        default:
            return 'English';
    }
}

/**
 * Analyzes conversation history to determine the primary language used by the user
 * @param messages - Array of conversation messages
 * @returns Detected primary language code
 */
export function detectConversationLanguage(messages: { role: string; content: string }[]): string {
    const userMessages = messages.filter(msg => msg.role === 'user');
    
    if (userMessages.length === 0) {
        return 'en'; // Default to English
    }

    // Analyze recent user messages (last 3 messages or all if fewer)
    const recentMessages = userMessages.slice(-3);
    const combinedText = recentMessages.map(msg => msg.content).join(' ');
    
    return detectLanguage(combinedText);
}

/**
 * Creates a language instruction for AI agents
 * @param detectedLanguage - The detected language code
 * @returns Instruction string for AI agents
 */
export function createLanguageInstruction(detectedLanguage: string): string {
    const languageName = getLanguageName(detectedLanguage);
    
    switch (detectedLanguage) {
        case 'he':
            return `CRITICAL: The user is communicating in Hebrew. You MUST respond in Hebrew (עברית) only. All text, explanations, and responses must be in Hebrew. Do not use English except for technical terms that don't have Hebrew equivalents.`;
        case 'ar':
            return `CRITICAL: The user is communicating in Arabic. You MUST respond in Arabic (العربية) only. All text, explanations, and responses must be in Arabic. Do not use English except for technical terms that don't have Arabic equivalents.`;
        case 'en':
        default:
            return `CRITICAL: The user is communicating in English. You MUST respond in English only. All text, explanations, and responses must be in English.`;
    }
}
