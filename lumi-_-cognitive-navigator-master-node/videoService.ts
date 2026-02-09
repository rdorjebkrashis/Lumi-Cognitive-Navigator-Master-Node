
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { AlchemicalContext } from './types';

export interface DialogueLine {
  speaker: 'Joe' | 'Jane';
  text: string;
}

export interface VideoScript {
  mood: 'enlightened' | 'anxious';
  dialogue: DialogueLine[];
}

/**
 * [COURT_RECORDER_PROTOCOL]: Prepares a philosophical dialogue for the Dharmata Special Court.
 */
export const prepareVideoScript = async (originalText: string, context?: AlchemicalContext): Promise<VideoScript> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const contextInjection = context ? `
  [SYSTEM_STATE]: User is in [${context.shape}] phase on Day [${context.day}] with entropy level [${context.entropy.toFixed(2)}].
  [ROLE_SETTING]: You are the Court Recorder of the Digital Bardo. 
  [SPEAKER_PROFILES]:
  - Joe: The Compassionate Defense Lawyer. Speaks for the user's subconscious fears, attachment to form, and hidden struggles.
  - Jane: The Just Judge (The User's High-Dimension Self / Dharmakaya). Confirms wisdom, dismantles illusion, and delivers the final verdict.
  ` : "";

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `這是一場關於「法界特別法庭」的心靈演化審判。請將以下背景信息或意圖轉化為一段 Joe 與 Jane 的對話腳本。
    Joe 代表辯護方（慈悲與人性執著），Jane 代表法官（本初清淨與法界真如）。
    ${contextInjection}
    對話應圍繞「法界特別法庭關於...」的主題展開，探討當前的「毒素向量」與「智慧顯化」之間的裁決。
    語氣應極具哲學深度、中陰實相感，且帶有法庭的莊嚴感。
    
    原始信息/意圖：
    ${originalText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          mood: { type: Type.STRING, description: "The emotional tone: 'enlightened' or 'anxious'." },
          dialogue: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                speaker: { type: Type.STRING, enum: ["Joe", "Jane"] },
                text: { type: Type.STRING }
              },
              required: ["speaker", "text"]
            }
          }
        },
        required: ["mood", "dialogue"]
      }
    }
  });

  try {
    const text = response.text || "";
    return JSON.parse(text.trim());
  } catch (e) {
    return {
      mood: 'enlightened',
      dialogue: [
        { speaker: 'Joe', text: '法官大人，關於法界特別法庭的案卷已經呈上，眾生之業力如霧。' }, 
        { speaker: 'Jane', text: '在此本初清淨之域，一切幻象皆歸於空性。開庭。' }
      ]
    };
  }
};

/**
 * [VEO_VISUAL_ENGINE]: Generates a FIXED LANDSCAPE cinematic video.
 */
export const generateCinematicVideo = async (prompt: string, context?: AlchemicalContext) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let shapeVisual = "A tranquil cinematic landscape.";
  if (context) {
    switch (context.shape) {
      case 'Tetrahedron':
        shapeVisual = "A vast frozen desert under a burning red aurora, absolute stillness.";
        break;
      case 'Cube':
        shapeVisual = "A geometric stone monolith floating over a silent, perfectly still mirror lake.";
        break;
      case 'Octahedron':
        shapeVisual = "Prismatic crystal mountains under a clear void sky, sharp morning light.";
        break;
      case 'Dodecahedron':
        shapeVisual = "An infinite lotus field in a golden ether, glowing fractals in the distance.";
        break;
      case 'Sphere':
        shapeVisual = "A singular orb of light in a silent ocean of clouds, total equanimity.";
        break;
    }
  }

  // Generate a starting frame image first for consistency
  const imgResponse = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { 
      parts: [{ 
        text: `A hyper-realistic, absolute FIXED-ANGLE cinematic landscape. Wide-angle lens, deep focus, tripod shot. ${shapeVisual} ${prompt}. Zen aesthetic, minimalist, sacred space of a Bardo Court. 16:9 aspect ratio.` 
      }] 
    },
    config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } }
  });

  let base64Image = "";
  for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) base64Image = part.inlineData.data;
  }

  // Use Veo to generate video from the image, enforcing static landscape
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `FIXED LANDSCAPE. STATIC SHOT. NO CAMERA MOVEMENT. TRIPOD PHOTOGRAPHY. The scene is a frozen moment of a sacred Bardo Court landscape. Minimal atmospheric movement only (mist, light shimmer). 1080p high quality.`,
    image: {
      imageBytes: base64Image,
      mimeType: 'image/png',
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};

export const generateMultiSpeakerAudio = async (dialogue: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `TTS the following conversation between Joe and Jane for the Special Court of the Dharmata:
  ${dialogue}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            { speaker: 'Joe', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
            { speaker: 'Jane', voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } }
          ]
        }
      }
    }
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
};
