# SPT-Realism 模组 -- 客户端/服务端联合审查报告

> 审查日期：2026-05-24
> 分析范围：LIN-Realism-Server（服务端）+ LIN-Realism-Mod-Client（客户端）
> 基于两份子报告：`codebase-analysis-report.md`（服务端）+ `代码审计与优化实施计划.md`（客户端）

---

## 零、客户端-服务端联动架构

在深入纠正/澄清之前，必须先理解两个仓库如何协同工作。这是之前分为两份报告时未能体现的关键信息。

### 数据通道（4 条 HTTP 路由）

| 路由 | 服务端处理 | 客户端消费 | 用途 |
|------|-----------|-----------|------|
| `/RealismMod/GetConfig` | `mod.ts:198` → 返回 `config.json` | `Plugin.cs:128` → `Plugin.ServerConfig` | ~80 个功能开关，客户端据此启用/禁用补丁 |
| `/RealismMod/GetTemplateData` | `mod.ts:215` → 返回 40+ 模板 JSON | `TemplateStats.cs:202` → 5 个类型化字典 | 物品属性覆盖（后坐力、人机、护甲等级、医疗效果） |
| `/RealismMod/GetInfo` | `mod.ts:234` → 返回事件标志 | `Plugin.cs:144` → `Plugin.ModInfo` | 季节性事件、气体事件、夜间状态 |
| `/RealismMod/GetTimeOfDay` | `mod.ts:258` → 仅返回时间 | `Plugin.cs:153` → `Plugin.ModInfo` | 轻量级时间更新 |

### 模板数据的双重用途

`db/templates/` 下的 40+ JSON 文件有**两个并行的消费路径**：

1. **服务端路径**（`postDBLoad` 阶段）：`json-handler.ts` 将模板数据写入 SPT 的物品数据库 `tables.templates.items`，修改弹道穿透、护甲等级、武器后坐力等服务端属性。
2. **客户端路径**（运行时请求）：客户端通过 HTTP 拉取同一批模板数据，反序列化为 `Gun` / `WeaponMod` / `Gear` / `Consumable` / `Ammo` 对象，驱动客户端侧的补丁逻辑（射速限制、换弹速度、后坐力动画、医疗应用逻辑等）。

### 联动缺陷

由于两份报告分开撰写，以下跨仓库问题未被识别：

| # | 联动问题 | 影响 |
|---|---------|------|
| L-1 | 服务端 `json-handler.ts:245` 硬编码 `ArmorDamage = 1` 覆盖了模板中的真实值。客户端 `BallisticController.cs` 读取同一批模板数据用于穿透计算。**模板在两端的值不一致。** | 客户端计算出的护甲伤害与服务端实际值不同，弹道行为分裂 |
| L-2 | 服务端 `description_gen.ts` 完全无效（`WeapType`/`ModType` 为空）。这些描述文本不影响游戏逻辑，但如果客户端某处也依赖这些字段（`TemplateStats.cs` 使用了 `$type` 字段做多态反序列化），可能产生类似问题 | 需要验证客户端是否消费了描述字段 |
| L-3 | 服务端 `quests.ts` 的万圣节任务条件设置有 Bug，客户端 `HealthController.cs` 的 `BUG-001`（辐射类型检查）和 `BUG-002`（咳嗽条件）也存在逻辑错误。**加在一起**：万圣节气体事件即使服务端正确触发，客户端可能因类型检查错误而无法正确表现 | 气体事件端到端链路断裂 |
| L-4 | 服务端 `ammo.ts` 的弹药属性通过数据库写入 + 客户端 `RecoilPatches.cs` 的后坐力计算使用了 `DamageInfo.ArmorDamage` 存储子弹速度（客户端报告 `QUAL-007` 指出此字段名实不符）。**两端对同一字段的理解不同。** | 语义分裂，修改时极易引入 Bug |
| L-5 | 服务端 `player.ts` 的 `debuffMul()` 标量分支为死代码，导致部分生命值效果未缩放。客户端 `HealthController.cs` 有独立的效果系统（`BUG-004` 提到的临时定时器方案）。**两端对同一医疗效果的缩放可能都不正确。** | 医疗系统端到端不一致 |
| L-6 | 客户端 `Plugin.cs` 的 `RequestRealismDataFromServer()` 在初始化时一次性拉取，之后仅在特定事件（Raid 开始/结束）重新请求。如果服务端在 Raid 中途修改了数据，客户端不会感知 | 跳蚤市场分级变化等动态数据客户端延迟更新 |

---

## 一、针对此前报告的纠正与澄清

### #17（pmcTypes.json 压缩 90%）—— 重新评估

**原始说法**"可压缩 90%（200KB → 20KB）"过于乐观，需要修正。

**实测结构**（经过完整读取确认）：

```
playerScavBrainType: 12 地图 × 1 键 = 12 条目
pmcTypeTimmy: 2 时段 × 2 派系 × 12 地图 × 14 bot 类型 = 672 条目
BotTypes3: 2 时段 × 2 派系 × 12 地图 × 14 bot 类型 = 672 条目
合计约 1356 个权重键值对
```

**权重分布特征**：
- 类似 `gifter`、`arenaFighter`、`arenaFighterEvent`、`crazyAssaultEvent` 在所有地图中几乎恒定（0 或 1）
- 类似 `assault` 在多数地图中恒定（20 或 30）
- Boss 类权重随地图变化（如 `bossKilla` 在 Factory 权重高于其他地图）

**实际可行的压缩方案**（非 90%）：

方案 A——提取共享常量 + 差值覆盖（预期压缩 40-50%）

```json
// 提取到文件头部（只存一次）
"_base": {
  "gifter": 1, "arenaFighter": 0, "arenaFighterEvent": 0, "crazyAssaultEvent": 0,
  "bossTagilla": 1, "sectantPriest": 1, "bossSanitar": 10, "bossBully": 10,
  "assault": 20, "followerKojaniy": 5, "bossKilla": 1,
  "bossKnight": 1, "followerBirdEye": 1, "followerBigPipe": 1
}
// 每个地图只存储不同于 base 的值
"bigmap": {},  // 完全与 base 相同，不存任何数据
"factory4_day": { "bossTagilla": 15, "bossKilla": 10 },  // 仅存 2 个差异
"woods": { "bossSanitar": 15, "assault": 25 }
```

代码中运行时展开：
```typescript
function expandWeights(base: Record<string, number>, overrides: Record<string, number>) {
    return { ...base, ...overrides };
}
```

**"不压缩"的替代方案**（推荐，因为改动更小）：

不为压缩而压缩。当前文件在服务器启动时通过 `require()` 加载一次，200KB 的 JSON 解析在现代 Node.js 中约 2-5ms。真正的问题是**48 个块的内容高度重复导致人工维护困难**（修改一个 bot 权重需要改 48 处）。解决方案不是运行时压缩，而是**构建时生成**——用脚本从简化的源数据生成完整 JSON。这保持了零运行时开销，同时让人类维护的数据源变小。

### #22（scavHealth 重复）—— 纠正

**经过实际代码追踪确认**：`botHealth.scavHealth` **完全是死代码**。

- `src/bots/bots.ts` 的 `setBotHPHelper()` 方法只读取 `botHealth.health.BodyParts[0]`，从未引用 `botHealth.scavHealth`。
- `scavHealth` 内部的 `BodyParts` 数组有 2 个完全相同的条目，且缺失 `Temperature` 属性。
- 该键是早期开发遗留的、从未接线的占位符。

**建议**：直接删除 `scavHealth` 整个键，不影响任何功能。与压缩无关，是死代码清理。

### #18（armorMods.json 重复）—— 纠正

**原始说法**"Front/Back plate 数组在每个护甲中完全相同重复"需要修正。

**实际测量**（完整读取文件前三部分和末三部分）：

1. 同一护甲内 Front_plate 和 Back_plate **ID 集合相同，但顺序不同**——这是故意的，模拟不同槽位的插入顺序。
2. 不同护甲间存在**两种板组**：18 件套装（基础）和 20 件套装（+2 个额外板 ID）。
3. 带侧板的护甲额外有 Left/Right_side_plate 数组。

**这就是我之前说的"为某种功能预留"——实际上确实如此。** 这个文件被 `bots.ts` 的 `pushGearMods()` 方法消费，在 Bot 生成时向装备 JSON 注入装甲板选项。两套板组区分了不同"等级"的护甲载体。顺序差异也不是错误——它反映了不同槽位的实际物品插入顺序。

**实际可行的优化**：

```json
// 在文件头部定义常量池（仅运行时引用，构建时内联）
"__shared": {
  "plateSet18": ["6575faf0...", "656fa765...", ...],  // 18 个 ID
  "plateSet20": ["6575faf0...", "656fa765...", ..., "65573fa5...", "64afc714..."]  // 20 个 ID
}
```

但引入运行时常量池会增加代码复杂度。更好的做法是**构建脚本在打包时自动展开**，源代码存放常量池，分发包内联为完整 JSON。这与 #17 的思路一致：**构建时生成，运行时零开销**。

---

## 二、性能优化详解（如何在不丢失功能的前提下优化）

### P1 -- 弹药加载 O(n*m) → O(n)

**现状代码逻辑**：
```
for each item in itemDB (10000 items):
    if item._id === "5d6e6772..."  → 设置 15 个属性
    if item._id === "5d6e6773..."  → 设置 15 个属性
    ... (130 个 if 检查 × 10000 项 = 130 万次比较)
```

**为什么保留功能**：所有 130 个弹药 ID 的 15 个属性值完全不变量。它们不依赖运行时状态。从 if 链移到外部 JSON 在数学上等价。

**优化方案**：
```typescript
// 1. 创建数据文件 db/items/ammo_stats.json
{
  "5d6e6772...": { PenetrationPower: 45, ArmorDamage: 58, Damage: 72, ... },
  "5d6e6773...": { PenetrationPower: 52, ArmorDamage: 65, Damage: 75, ... },
  ...
}

// 2. 单次遍历，O(1) 查找
const ammoStats = require("../db/items/ammo_stats.json");
for (const itemId in this.itemDB()) {
    const stats = ammoStats[itemId];
    if (stats) {
        Object.assign(this.itemDB()[itemId]._props, stats);
        if (modConf.malf_changes) Object.assign(this.itemDB()[itemId]._props, stats.malf || {});
    }
}
```

**为什么不出错**：结果属性值与原来的 if 链完全一致。区别仅是数据存放位置从代码变为 JSON。还解决了 `loadAmmoFirerateChanges()` 和 `grenadeTweaks()` 的二次遍历问题——可以将射速和手雷逻辑并入同一次遍历。

### P3 -- 模板 JSON 写入优化

**现状逻辑**：
```
for each item in database:
    template[itemId] = buildTemplate(item)
    fs.writeFileSync(path, JSON.stringify(template))  // ← 全量写盘！
```

第一次写 1 个条目，第二次写 2 个，第三次写 3 个...直到写满 5000 个条目。累计写盘量 = `sum(1..5000) * sizeof(entry)` ≈ 12,500,000 次条目序列化。

**优化方案**：
```
for each item in database:
    template[itemId] = buildTemplate(item)
// 循环结束，内存中已构建完整对象
fs.writeFileSync(path, JSON.stringify(template))  // ← 只写一次
```

**为什么不出错**：每次 `writeFileSync` 都是完整覆写文件，最终文件内容只取决于最后一次写入。循环中的前 4999 次写入完全没有被使用。移除它们不会改变最终文件内容。

### P5 -- setArmorDuabaility 嵌套循环

**现状逻辑**：
```
for each invItem in profile.Inventory (200 items):
    for each templateItem in tables.templates.items (5000 items):
        if invItem._tpl == templateItem._id:
            invItem.upd.Durability = templateItem._props.Durability
```

**优化方案**：
```
for each invItem in profile.Inventory (200 items):
    const template = tables.templates.items[invItem._tpl]  // O(1) 字典查找
    if (template):
        invItem.upd.Durability = template._props.Durability
```

SPT 的 `tables.templates.items` 本身就是一个 `Record<string, ITemplateItem>`（以 ID 为键的字典）。原先代码用 `for...in` 遍历字典来查找单个键，这在 JavaScript 中是 `Object.keys()` → 线性查找的反模式。直接用 `items[id]` 就是 O(1)。

### P4 -- 分级跳蚤市场调用链重构

**现状逻辑**：每个层级方法（`flea0` 到 `flea7`）是独立复制的方法体，调用 40+ 个 `canSellX()` 方法。

**为什么保留功能**：所有 `canSellX()` 做的都是同一件事——检查 `item._parent` 是否属于某类别，然后设置 `CanSellOnRagfair = bool`。

**优化方案——数据驱动**：

```typescript
const TIER_CONFIG: Record<number, string[]> = {
    0: [],                                          // 全部禁止
    1: ["MAPS", "PISTOL", "MOUNT"],                  // 地图/手枪/导轨
    2: ["MAPS", "PISTOL", "MOUNT", "FOOD", "AMMO"],  // +食物/弹药
    // ...
};

function applyTier(tier: number, items: Record<string, ITemplateItem>, blacklist: Set<string>) {
    const allowed = new Set(TIER_CONFIG[tier]);
    for (const id in items) {
        if (blacklist.has(id)) { items[id].CanSellOnRagfair = false; continue; }
        items[id].CanSellOnRagfair = allowed.has(items[id]._parent);
    }
}
```

**覆盖范围验证**：需要将现有的 40 个 `canSellX` 方法中检查的 `_parent` 值逐一映射到 `TIER_CONFIG` 的相应层级。这是纯数据迁移，不改变行为。

### P6（概率权重）—— 跳过，按用户指示忽略。

---

## 三、客户端-服务端统一修复路线图

以下将两份报告的修复项按关联性合并为统一计划。

### 阶段 1：关键 Bug 修复（两端同步）— 预计 3-4 小时

| 统一编号 | 原始编号 | 仓库 | 改动 |
|---------|---------|------|------|
| U-1 | 服务端 FIX-2 + 客户端联动 | Server | `json-handler.ts:245` 移除 `ArmorDamage = 1` 硬编码，改用模板数据；确保客户端 `BallisticController.cs` 读取的模板值与服务端数据库一致 |
| U-2 | 客户端 BUG-001 | Client | `HealthController.cs:2281` `typeof(ToxicityEffect)` → `typeof(RadiationEffect)` |
| U-3 | 客户端 BUG-002 | Client | `HealthController.cs:2342` 删除重复的 `totalToxicityExceedsTheshold` |
| U-4 | 客户端 BUG-003 | Client | `Zones.cs:754` `return` → `continue` |
| U-5 | 服务端 FIX-1 | Server | `armor.ts:611` 空字符串 ID → 实际 ID |
| U-6 | 服务端 FIX-3 | Server | `fleamarket.ts:701` `canSellIrons()` 添加赋值 |
| U-7 | 服务端 FIX-4 | Server | `traders.ts:372` 第二个分支改为美元 ID |
| U-8 | 服务端 FIX-5 | Server | `player.ts:322` `debuffMul()` 修复标量分支 |
| U-9 | 服务端 FIX-6 | Server | `traders.ts:392` `return` → `continue` |
| U-10 | 服务端 FIX-7 | Server | `insurance.ts:46` 修正拼写 |
| U-11 | 服务端 FIX-8 | Server | `traders.ts:862` 第二次 delete 改为 `BuyRestrictionMax` |
| U-12 | 服务端 FIX-9 | Server | `quests.ts:73` 修正任务 ID |
| U-13 | 服务端 FIX-10 | Server | `bots.ts:2264` 添加括号 |
| U-14 | 服务端 FIX-11 | Server | `bot_loot_serv.ts:759` 修正白名单 |
| U-15 | 服务端 FIX-12 | Server | `player.ts:352` `MaxDurability` 修正 |
| U-16 | 服务端 FIX-13 | Server | `weapons_globals.ts:88` 添加可选链 |
| U-17 | 客户端 BUG-006 | Client | `AudioPatches.cs:158` 添加 `return` |
| U-18 | 客户端 BUG-007 | Client | `HealthEffects.cs:369` 使用 `Time.deltaTime` |

### 阶段 2：性能优化（热路径）— 预计 6-8 小时

| 统一编号 | 原始编号 | 仓库 | 改动 | 预期收益 |
|---------|---------|------|------|---------|
| U-19 | 服务端 P1 | Server | 弹药加载改为外部 JSON + 单次遍历 + Map 查找 | 弹药加载时间 -85% |
| U-20 | 服务端 P3 | Server | 模板 JSON 循环结束后一次写入 | 模板生成速度 +95% |
| U-21 | 服务端 P5 | Server | `setArmorDuabaility` 改用 `items[id]` 直接索引 | 档案处理速度 +99% |
| U-22 | 服务端 P4 | Server | 分级跳蚤市场数据驱动重构 | 跳蚤更新延迟 -60% |
| U-23 | 客户端 PERF-002 | Client | `IndexOf` → `HashSet<int>` | 每帧 O(n)→O(1) |
| U-24 | 客户端 PERF-006 | Client | 帧率假设统一使用 `Plugin.FPS` | 非 144FPS 环境下行为一致 |
| U-25 | 客户端 PERF-007 | Client | `ZeroOffsetDict` LRU 清理 | 防止内存泄漏 |

### 阶段 3：数据清理 — 预计 1-2 小时

| 项目 | 仓库 | 改动 |
|------|------|------|
| 删除 `scavHealth`（#22） | Server | `botHealth.json` 移除死键 |
| 删除 `ammo_to_add.json` | Server | 全文件删除（320 行全为空对象） |
| 删除 `airdrops.js` 注释块 | Server | `misc/airdrops.js` 整个文件是注释 |
| 清理 buffs.json 空条目 | Server | 4 个空数组引用 |
| 客户端 QUAL-003 | Client | 被注释的代码块删除 |

### 阶段 4：代码质量 — 后续迭代

包括：服务端 P10（Bot 层级加载器重构）、P11（for...in 清理）、P12（ICloner 统一），客户端 PERF-001（StanceController 拆分）、QUAL-001（静态状态实例化）、QUAL-004（魔法数字提取）。

---

## 四、统一 S.P.E.C.I.A.L. 评分

| 属性 | 服务端 | 客户端 | 综合评价 |
|------|--------|--------|---------|
| **S**trength（性能） | 5/10 | 6/10 | 服务端存在多处可优化遍历；客户端帧级运算有 FPS 因子调整 |
| **P**erception（错误处理） | 4/10 | 3/10 | 两端都缺乏防御性空值检查；客户端反射无 try-catch |
| **E**ndurance（可靠性） | 6/10 | 6/10 | 核心功能稳定运行，但依赖全局可变状态 |
| **C**harisma（可读性） | 5/10 | 4/10 | 服务端有大量重复代码；客户端全静态架构 + 超大文件 |
| **I**ntelligence（算法） | 6/10 | 8/10 | 服务端层级设计合理；客户端弹道/后坐力模型设计精良 |
| **A**gility（响应性） | 5/10 | 5/10 | 服务端启动有开销；客户端帧级运算量大 |
| **L**uck（边缘情况） | 3/10 | 2/10 | **合计 23 个已确认 Bug**，零单元测试，EFT 更新风险高 |

---

> 审查完毕。Vault-Tec 建议优先处理联动缺陷 L-1（ArmorDamage 硬编码导致两端数据分裂），因为该问题同时影响服务端弹道平衡和客户端穿透计算。  
> *"Preparing for the Future!" -- Vault-Tec Corporation*
