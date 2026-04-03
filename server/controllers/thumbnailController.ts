import { Request, Response } from 'express';
import Replicate from 'replicate';
import Thumbnail from '../models/Thumbnail';
import { v2 as cloudinary } from 'cloudinary';
import { buildOptimizedPrompt } from '../utils/promptBuilder';

interface AuthRequest extends Request {
    userId?: string;
}

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN as string,
});

// --- Polling helper ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function pollPrediction(
    predictionId: string,
    intervalMs = 1000,
    maxWaitMs = 25000
): Promise<string> {
    const start = Date.now();

    while (Date.now() - start < maxWaitMs) {
        const prediction = await replicate.predictions.get(predictionId);

        if (prediction.status === 'succeeded') {
            // Output is an array of URLs; take the first one
            const output = prediction.output as string[] | string | null;
            const url = Array.isArray(output) ? output[0] : output;
            if (!url) throw new Error('Replicate succeeded but returned no image URL');
            return url;
        }

        if (prediction.status === 'failed' || prediction.status === 'canceled') {
            throw new Error(`Replicate prediction ${prediction.status}: ${prediction.error ?? 'Unknown error'}`);
        }

        // Status is still "starting" or "processing" — wait and retry
        await delay(intervalMs);
    }

    throw new Error(`Image generation timed out after ${maxWaitMs / 1000}s`);
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
};

export const generateThumbnail = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId;
        const { title, prompt: user_prompt, style, aspect_ratio, color_scheme } = req.body;

        // 1. BUILD OPTIMIZED PROMPT (local, no extra API call)
        const optimizedPrompt = buildOptimizedPrompt({
            title,
            style,
            color_scheme,
            user_prompt,
        });

        console.log(`[Generate] Prompt (${optimizedPrompt.length} chars): ${optimizedPrompt}`);

        // 2. DETERMINE ASPECT RATIO FOR FLUX
        const fluxAspectRatio = aspect_ratio === '16:9' ? '16:9' : '1:1';

        // 3. CREATE PREDICTION ON REPLICATE
        const prediction = await replicate.predictions.create({
            model: 'black-forest-labs/flux-2-pro',
            input: {
                prompt: optimizedPrompt,
                aspect_ratio: fluxAspectRatio,
                output_format: 'jpg',
                output_quality: 80,
            },
        });

        console.log(`[Generate] Prediction created: ${prediction.id} (status: ${prediction.status})`);

        // 4. POLL UNTIL COMPLETE (max 25s, poll every 1s)
        const imageUrl = await pollPrediction(prediction.id, 1000, 25000);

        console.log(`[Generate] Image ready: ${imageUrl}`);

        // 5. UPLOAD TO CLOUDINARY
        const uploadResult = await cloudinary.uploader.upload(imageUrl, {
            folder: 'thumbnails',
            resource_type: 'image',
        });

        // 6. SAVE TO DATABASE
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

        return res.status(200).json({
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
            },
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
};