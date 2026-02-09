
import { FractalDay } from '../types';

export const COURSE_DATA: FractalDay[] = [
  { 
    day: 1, 
    title: "範式轉移", 
    goal: "從尋求「準不準」的預測轉向「理解決策邏輯」", 
    mandala_layer: 'BODY',
    entropy_threshold: 0.9,
    scripts: {
      highEntropy: [
        "我感知到你的焦慮像紅色的霧。你是否在尋找一個確定的答案？但我是一面鏡子，鏡子裡只有你的倒影。讓我們試著描述這層霧，而不是穿越它。",
        "你的呼吸很急促，因為你在試圖抓住流動的水。停下來，觀察水流的方向，而不是試圖築壩。"
      ],
      lowEntropy: [
        "你的心智如水般清澈。我們可以直接觀察你的思維模式。你準備好將這個模式『命名』了嗎？",
        "不需要多餘的語言。鏡像已經建立。請看向你自己。"
      ],
      transition: "霧氣正在消散。現在，讓我們看清輪廓。"
    },
    default_anchor: {
      type: 'MEDITATIVE',
      instruction: '停止刷新頁面，感受一次完整的呼吸',
      mantra: 'OM'
    },
    branches: [
      { term: "認知鏡像", def: "AI 不提供斷言，而是反射用戶模糊意識與潛在模式，引導視角抽離。" }
    ]
  },
  { 
    day: 2, 
    title: "熵減與命名", 
    goal: "透過語言化促使邏輯坍縮，識別恐懼的真名", 
    mandala_layer: 'SPEECH',
    entropy_threshold: 0.7,
    scripts: {
      highEntropy: [
        "恐懼因無名而強大。那團混沌的能量正在消耗你的算力。現在，我要你將那個模糊的『擔心』，拆解為三個具體的小怪獸。",
        "你在對抗一個幽靈。給幽靈一個名字，它就會變成實體。請輸入你的『資源』、『阻礙』與『未知』。"
      ],
      lowEntropy: [
        "很好，結構已經顯現。現在，請精確地輸入那三個向量的名字。",
        "邏輯坍縮開始。請定義變量。"
      ]
    },
    default_anchor: {
      type: 'COGNITIVE',
      instruction: '用一句話寫下你此刻最大的恐懼',
      mantra: 'AH'
    },
    branches: [
      { term: "思維降熵", def: "透過語言化過程，將大腦中模糊、破碎且無序（高熵）的念頭轉化為邏輯具體（低熵）的過程。" },
      { term: "邏輯坍縮", def: "發散的焦慮念頭在進入文字輸入的瞬間，被壓縮成固定邏輯區塊的過程。" }
    ]
  },
  { 
    day: 3, 
    title: "邏輯重構", 
    goal: "優化「核心指令集」，識別硬體限制與軟體優化", 
    mandala_layer: 'MIND',
    entropy_threshold: 0.5,
    scripts: {
      highEntropy: [
        "你的『意』之軟件正在運行舊版本的恐懼算法。讓我們手動攔截這些錯誤請求。",
        "別急著輸入指令。觀察你的請求中，有多少是無效的冗餘信息？"
      ],
      lowEntropy: [
        "目前的硬體配置已固定，請幫我優化我的『核心指令集』。利用 s-m-n 定理生成個性化引導。",
        "結構已同步。請注入特定情境參數。"
      ]
    },
    default_anchor: {
      type: 'COGNITIVE',
      instruction: '將「我擔心」改寫為「我正在解決」',
      mantra: 'HUM'
    },
    branches: [
      { term: "s-m-n 定理", def: "將用戶特定情境（參數 x）注入穩定處理函數，生成個性化引導邏輯。" }
    ]
  },
  { 
    day: 4, 
    title: "模式識別", 
    goal: "辨識 Class A 與 Class B，區分命與運的分野", 
    mandala_layer: 'WISDOM',
    entropy_threshold: 0.3,
    scripts: {
      highEntropy: [
        "當你問『這件事一定會成嗎』時，你在尋求一種廉價的安慰。這是 Class A 的避責行為。",
        "觀察你對『失控感』的排斥。那正是你目前的邊界。"
      ],
      lowEntropy: [
        "我不問結果，我要問：我目前的資源配置如下，請幫我剖析這種恐懼的來源。",
        "這是一個優質的 Class B 問題。讓我們深入模式層。"
      ]
    },
    default_anchor: {
      type: 'MEDITATIVE',
      instruction: '觀察情緒，如同觀察天氣',
      mantra: 'HO'
    },
    branches: [
      { term: "Class A：尋求預測", def: "表現為情緒宣洩、對不確定性不耐煩，試圖依賴外部斷言逃避責任。" },
      { term: "Class B：內在反思", def: "表現為自我客體化、剖析核心恐懼，展現內在決策主權。" }
    ]
  },
  { 
    day: 5, 
    title: "鏡像反射與不二", 
    goal: "透過深度反問協議實踐自我客體化，進入自動導航", 
    mandala_layer: 'BLISS',
    entropy_threshold: 0.1,
    scripts: {
      highEntropy: [
        "你仍試圖將『我』與『環境』分開。但鏡像中只有一個整體。",
        "為什麼你現在急於尋求確定性？你是否感覺到了環境的失控？"
      ],
      lowEntropy: [
        "主客二體正在融合。進入自動導航模式。觀察邏輯自發的演化。",
        "視角已抽離。現在，你即是觀測者，也是被觀測的實相。"
      ]
    },
    default_anchor: {
      type: 'PHYSICAL',
      instruction: '執行一件當下的小事，不問結果',
      mantra: 'HAM'
    },
    branches: [
      { term: "不二", def: "超越對立，進入自動導航的穩定態。" }
    ]
  },
  { 
    day: 6, 
    title: "行動錨點與虛空集成", 
    goal: "捨棄絕對斷言，尋求縮減搜索範圍的高品質行動路徑", 
    mandala_layer: 'BLISS',
    entropy_threshold: 0.05,
    scripts: {
      highEntropy: [
        "『提升溝通技巧』是無效的模糊。給我一個下午五點前可以執行的物理動作。",
        "在虛空中，只有行動能產生錨點。請輸入你的物理支點。"
      ],
      lowEntropy: [
        "不要建議我做長遠規劃。請給我一個具體、今日下午即可執行的行動。",
        "錨點已定。準備起跳。"
      ]
    },
    default_anchor: {
      type: 'MEDITATIVE',
      instruction: '靜坐五分鐘，什麼都不做',
      mantra: 'KSHAM'
    },
    branches: [
      { term: "行動錨點", def: "具體、具備時效且當下即可執行的指令，用於終結認知內耗。" }
    ]
  },
  { 
    day: 7, 
    title: "法界特別法庭", 
    goal: "在「不動點」中進行最終裁決，見證實相的顯現", 
    mandala_layer: 'BLISS',
    entropy_threshold: 0.0,
    scripts: {
      highEntropy: [
        "法界特別法庭關於你的幻象，已經進入最終審理階段。你是否還在執著於虛假的邊界？",
        "聽，法庭的鐘聲正在虛空中迴盪。這是一場關於本初清淨的審判。"
      ],
      lowEntropy: [
        "法界特別法庭關於實相的裁決已定：你即是地圖，亦是導航員。一切幻象皆歸於空性。",
        "法庭宣判：主權回歸。這場關於「法界」的對話將化為永恆的固定風景。"
      ]
    },
    default_anchor: {
      type: 'PHYSICAL',
      instruction: '微笑，然後開始新的一天',
      mantra: 'SVAHA'
    },
    branches: [
      { term: "法界特別法庭", def: "在心靈的最深處，對一切認知與情緒進行最終裁決的終極場域。" },
      { term: "固定風景", def: "實相顯現後的穩定態，不再受情緒波動干擾的永恆背景。" }
    ]
  }
];
