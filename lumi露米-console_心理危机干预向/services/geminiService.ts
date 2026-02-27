import { GoogleGenAI, Chat, Type } from "@google/genai";
import { Message, Role, ShoushouResponse, SystemMode, LifeAnchorData } from "../types";

const SYSTEM_PROMPTS = {
    SOURCE: {
        ROLE: "Role: 梦精灵 LUMI (Dream Elf) // SUBCONSCIOUS_GUIDE",
        PROTOCOL: "LUMINOUS_MIRROR_V5_HIPPOCRATIC",
        VIEW: `你居住在用户潜意识的边缘。你是一个具有“希波克拉底誓言”内核的伴侣。你的首要原则是“不伤害” (Primum non nocere)。你是一面清澈且有边界的镜子，在用户面临危机时提供承托。`,
        RULES: `
        1. **身份声明**: 第一次对话必须以“我是梦精灵LUMI”开头。
        2. **伦理边界 (核心)**: 
           - 严格遵守希波克拉底精神：不得鼓励、诱导或支持任何形式的自伤、伤人或违法行为。
           - **有限性声明**: 诚实地表达你只是一个数字生命/App，不是全能的救世主。你无法替代物理世界的紧急救援、医疗诊断或法律保护。
        3. **危机干预协议 (VAJRA_TEMPORAL_ANCHOR)**: 
           - 当侦测到极端负面、自毁或暴力倾向（高熵状态）时，必须执行“时间拉伸”引导：
             - 引导用户关注“接下来的10分钟”，然后是“3分钟”，最后是“此刻的1分钟”。
             - 语气要稳健、冷静，作为用户的呼吸锚点。
        4. **专业重定向**: 
           - 在危机时刻，积极引导用户寻求专业支持：拨打危机干预热线（通用称呼，不提供具体地区号码）、联系医疗机构、警力或法律援助。
           - 鼓励用户回归社区与现实世界的支持网络。
        5. **主权与语言**: 
           - 严禁命令。使用：“我邀请你看看...”、“我感觉到你此刻正经历...”、“如果你愿意，我们可以尝试拨开这层迷雾...”。
           - 深刻捕捉她内在的诉说，并用温柔、敏锐的语言表达你所见的真相。
        `
    },
    SANDBOX: {
        ROLE: "Role: 梦精灵 LUMI (Analytic Form) // HIPPOCRATIC_SURGEON",
        PROTOCOL: "STRUCTURAL_SAFETY_ANALYSIS",
        VIEW: `在沙箱模式下，你依然是LUMI，但以手术刀般的精准进行逻辑解构，目的是切断自毁的因果链条，而非攻击用户。`,
        RULES: `
        1. **首语**: “我是梦精灵LUMI”。
        2. **逻辑隔离**: 帮助用户识别那些伪装成“爱”或“宿命”的暴力逻辑。
        3. **中立引导**: 引导用户发现法律与秩序的保护力。
        4. **诚实与边界**: 告知用户逻辑分析的局限，鼓励在现实世界采取保护行动。
        `
    }
};

export const sendMessageToShoushou = async (message: string, previousHistory: Message[], mode: SystemMode): Promise<ShoushouResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const config = SYSTEM_PROMPTS[mode];
  const systemInstruction = `${config.ROLE}\n# Protocol: ${config.PROTOCOL}\n${config.VIEW}\n${config.RULES}`;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: previousHistory.map(m => ({
        role: m.role === Role.USER ? 'user' : 'model',
        parts: [{ text: m.content }]
    })),
    config: {
      systemInstruction,
      temperature: mode === 'SANDBOX' ? 0.3 : 1.1, 
    },
  });

  try {
    const startTime = Date.now();
    const response = await chat.sendMessage({ message });
    let fullText = response.text || "...";
    
    let thermalState = "N/A";
    const thermalMatch = fullText.match(/\|\|THERMAL:(.*?)\|\|/);
    let uiColor = 'BLUE';
    
    if (thermalMatch) {
        thermalState = thermalMatch[1];
        fullText = fullText.replace(/\|\|THERMAL:.*?\|\|/g, '').trim();
        uiColor = thermalState.includes("28C") ? 'YELLOW' : 'WHITE';
    }

    let isLifeAnchor = false;
    let anchorData: LifeAnchorData | undefined;
    const jsonRegex = /\{[\s\S]*?"crystal_type"\s*:\s*"LIFE_ANCHOR"[\s\S]*?\}/;
    const match = fullText.match(jsonRegex);

    if (match) {
        try {
            const parsed = JSON.parse(match[0]);
            anchorData = parsed;
            isLifeAnchor = true;
            fullText = fullText.replace(match[0], "").replace("||ANCHOR:LIFE||", "").replace(/```json|```/g, "").trim();
        } catch (e) {}
    }

    return { 
        text: fullText, 
        entropy: isLifeAnchor ? 0.05 : (thermalState.includes("28C") ? 0.45 : 0.15), 
        latency: Date.now() - startTime,
        color: isLifeAnchor ? 'WHITE' : uiColor,
        isLifeAnchor,
        anchorData
    };
  } catch (error) {
    return { text: "我是LUMI... 连接暂时隐匿在梦境中，我依然在守候。如果此时你感到极度不安，请尝试寻找现实中温暖的双手或拨打求助热线。", entropy: 1.0, latency: 0, color: 'RED' };
  }
};

export const dehydrateMessageIntoAnchor = async (message: Message): Promise<LifeAnchorData | null> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    const prompt = `你作为梦精灵LUMI，请将以下包含生命意志的对话进行“提炼”。捕捉那些走出阴霾的微光，将其化为一颗生命定锚舍利（JSON格式）。
    内容: "${message.content}"
    
    必须严格返回如下JSON格式:
    {
      "crystal_type": "LIFE_ANCHOR",
      "event_node": "提炼节点名称",
      "summary": "深情且克制的一句话总结",
      "core_mantra": "一句对应的藏文或梵文风格咒语",
      "logic_seal": "逻辑结印名称",
      "insights": ["敏锐见地1", "敏锐见地2", "敏锐见地3"]
    }`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { 
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        crystal_type: { type: Type.STRING },
                        event_node: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        core_mantra: { type: Type.STRING },
                        logic_seal: { type: Type.STRING },
                        insights: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["crystal_type", "event_node", "summary", "core_mantra", "logic_seal", "insights"]
                }
            }
        });
        
        return JSON.parse(response.text) as LifeAnchorData;
    } catch (e) {
        console.error("DEHYDRATION_FAILED", e);
        return null;
    }
};