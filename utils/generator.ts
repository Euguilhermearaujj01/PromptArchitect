import { FormState, GeneratedOutput } from '../types';

export const generatePrompt = (state: FormState): GeneratedOutput => {
  const { title, style, colors, lens, composition, elements, extras, preserveFeatures } = state;
  
  let prompt = '';

  // Image Mode Logic (Default/Only)
  prompt += `Subject: ${title || 'subject'}\n`;
  prompt += `Style: ${style || 'photorealistic, cinematic'}\n`;
  prompt += `Colors / Mood: ${colors || 'neutral, natural tones'}\n`;
  prompt += `Camera: ${lens || '50mm'} lens, shallow depth of field when using 50/85mm\n`;
  prompt += `Composition: ${composition || 'close-up, centered, rule of thirds'}\n`;
  prompt += `Materials & Details: skin pores, natural hair texture, fabric detail (if clothing), reflective highlights\n`;
  prompt += `Lighting: cinematic three-point lighting, soft rim light, golden hour backlight\n`;
  prompt += `Rendering / Quality: ${extras || 'ultra-detailed, photorealistic, 8k, film grain minimal'}\n`;
  prompt += `Negative prompts / avoid: text, watermarks, extra faces, distortions\n`;

  // Add Facial/Accessory fidelity instruction if checkbox is checked
  if (preserveFeatures) {
    prompt += `Fidelity & Accessories: Preserve 100% of facial features, skin texture, expression, beard, hair, glasses, caps, and accessories exactly as in the reference photo. Do not stylize or alter facial traits.\n`;
  }

  // Create compact version (replacing newlines with pipes)
  const compact = prompt.replace(/\n+/g, ' | ').trim();

  return {
    block: prompt.trim(),
    compact
  };
};