import type { IPricing } from "../types";

export const pricingData: IPricing[] = [
    {
        name: "Free",
        price: 0,
        period: "month",
        features: [
            "5 AI Generations per month",
            "Standard Resolution (720p)",
            "Gemini 1.5 Flash Model",
            "Public Gallery access",
            "Community support"
        ],
        mostPopular: false
    },
    {
        name: "Pro",
        price: 19,
        period: "month",
        features: [
            "Unlimited AI Generations",
            "Ultra HD Resolution (4K)",
            "Gemini 3 Pro Image Model",
            "Remove Watermark",
            "Priority Generation speed",
            "Private Storage (Cloud)",
            "24/7 Priority support"
        ],
        mostPopular: true
    },
    {
        name: "Team",
        price: 49,
        period: "month",
        features: [
            "Everything in Pro",
            "Bulk Thumbnail generation",
            "Custom Branding Kits",
            "API Access for automation",
            "Collaborative Workspaces",
            "Advanced Analytics"
        ],
        mostPopular: false
    }
];