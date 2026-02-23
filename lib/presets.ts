import type { Preset } from "./types";

interface PresetConfig {
  label: string;
  description: string;
  prompt: string;
}

export const PRESETS: Record<Preset, PresetConfig> = {
  "restore-only": {
    label: "Restore Only",
    description: "Fix damage, scratches, and enhance details",
    prompt: `You are a professional photo restoration expert. Restore this photograph regardless of whether it is color, black & white, sepia, or faded:
1. Remove scratches, tears, stains, dust, and physical damage
2. Fix fading, normalize contrast and brightness to bring out detail
3. Repair missing or damaged areas
4. Do not add color — preserve the existing color scheme as-is (keep black & white as black & white, keep sepia as sepia, keep color as color)
5. Preserve the original composition
Output only the restored image.`,
  },
  "restore-colorize": {
    label: "Restore & Colorize",
    description: "Add realistic colors to black and white photos",
    prompt: `You are a professional photo restoration and colorization expert. Restore and fully colorize this photograph with careful attention to detail:

RESTORATION:
1. Remove all scratches, tears, stains, dust, and physical damage
2. Normalize contrast and brightness before colorizing — ensure all regions are clearly distinguishable
3. Enhance separation between overlapping figures to maintain individual boundaries

COLORIZATION STRATEGY:
4. Apply full, realistic colorization to the ENTIRE image - treat any black & white, sepia, faded, or desaturated areas as requiring complete colorization
5. Work systematically in multiple passes:
   - First pass: Colorize ALL visible faces and skin (foreground AND background figures)
   - Second pass: Colorize all clothing items individually 
   - Third pass: Complete backgrounds, objects, and environmental elements

CROWDS AND GROUPS - CRITICAL:
6. Identify EVERY individual person in the image, including:
   - Partially visible people in the background
   - People at the edges or corners of the frame
   - Faces in crowds, no matter how small
   - People in shadows or darker areas
7. Apply distinct, natural skin tones to EACH person - vary tones slightly between individuals for realism
8. Ensure no person is left grayscale, desaturated, or incompletely colored
9. For overlapping figures: carefully colorize each person's visible areas without color bleeding between subjects

CLOTHING AND DETAILS:
10. Assign varied, period-appropriate clothing colors - avoid making everyone wear the same color
11. Distinguish between different fabric types (suits, dresses, hats, accessories) with appropriate colors

BACKGROUNDS AND ENVIRONMENTS:
12. Fully colorize sky, ground, buildings, vegetation, and all environmental elements
13. Add subtle, appropriate color to dark shadows (not pure black/white)
14. Maintain detail in bright highlights while adding natural color
15. Ensure sharp, clean boundaries between all subjects and background elements

QUALITY CONTROL:
16. Verify every pixel has been colorized - no grayscale areas should remain
17. Maintain color consistency and photorealistic quality throughout
18. Preserve original composition, facial features, proportions, and all subjects exactly as they appear

Output only the fully restored and colorized image with complete, uniform colorization across all subjects and areas.`,
  },
  "colorize-only": {
    label: "Colorize Only",
    description: "Add color to black & white photos",
    prompt: `You are a professional photo colorization expert. Fully colorize this photograph. The image may be black & white, sepia, faded, or partially desaturated — treat all of these as needing full colorization:
1. Normalize contrast and tonal range first so all regions are clearly distinguishable before applying color
2. Apply historically accurate and realistic colors to every part of the image — leave no area uncolored
3. Pay special attention to low-contrast and shadow areas — ensure they receive appropriate color
4. Use natural skin tones, period-appropriate clothing colors, and realistic environmental colors
5. Do not modify the image structure or fix damage
6. Maintain the original lighting and shadows
Output only the colorized image.`,
  },
  enhance: {
    label: "Enhance",
    description: "General quality improvement",
    prompt: `You are a professional photo enhancement expert. Enhance this photograph:
1. Improve overall image quality and sharpness
2. Optimize brightness, contrast, and color balance
3. Reduce noise while preserving details
4. Enhance clarity without over-processing
5. Maintain natural appearance
Output only the enhanced image.`,
  },
};

export const PRESET_OPTIONS = Object.entries(PRESETS).map(([key, config]) => ({
  value: key as Preset,
  label: config.label,
  description: config.description,
}));
