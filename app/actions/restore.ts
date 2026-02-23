"use server";

import { GoogleGenAI } from "@google/genai";
import { PRESETS } from "@/lib/presets";
import { validateFile } from "@/lib/validation";
import type { Preset, RestoreResponse } from "@/lib/types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function restorePhoto(formData: FormData): Promise<RestoreResponse> {
    try {
        const file = formData.get("file") as File | null;
        const preset = formData.get("preset") as Preset;

        if (!file) {
            return { success: false, error: "No file provided" };
        }

        const validation = validateFile(file);
        if (!validation.valid) {
            return { success: false, error: validation.error || "Invalid file" };
        }

        if (!PRESETS[preset]) {
            return { success: false, error: "Invalid preset" };
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error("GEMINI_API_KEY is not configured");
            return { success: false, error: "Service configuration error" };
        }

        const arrayBuffer = await file.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        const mimeType = file.type;

        const prompt = PRESETS[preset].prompt;

        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType,
                                data: base64,
                            },
                        },
                    ],
                },
            ],
            config: {
                responseModalities: ["image", "text"],
            },
        });

        if (response.candidates?.[0].finishReason === "IMAGE_OTHER") {
            {
                return { success: false, error: "Your image does not follow the rules. Please try again." };
            }
        }

        const parts = response.candidates?.[0]?.content?.parts;
        if (!parts || parts.length === 0) {
            return { success: false, error: "No response from AI model" };
        }

        const imagePart = parts.find((part) => part.inlineData);
        if (!imagePart?.inlineData) {
            return { success: false, error: "No image in response" };
        }

        return {
            success: true,
            imageData: imagePart.inlineData.data || "",
            mimeType: imagePart.inlineData.mimeType || "image/png",
        };
    } catch (error) {
        console.error("Restore error:", error);

        if (error instanceof Error) {
            if (error.message.includes("API key") || error.message.includes("API_KEY")) {
                return { success: false, error: "Service configuration error" };
            }
            if (error.message.includes("rate limit") || error.message.includes("quota")) {
                return { success: false, error: "Service busy. Please try again in a moment." };
            }
            if (error.message.includes("timeout") || error.message.includes("TIMEOUT")) {
                return { success: false, error: "Request timed out. Please try again." };
            }
        }

        return { success: false, error: "Failed to process image. Please try again." };
    }
}
