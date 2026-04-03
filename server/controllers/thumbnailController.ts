import { Request, Response } from 'express';
import Thumbnail from '../models/Thumbnail';
import { v2 as cloudinary } from 'cloudinary';
import { buildOptimizedPrompt } from '../utils/promptBuilder';

interface AuthRequest extends Request {
    userId?: string;
}

// --- Retry + Timeout helper ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, maxRetries = 3, timeoutMs = 8000): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(`Pollinations returned ${response.status}`);
            }

            // Return the URL directly; Cloudinary handles the download
            return url;

        } catch (err: any) {
            clearTimeout(timeout);
            const isLastAttempt = attempt === maxRetries;
            const isAbort = err.name === 'AbortError';

            console.warn(`[Attempt ${attempt}/${maxRetries}] ${isAbort ? 'Timed out' : err.message}`);

            if (isLastAttempt) {
                throw new Error(`Image generation failed after ${maxRetries} attempts: ${err.message}`);
            }

            // Delay before next retry (1.5s)
            await delay(1500);
        }
    }

    // Should never reach here
    throw new Error('Image generation failed');
}


// --- Controllers ---

export const deleteThumbnail = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const userId = req.userId;

        await Thumbnail.findByIdAndDelete({ _id: id, userId });
        return res.json({ success: true, message: 'Thumbnail deleted successfully' });

    } catch (error) {
        console.error('Error deleting thumbnail:', error);
        res.status(500).json({ message: 'Server Error' });
    }
}

export const generateThumbnail = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { title, prompt: user_prompt, style, aspect_ratio, color_scheme } = req.body;

        // 1. BUILD OPTIMIZED PROMPT (local, no API call)
        const optimizedPrompt = buildOptimizedPrompt({
            title,
            style,
            color_scheme,
            user_prompt,
        });

        console.log(`[Generate] Optimized prompt (${optimizedPrompt.length} chars): ${optimizedPrompt}`);

        // 2. BUILD POLLINATIONS URL
        const width = aspect_ratio === '16:9' ? 1280 : 1024;
        const height = aspect_ratio === '16:9' ? 720 : 1024;
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(optimizedPrompt)}?width=${width}&height=${height}&seed=${Date.now()}&nologo=true&enhance=true`;

        // 3. FETCH WITH RETRY + TIMEOUT
        await fetchWithRetry(imageUrl, 3, 8000);

        // 4. UPLOAD TO CLOUDINARY (downloads from Pollinations URL directly)
        const uploadResult = await cloudinary.uploader.upload(imageUrl, {
            folder: 'thumbnails',
            resource_type: 'image',
            timeout: 60000, // 60s for Cloudinary upload
        });

        // 5. SAVE TO DATABASE
        const newThumbnail = new Thumbnail({
            userId,
            title,
            style,
            aspect_ratio,
            color_scheme,
            image_url: uploadResult.secure_url,
            user_prompt,
            prompt_used: optimizedPrompt,
            isGenerating: false,
        });

        await newThumbnail.save();

        return res.json({
            success: true,
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
        console.error('GENERATE ERROR:', error.message);
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: 'Image generation failed, please try again',
            });
        }
    }
}