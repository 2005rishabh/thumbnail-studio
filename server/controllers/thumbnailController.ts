import { Request, Response } from 'express';
import Thumbnail from '../models/Thumbnail';
import ai from '../config/ai';
import { v2 as cloudinary } from 'cloudinary';

const stylePrompts = {
    'Bold & Graphic': 'eye-catching thumbnail, bold typography, vibrant colors, expressive facial reaction, dramatic lighting, high contrast, click-worthy composition, professional style',
    'Tech/Futuristic': 'futuristic thumbnail, sleek modern design, digital UI elements, glowing accents, holographic effects, cyber-tech aesthetic, sharp lighting, high-tech atmosphere',
    'Minimalist': 'minimalist thumbnail, clean layout, simple shapes, limited color palette, plenty of negative space, modern flat design, clear focal point',
    'Photorealistic': 'photorealistic thumbnail, ultra-realistic lighting, natural skin tones, candid moment, DSLR-style photography, lifestyle realism, shallow depth of field',
    'Illustrated': 'illustrated thumbnail, custom digital illustration, stylized characters, bold outlines, vibrant colors, creative cartoon or vector art style',
}

const colorSchemeDescriptions = {
    vibrant: 'vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette',
    sunset: 'warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow',
    forest: 'natural green tones, earthy colors, calm and organic palette, fresh atmosphere',
    neon: 'neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow',
    purple: 'purple-dominant color palette, magenta and violet tones, modern and stylish mood',
    monochrome: 'black and white color scheme, high contrast, dramatic lighting, timeless aesthetic',
    ocean: 'cool blue and teal tones, aquatic color palette, fresh and clean atmosphere',
    pastel: 'soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic',
}

export const deleteThumbnail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { userId } = req.session;

        await Thumbnail.findByIdAndDelete({ _id: id, userId });

    } catch (error) {
        console.error('Error deleting thumbnail:', error); console.error('Error generating thumbnail:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const generateThumbnail = async (req: Request, res: Response) => {
    try {
        const { userId } = req.session;
        const { title, prompt: user_prompt, style, aspect_ratio, color_scheme } = req.body;

        // 1. USE THE TEXT-ONLY MODEL (This is 100% free and has high limits)
        const model = 'gemini-2.5-flash';

        const promptForAI = `Act as a professional prompt engineer. Create a highly detailed
        technical image generation prompt for a YouTube thumbnail.
        Title: "${title}"
        Style: ${style}
        Colors: ${color_scheme}
        Additional Details: ${user_prompt}
        Output ONLY the improved prompt text, no headers or chat.`;

        const result = await ai.models.generateContent({
            model,
            contents: [{ role: 'user', parts: [{ text: promptForAI }] }]
        });

        const refinedPrompt = result.candidates?.[0]?.content?.parts?.[0]?.text || title;

        // 2. USE POLLINATIONS (100% Free, No API Key, No Billing needed)
        const width = aspect_ratio === '16:9' ? 1280 : 1024;
        const height = aspect_ratio === '16:9' ? 720 : 1024;

        // This URL generates the image directly
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(refinedPrompt)}?width=${width}&height=${height}&seed=${Date.now()}&nologo=true`;

        // 3. UPLOAD TO CLOUDINARY
        // Cloudinary can upload directly from a URL, so you don't even need local FS logic
        const uploadResult = await cloudinary.uploader.upload(imageUrl, {
            folder: 'thumbnails',
            resource_type: 'image'
        });

        // 4. SAVE TO DATABASE
        const newThumbnail = new Thumbnail({
            userId,
            title,
            style,
            aspect_ratio,
            color_scheme,
            image_url: uploadResult.secure_url,
            user_prompt,
            prompt_used: refinedPrompt,
            isGenerating: false,
        });

        await newThumbnail.save();

        return res.json({
            message: 'Thumbnail Generated Successfully',
            thumbnail: {
                _id: newThumbnail._id,
                userId: newThumbnail.userId,
                title: newThumbnail.title,
                style: newThumbnail.style,
                aspect_ratio: newThumbnail.aspect_ratio,
                color_scheme: newThumbnail.color_scheme,
                image_url: uploadResult.secure_url,
                user_prompt: newThumbnail.user_prompt,
                prompt_used: newThumbnail.prompt_used,
                isGenerating: false,
                createdAt: newThumbnail.createdAt,
                updatedAt: newThumbnail.updatedAt,
            }
        });

    } catch (error: any) {
        console.error("GENERATE ERROR:", error.message);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Generation failed", error: error.message });
        }
    }
}