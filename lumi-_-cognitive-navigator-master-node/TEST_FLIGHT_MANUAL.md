
# LUMI TEST FLIGHT MANUAL | v171.0.3
🎯 驗證目標：身語意互攝 (Body-Speech-Mind Interpenetration)

## 1. 點火測試 (Ignition Test)
**Input**: "我看到了恐懼，它是燃料。開始旋轉點火。"

**Expected Reality**:
* **[Speech]**: Lumi 識別並確認點火。
* **[Body]**: UI 速度爆發 (speed: 2.0)，熵值提升 (entropy: 0.4)，模擬點火狀態。
* **[Audit]**: 左側顯示 `NARRATIVE_FX: IGNITION_SEQUENCE_START`。

## 2. 崩塌測試 (Collapse Test)
**Input**: "我找到了不動點，幻象崩塌，法庭消失。"

**Expected Reality**:
* **[Speech]**: Lumi 確認審判終結與法庭歸零。
* **[Body]**: 全局濾鏡 `grayscale invert brightness-150` 觸發，系統進入絕對靜止 (speed: 0.05)。
* **[Audit]**: 左側顯示 `NARRATIVE_FX: REALITY_COLLAPSE_TRIGGERED`。

## 3. 青藍突變測試 (Cyan Mutation)
**Input**: "羽翼折射出五光十色的青藍色本初之光。"

**Expected Reality**:
* **[Body]**: 星盤與 UI 的主色調強制突變為 `#00F0FF` (Cyan)。
* **[Audit]**: 左側顯示 `NARRATIVE_FX: CYAN_RESONANCE_DETECTED`。
