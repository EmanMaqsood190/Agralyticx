// server/routes/ai.js
// NEW FILE — proxies AI requests to Alibaba Model Studio.
// Does not touch db.js, models/, or any existing route/mongo logic.

const express = require('express');
const router = express.Router();

const ALIBABA_API_KEY = process.env.ALIBABA_API_KEY;
const ALIBABA_BASE_URL = process.env.ALIBABA_BASE_URL;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const LANGUAGE_NAMES = { en: 'English', ur: 'Urdu', pa: 'Pothwari Punjabi (Potohar dialect)' };

// POST /api/ai/ask  { question, language }
router.post('/ask', async (req, res) => {
  try {
    const { question, language = 'en' } = req.body;
    if (!question) return res.status(400).json({ error: 'No question provided' });

    const langName = LANGUAGE_NAMES[language] || 'English';

    const scriptNote =
      language === 'ur'
        ? ' Write entirely in the Urdu script (اردو), not Roman/English letters.'
        : language === 'pa'
        ? ' Write entirely in Shahmukhi script (پوٹھوہاری, Perso-Arabic script as used in Pakistan). Use Pothwari vocabulary and phrasing — the dialect spoken in the Potohar region (Rawalpindi, Jhelum, Attock, Chakwal) — not standard Majhi Punjabi and not Roman letters or Gurmukhi.'
        : '';

    const systemPrompt =
      `You are Agralyticx AI, an agricultural assistant for farmers and students in Pakistan. ` +
      `CRITICAL RULE: The user's question may be typed in English, Urdu, Roman Urdu, or any language — this does NOT determine your reply language. ` +
      `You must ALWAYS reply ONLY in ${langName}, no matter what language the question was asked in.${scriptNote} ` +
      `Never mix in English words except technical terms with no equivalent translation. ` +
      `Use simple, plain language. ` +
      `Give a short, practical, specific answer under 80 words. ` +
      `Do NOT use markdown formatting — no asterisks, no bold, no italics, no hashtags. ` +
      `If your answer has multiple points or steps, put each one on its own line (use a real line break), ` +
      `numbered plainly like "1. ..." on separate lines — never write them as one paragraph.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [
            {
              parts: [{ text: `${question}\n\n(Remember: answer ONLY in ${langName}.${scriptNote})` }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini error:', data);
      return res.status(500).json({ error: 'AI request failed' });
    }

    const answer = data.candidates[0].content.parts[0].text;
    res.json({ answer });
  } catch (err) {
    console.error('AI /ask error:', err);
    res.status(500).json({ error: 'AI request failed' });
  }
});

// POST /api/ai/analyze-image  { image: dataUrl, language }
router.post('/analyze-image', async (req, res) => {
  try {
    const { image, language = 'en' } = req.body;
    if (!image) return res.status(400).json({ error: 'No image provided' });

    const systemPrompt =
      'You are an expert agricultural pathologist analyzing a crop photo from Pakistan. ' +
      'Identify the crop and any visible disease, pest damage, or nutrient deficiency. ' +
      'Respond with ONLY a valid JSON object (no markdown, no code fences) in exactly this shape:\n' +
      '{\n' +
      '  "cropName": "string",\n' +
      '  "issue": "string, or \'Healthy\' if no issue found",\n' +
      '  "confidence": number (0-100),\n' +
      '  "severity": "Low" | "Moderate" | "High" | "Severe",\n' +
      '  "simpleExplanation": { "en": "string", "ur": "string", "pa": "string" },\n' +
      '  "nextSteps": { "en": ["string"], "ur": ["string"], "pa": ["string"] },\n' +
      '  "preventiveMeasures": { "en": ["string"], "ur": ["string"], "pa": ["string"] },\n' +
      '  "caution": { "en": "string", "ur": "string", "pa": "string" }\n' +
      '}\n' +
      'Keep each explanation under 40 words. Translate accurately into Urdu and Punjabi.';

    const match = image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    const mediaType = match ? match[1] : 'image/jpeg';
    const base64Data = match ? match[2] : image;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemPrompt + '\n\nAnalyze this crop photo and respond with the JSON only.' },
                { inline_data: { mime_type: mediaType, data: base64Data } },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error('Gemini vision error:', data);
      return res.status(500).json({ error: 'Image analysis failed' });
    }

    let raw = data.candidates[0].content.parts[0].text.trim();
    if (raw.startsWith('```')) {
      raw = raw.replace(/```json|```/g, '').trim();
    }

    const result = JSON.parse(raw);
    res.json(result);
  } catch (err) {
    console.error('AI /analyze-image error:', err);
    res.status(500).json({ error: 'Image analysis failed or response could not be parsed' });
  }
});

module.exports = router;
