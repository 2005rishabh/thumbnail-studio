/**
 * Prompt Builder Utility
 * Converts structured user input into a short, optimized keyword prompt (≤200 chars)
 * for Pollinations AI. No external API calls.
 */

// Maps style names to concise keyword equivalents
const styleKeywords: Record<string, string> = {
    'Bold & Graphic': 'bold graphic style, high contrast',
    'Tech/Futuristic': 'futuristic design, digital glowing accents',
    'Minimalist': 'minimalist clean layout, flat design',
    'Photorealistic': 'photorealistic, DSLR photography',
    'Illustrated': 'digital illustration, stylized vector art',
};

// Maps color scheme IDs to short descriptors
const colorKeywords: Record<string, string> = {
    vibrant: 'vibrant colors',
    sunset: 'warm sunset tones',
    forest: 'natural green tones',
    neon: 'neon glow, cyberpunk',
    purple: 'purple violet palette',
    monochrome: 'black and white',
    ocean: 'cool blue teal tones',
    pastel: 'soft pastel colors',
};

interface PromptInput {
    title: string;
    style?: string;
    color_scheme?: string;
    user_prompt?: string;
}

/**
 * Builds an optimized, compressed prompt from structured input.
 * Output is always comma-separated keywords under 200 characters.
 */
export function buildOptimizedPrompt(input: PromptInput): string {
    const { title, style, color_scheme, user_prompt } = input;

    const parts: string[] = [];

    // Core subject from the title
    if (title?.trim()) parts.push(title.trim());

    // Style keywords
    const styleKw = style ? (styleKeywords[style] || style) : null;
    if (styleKw) parts.push(styleKw);

    // Color scheme keywords
    const colorKw = color_scheme ? (colorKeywords[color_scheme] || color_scheme) : null;
    if (colorKw) parts.push(colorKw);

    // Always append the thumbnail context
    parts.push('youtube thumbnail');

    // Optional extra user details — strip filler words, add raw
    if (user_prompt?.trim()) {
        const extra = user_prompt.trim().replace(/\b(please|make|create|generate|add|with|and|the|a|an)\b/gi, '').trim();
        if (extra) parts.push(extra);
    }

    // Join all parts and truncate to 200 chars on a word boundary
    let prompt = parts.join(', ');
    if (prompt.length > 200) {
        prompt = prompt.substring(0, 200).replace(/,\s*[^,]*$/, '');
    }

    return prompt;
}
