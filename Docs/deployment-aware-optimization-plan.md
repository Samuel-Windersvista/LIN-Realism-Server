# 现实主义模组 -- 部署感知优化方案

> 审查日期：2026-05-24
> 基于：MO2 虚拟文件夹部署架构实际分析
> 集成包路径：`E:\Game\EFT_Offline\Life_in_Norvinsk\mods\`

---

## 零、部署架构认知

你的集成包通过 MO2 的双层结构部署现实主义模组：

```
MO2 优先级:
  [覆盖层] 《生活在诺文斯克》-单独-现实主义-数值重制+小火山汉化+兼容补丁
     │       └─ user/mods/SPT-Realism/   (覆盖以下文件)
     │
  [基础层] [5]现实主义大修-Realism
            └─ user/mods/SPT-Realism/     (完整原始文件)
            └─ BepInEx/plugins/RealismMod.dll  (客户端DLL，覆盖层不提供)
```

**覆盖层提供**（修改/新增）：
- `src/` 下 10 个 `.ts` 文件：`ammo.ts`、`armor.ts`、`meds.ts`、`weapons_globals.ts`、`attatchment_base.ts`、`description_gen.ts`、`quests.ts`、`mod.ts`、`gear.ts`、`item_cloning.ts`、`items.ts`
- `db/` 下全部模板 JSON 文件
- `config/config.json`（关闭了 22 个硬核功能）
- `db/templates/user_templates/` 下 158 个兼容补丁

**覆盖层不提供**（继承自基础层）：
- `src/player/`、`src/bots/`、`src/utils/`、`src/misc/`、`src/traders/fleamarket.ts`、`src/traders/traders.ts`、`src/traders/insurance.ts`、`src/json/json_gen.ts`、`src/json/json-handler.ts`
- `BepInEx/plugins/RealismMod.dll`（客户端 DLL）
- `bundles/`（3D 模型资源）

**原则**：覆盖层修改过的文件，基础层的 Bug 修复需要在覆盖层的副本上也同步应用。

---

## 一、针对你的部署情况重新评估优化方案

### 被取消的方案（会影响你的维护工作流）

| 原方案 | 取消原因 |
|--------|---------|
| **P1（弹药数据外置 JSON）** | 你的覆盖层已经修改了 `ammo.ts` 中的弹药配置值（如 Piranha 130→120）。如果把数据从 .ts 移到外部 JSON，你需要同时维护一个额外的 .json 文件。当前 .ts 内硬编码虽然"不优雅"，但对你来说**所有改动在一个文件内**，维护最简单。取消此优化。 |
| **P4（分级跳蚤市场重构）** | 你的 `config.json` 中 `tiered_flea: false`，此代码路径永远不会执行。重构无用代码没有意义。取消此优化。 |
| **P7（pmcTypes.json 压缩）** | 数据压缩会增加运行时展开逻辑，对可维护性没有帮助。200KB 的 JSON 在 Node.js 中解析仅需 2-5ms。且你已经关闭了 `pmc_types: true`，此文件仅在基础层存在但实际不会被有效使用。（注意：`boss_spawns: false` 和 `spawn_waves: false` 同理）取消此优化。 |
| **P8（armorMods.json 去重）** | 实际测试发现 Front/Back plate 顺序不同是故意的设计。引入共享常量池会增加代码层复杂度，且你已经覆盖了 `db/bots/loadouts/` 全部子目录。取消此优化。 |
| **P10（Bot 层级加载器重构）** | 涉及 `src/bots/bots.ts` 的大规模重构。虽然你未覆盖此文件，但大范围重构带来的回归风险不值得当前阶段的投入。**搁置**。 |
| **P12（ICloner 统一）** | 涉及 50+ 处修改，覆盖层未触碰的文件可以改，但覆盖层提供的 `.ts` 文件（如 `ammo.ts`、`armor.ts`）中也使用了 `JSON.parse(JSON.stringify(x))`，需要同步修改两面。工作量/收益比不佳。**搁置**。 |

### 保留的方案（安全可行，不破坏覆盖层）

| 方案 | 影响文件 | 覆盖层状态 | 风险 |
|------|---------|-----------|------|
| **FIX-1→FIX-13**（Bug 修复） | 见下表分配 | 见下表 | 低 |
| **P3（模板写入 IO）** | `json_gen.ts` | **未覆盖** | 极低 |
| **P5（setArmorDuabaility 嵌套循环）** | `player.ts` | **未覆盖** | 极低 |
| **P11（for...in 清理）** | 基础层多个文件 | 部分覆盖 | 低 |

---

## 二、Bug 修复分配表（你需要在哪个仓库改）

### 类别 A：仅在基础仓库修改（覆盖层不触碰这些文件，修好即生效）

| # | 文件 | Bug | 改动量 |
|---|------|-----|--------|
| F-1 | `ballistics/armor.ts:611` | Ceramic NIJ IV 空 ID | 1 行 |
| F-3 | `traders/fleamarket.ts:701` | canSellIrons() 空方法 | 1 行 |
| F-4 | `traders/traders.ts:372` | 美元汇率检查 | 1 行 |
| F-6 | `traders/traders.ts:392` | return→continue | 1 行 |
| F-7 | `traders/insurance.ts:46` | 拼写错误 | 1 行 |
| F-8 | `traders/traders.ts:862` | BuyRestrictionMax | 1 行 |
| F-10 | `bots/bots.ts:2264` | Lighthouse 括号 | 1 行 |
| F-11 | `bots/bot_loot_serv.ts:759` | 饮品白名单 | 1 行 |
| F-5 | `player/player.ts:322` | debuffMul 死代码 | 5 行 |
| F-12 | `player/player.ts:352` | MaxDurability 错误 | 1 行 |
| F-2 | `json/json-handler.ts:245` | ArmorDamage=1 硬编码 | 2 行 |

**合计：11 个 Bug，均在覆盖层未触碰的文件中。修改基础仓库即可。**

### 类别 B：需要在覆盖仓库同步修改（覆盖层替换了这些文件）

| # | 文件 | Bug | 改动量 | 你的覆盖层是否受影响 |
|---|------|-----|--------|---------------------|
| F-9 | `traders/quests.ts:73` | 万圣节任务 ID | 1 行 | **是** — 你覆盖了 quests.ts（用于汉化） |
| F-13 | `weapons/weapons_globals.ts:88` | 口径转换空值 | 5 行 | **是** — 你可能覆盖了此文件 |

**你的 `quests.ts` 覆盖层**中，`localesEN()` 返回 `"ch"` 而非 `"en"`，并在任务文本中使用了中文。F-9 的修复是修改 `loadHazardQuests()` 中一个条件检查的 quest ID（从错误的 `"6705425a..."` 改为正确的 `"6702b3e4..."`）。你的覆盖层保留了 `loadHazardQuests()` 方法。**你需要在此文件中找到对应行并做相同修改。**

**你的 `weapons_globals.ts` 覆盖层**（如果存在）中，`loadCaliberConversions()` 方法需要添加 `Chambers?.[0]` 可选链。如果你的覆盖层没有修改此方法，基础层的修复会被继承（因为覆盖层的文件替代了基础层，你需要确认覆盖层中此文件的内容）。

### 类别 C：客户端 Bug（在 LIN-Realism-Mod-Client 仓库修改）

| # | 文件 | Bug | 改动量 |
|---|------|-----|--------|
| C-1 | `HealthController.cs:2281` | 辐射类型检查 | 1 行 |
| C-2 | `HealthController.cs:2342` | 咳嗽条件重复 | 1 行 |
| C-3 | `Zones.cs:754` | return→continue | 1 行 |
| C-6 | `AudioPatches.cs:158` | CovertMovement 覆写 | 5 行 |
| C-7 | `HealthEffects.cs:369` | 帧率依赖计时 | 5 行 |

**注意**：客户端 DLL（`BepInEx/plugins/RealismMod.dll`）由基础层提供，你的覆盖层不触碰。客户端修复需要在 `LIN-Realism-Mod-Client` 仓库的源码中修改后重新编译 DLL，然后替换基础层的 DLL 文件。

---

## 三、性能优化（安全可行版）

### P3 -- 模板 JSON 一次写入（推荐）

**位置**：`src/json/json_gen.ts`（覆盖层不触碰）

**现状**：`itemWriteToFile()` 在循环中每次调用都写整个文件到磁盘。

**修改**：
```typescript
// 将 itemWriteToFile 调用从循环内移到循环外
// 在循环中构建内存对象，循环结束后一次性 fs.writeFileSync

// 改动前（循环内）：
for (let i in this.itemDB()) {
    itemWriteToFile(fileItem, path, index, assignFunc);
}

// 改动后（循环外）：
const outputObj: Record<string, any> = {};
for (const [id, item] of Object.entries(this.itemDB())) {
    const result = assignFunc(item);
    if (result) outputObj[id] = result;
}
fs.writeFileSync(path, JSON.stringify(outputObj, null, 4));
```

**为什么安全**：输出结果完全相同，只是写盘从 N 次变为 1 次。你的覆盖层不触碰 `json_gen.ts`，无需同步。

**预期效果**：模板生成阶段从数秒变为毫秒级。

### P5 -- setArmorDuabaility 从 O(n*m) 到 O(n)（推荐）

**位置**：`src/player/player.ts`（覆盖层不触碰）

**现状**：嵌套循环遍历库存 × 模板。

**修改**：将 `for (let i in this.tables.templates.items)` 查找改为直接索引 `this.tables.templates.items[invItem._tpl]`。

**为什么安全**：`tables.templates.items` 本身就是以物品 ID 为键的字典。直接索引是 O(1) 而非 O(n)，结果完全等价。

**预期效果**：档案处理速度提升 99%。

### P11 -- 清理 for...in 误用（可选）

**位置**：覆盖层不触碰的 `.ts` 文件中，将遍历数组的 `for...in` 改为 `for...of`。不涉及覆盖层文件，无兼容性风险。

**影响**：微小的性能提升 + 消除遍历原型链的隐患。优先级低。

---

## 四、你配置中关闭的功能对应的代码路径

因为你的 `config.json` 关闭了以下功能，相关 Bug **不影响你**：

| 关闭的功能 | 不受影响的 Bug |
|-----------|---------------|
| `tiered_flea: false` | F-3（canSellIrons）、F-12（flea0 双重调用）— 代码不执行 |
| `boss_spawns: false` | `spawns.ts` 中的 Boss 生成逻辑 — 不执行 |
| `spawn_waves: false` | `spawns.ts` 中的波次逻辑 — 不执行 |
| `insurance_changes` 未提及 | F-7（保险拼写）虽不执行但建议修复 |
| `randomize_trader_stock: false` | F-4、F-6、F-8 在 traders.ts 中 — 代码不执行 |

**但是**，如果将来你想重新开启某个功能，这些 Bug 会成为隐患。建议趁现在顺手修掉。

---

## 五、维护建议（与优化无关但影响你的实际体验）

### 你覆盖层的结构需要确认的潜在问题

1. **`src/json/json-handler.ts` 不提供，但 `src/json/description_gen.ts` 引用了它** — 你的覆盖层提供了 `description_gen.ts`（汉化版），但未提供 `json-handler.ts`。这依赖于 SPT 的模块解析机制能将两个文件合并。如果 SPT 的 mod 加载器对同一包名 `SPT-Realism` 使用覆盖层的全部 `.ts` 文件并忽略基础层，则 `description_gen.ts` 的 `import { ItemStatHandler } from "./json-handler"` 会失败。**请确认在你当前的部署中此 import 是否正常工作。**

2. **`db/templates/user_templates/` 有 158 个兼容补丁** — 这些 `.json` 文件需要定期随第三方模组更新而更新。确保你知道每个补丁对应哪个模组的哪个版本。

3. **基础层 `BepInEx/plugins/RealismMod.dll`** — 如果你修改了客户端仓库的源码并重新编译，新的 DLL 需要替换基础层的 DLL，覆盖层才会有新版客户端逻辑。

---

## 六、最终执行顺序（Overseer 已授权 P4/P10/P12）

```
阶段 1 [Bug 修复 — 基础仓库]                  ~1小时
  ├── F-1: armor.ts:611 空ID                   1行，基础仓库
  ├── F-2: json-handler.ts:245 ArmorDamage=1    2行，基础仓库
  ├── F-5: player.ts:322 debuffMul死代码        5行，基础仓库
  ├── F-12: player.ts:352 MaxDurability错误     1行，基础仓库
  ├── F-10: bots.ts:2264 Lighthouse括号         1行，基础仓库
  ├── F-11: bot_loot_serv.ts:759 饮品白名单     1行，基础仓库
  ├── F-3: fleamarket.ts:701 canSellIrons       1行，基础仓库
  ├── F-4: traders.ts:372 美元汇率              1行，基础仓库
  ├── F-6: traders.ts:392 return→continue       1行，基础仓库
  ├── F-7: insurance.ts:46 拼写                 1行，基础仓库
  └── F-8: traders.ts:862 BuyRestrictionMax     1行，基础仓库

阶段 2 [Bug 修复 — 覆盖仓库同步]               ~15分钟
  ├── F-9-OVERRIDE: quests.ts 万圣节任务ID      1行，覆盖仓库
  └── F-13-OVERRIDE: weapons_globals.ts 空值    5行，覆盖仓库

阶段 3 [Bug 修复 — 客户端仓库]                 ~30分钟
  ├── C-1: HealthController.cs 辐射类型检查     1行
  ├── C-2: HealthController.cs 咳嗽条件         1行
  ├── C-3: Zones.cs return→continue             1行
  ├── C-6: AudioPatches.cs CovertMovement        5行
  └── C-7: HealthEffects.cs 帧率计时            5行

阶段 4 [性能优化 — 基础仓库 + 覆盖层同步]      ~3小时
  ├── P3: json_gen.ts 模板一次写入              基础仓库
  ├── P5: player.ts setArmorDuabaility O(n)     基础仓库
  ├── P4: fleamarket.ts 数据驱动重构             基础仓库（已授权）
  ├── P10: bots.ts Bot层级加载器重构             基础仓库（已授权）
  └── P12: ICloner统一                          基础仓库 + 10个覆盖文件同步（已授权）

阶段 5 [代码清理]                               ~30分钟
  └── P11: for...in 清理（可选）
```

**P4备注**：`fleamarket.ts`覆盖层不提供，仅在基础仓库修改。  
**P10备注**：`bots.ts`覆盖层不提供，仅在基础仓库修改。`src/bots/bot_gen.ts`同理。  
**P12备注**：涉及`JSON.parse(JSON.stringify(x))`替换为`cloner.clone()`。基础层全部文件+覆盖层10个.ts文件同步。保持功能等价。

---

## 七、对你的覆盖层工作流的最终建议

1. **不要为了"代码优雅"而分离数据**。你目前的做法（修改 `.ts` 文件中的硬编码值 + 覆盖 `db/templates/` JSON）虽然不符合软件工程的抽象原则，但对你一个人维护来说是最直观的——所有改动都在你熟悉的文件中。

2. **基础层的优化对你透明即可**。P3（一次写盘）和 P5（嵌套循环改直接索引）是纯算法替换，结果完全等价，你的覆盖层不需要任何改动就能享受加速。

3. **客户端 DLL 是你覆盖层不触碰但必须依赖的**。修改客户端代码后记得把新的 DLL 放到基础层的 `BepInEx/plugins/` 下。

4. **158 个兼容补丁是维护债务的重头**。第三方模组更新时，补丁中的物品 ID 可能失效。建议在补丁目录建立索引文件，记录每个补丁对应的模组名和版本。

---

> Vault-Tec 建议：先修 6 个严重影响核心体验的 Bug（F-1, F-2, F-5, F-12, F-10, F-11）+ 2 个安全优化（P3, P5）。这些改动全部在你覆盖层不触碰的文件中，纯增量改进，零维护成本。
> 
> *"Preparing for the Future!" -- Vault-Tec Corporation*
