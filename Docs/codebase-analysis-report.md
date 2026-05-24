# SPT-Realism Mod 代码库分析报告

> 分析日期：2026-05-24
> 分析范围：src/ 全部源文件 + db/ 全部数据文件 + config/ + data/
> 项目版本：v1.6.2 | SPT 兼容：3.11.x

---

## 一、项目架构总览

SPT-Realism 是一个面向 SPT 3.11.x 的综合性玩法大修模组。通过**直接覆写 SPT 服务端内存数据库**的方式，修改游戏的弹道、护甲、武器、Bot AI/装备/生成、跳蚤市场、商人交易、任务、保险、地图生成等几乎所有核心机制。

```
src/
  mod.ts                     # 主入口，生命周期管理
  ballistics/                # 弹道系统（ammo.ts, armor.ts）
  weapons/                   # 武器系统（weapons_globals.ts, attatchment_base.ts）
  bots/                      # Bot 系统（bots.ts, bot_gen.ts, bot_loot_serv.ts, spawns.ts）
  items/                     # 物品系统（meds.ts, items.ts, gear.ts, item_cloning.ts）
  traders/                   # 商人/市场系统（fleamarket.ts, traders.ts, insurance.ts, quests.ts）
  json/                      # 模板系统（json_gen.ts, json-handler.ts, description_gen.ts）
  player/                    # 玩家系统（player.ts）
  utils/                     # 工具（utils.ts, arrays.ts, enums.ts）
  misc/                      # 杂项（seasonalevents.ts, airdrops.js）
```

### 生命周期三阶段

1. **`preSptLoad`** -- 注册路由、覆写核心类（Bot生成器/保险/交易商刷新/跳蚤市场）
2. **`postDBLoad`** -- 数据库加载后的一次性配置修改（物品/弹道/护甲/武器/Bot/交易商）
3. **`postSptLoad`** -- SPT 完全启动后获取模组加载器引用

---

## 二、关键缺陷清单

### 严重 (Critical) -- 导致核心功能失效

| # | 文件 | 行号 | 问题 |
|---|------|------|------|
| 1 | `ballistics/armor.ts` | 611 | `if (serverItem._id === "")` -- 空字符串 ID，Ceramic NIJ IV 装甲板数据永不生效 |
| 2 | `json/json-handler.ts` | 245-246 | `ArmorDamage = 1; casingMass = 1` 对所有弹药硬编码覆盖，破坏弹道平衡 |
| 3 | `traders/fleamarket.ts` | 701-706 | `canSellIrons()` 方法体为空，铁质瞄具在分级市场中永不解锁 |
| 4 | `traders/traders.ts` | 372 | 美元汇率检查的第二个分支仍检查欧元 ID（复制粘贴错误） |
| 5 | `player/player.ts` | 322-323 | `debuffMul()` 标量分支 `buff *= mult` 修改局部变量而非对象属性（死代码） |
| 6 | `json/description_gen.ts` | 37,71 | `WeapType` 和 `ModType` 为空串，武器/附件自定义描述完全不生成 |
| 7 | `player/player.ts` | 352-353 | `MaxDurability` 被错误设为 `Durability`（当前耐久度），应设为 `MaxDurability` |

### 高优先级 (High) -- 导致功能异常

| # | 文件 | 行号 | 问题 |
|---|------|------|------|
| 8 | `traders/traders.ts` | 392-393 | `return` 应改为 `continue`，导致首个缺失模板的物品之后全部跳过 |
| 9 | `traders/insurance.ts` | 46 | `simulateItemsBeingTaken` 拼写错误，Prapor 物品被取走模拟静默禁用 |
| 10 | `traders/traders.ts` | 862 | 两次删除 `BuyRestrictionCurrent`，`BuyRestrictionMax` 永远不被清理 |
| 11 | `traders/quests.ts` | 73-76 | "Blue Flame - Part 1" 万圣节条件错误应用到 "Illicit Procedures" |
| 12 | `traders/fleamarket.ts` | 140-148 | `updateFlea()` 双重调用 `flea0()` |
| 13 | `bots/bots.ts` | 2264 | Lighthouse 白天条件括号缺失，白天也匹配夜间分支 |
| 14 | `bots/bot_loot_serv.ts` | 759 | 饮品白名单使用 `items.food.whitelist` 而非 `items.drink.whitelist` |
| 15 | `weapons/weapons_globals.ts` | 88-104 | 口径转换代码缺少 `Chambers` 的空值检查 |
| 16 | `json/json_gen.ts` | 253 | 每个物品写一次整个文件（5000+ 次全量磁盘 IO） |

### 数据问题

| # | 文件 | 问题 |
|---|------|------|
| 17 | `db/bots/pmcTypes.json` | ~200KB 极端重复，48 个几乎相同的嵌套块（可压缩 90%） |
| 18 | `db/bots/loadouts/templates/armorMods.json` | Front/Back plate 数组在每个护甲中完全相同重复 |
| 19 | `db/bots/user_bot_templates/ammo_to_add.json` | 320 行全部为空对象 `{}`（死数据） |
| 20 | `db/bots/botconfig.json:341` | `exusec` 的 `minLimitPercent: 155`（超过 100%） |
| 21 | `db/items/buffs.json` | 4 个 buff 条目为空数组，但被引用 |
| 22 | `db/bots/botHealth.json` | scavHealth 数组有完全重复的条目 |
| 23 | `db/new_items/items.json` | 3 个刺刀定义几乎相同（可共享 _proto） |
| 24 | 文件名拼写 | `attatchments/` 目录名、`UBGLTempaltes.json` |

---

## 三、性能问题

| # | 位置 | 问题 | 严重性 |
|---|------|------|--------|
| P1 | `ammo.ts` | 三次完全遍历物品 DB，每次 130 个 `if (id === "...")` 硬编码比较，~130 万次比较/调用 | 高 |
| P2 | `item_cloning.ts` | `pushItemToSlots()`：15 个物品 x 5000 项 x 3 槽位 = 225,000 次迭代 | 中 |
| P3 | `json_gen.ts` | `itemWriteToFile()` 每个物品写一次完整文件 | 高 |
| P4 | `fleamarket.ts` | 层级 7 每个物品 ~45 次 `canSellX()` 方法调用，~180 万次/刷新 | 中 |
| P5 | `player.ts` | `setArmorDuabaility()` 嵌套循环：200 物品 x 5000 模板 = 1,000,000 次迭代 | 高 |
| P6 | `utils.ts` | `probabilityWeighter()` 创建巨大中间数组，有权重溢出风险 | 中 |
| P7 | `bots.ts` | 层级加载器 1500+ 行重复代码（20+ 个几乎相同的方法） | 中 |
| P8 | 全局 | `JSON.parse(JSON.stringify(x))` 深度克隆被使用 50+ 次 | 低 |

---

## 四、优化实施计划

### 阶段一：紧急修复（13 个 Bug） -- 预计 2-3 小时

所有改动都是单文件、单行的修正，风险极低。

| 任务 | 文件 | 改动 |
|------|------|------|
| FIX-1 | `armor.ts:611` | 空字符串 ID 替换为实际 Ceramic NIJ IV 物品 ID |
| FIX-2 | `json-handler.ts:245-246` | 从模板文件读取 ArmorDamage/casingMass，移除硬编码 1 |
| FIX-3 | `fleamarket.ts:701-706` | 添加 `item.CanSellOnRagfair = bool;` |
| FIX-4 | `traders.ts:372` | 第二个 if 条件改为 `"569668774bdc2da2298b4568"`（美元 ID） |
| FIX-5 | `player.ts:322-323` | `param = buff * mult` 并正确赋值回原始对象属性 |
| FIX-6 | `traders.ts:392-393` | `return` 改为 `continue` |
| FIX-7 | `insurance.ts:46` | 修正 `simulateItemsBeingTaken` 属性名 |
| FIX-8 | `traders.ts:862` | 第二次删除改为 `BuyRestrictionMax` |
| FIX-9 | `quests.ts:73-76` | quest ID 改为 `"6702b3e4aff397fa3e666fa5"`（Blue Flame） |
| FIX-10 | `bots.ts:2264` | 添加括号：`if ((isNight && "Lighthouse") \|\| "lighthouse")` |
| FIX-11 | `bot_loot_serv.ts:759` | `items.food.whitelist` 改为 `items.drink.whitelist` |
| FIX-12 | `player.ts:352-353` | `MaxDurability` 改为 `_props.MaxDurability` |
| FIX-13 | `weapons_globals.ts:88-104` | 添加 `Chambers?.[0]` 可选链 |

### 阶段二：性能优化（热路径） -- 预计 4-6 小时

**P1 -- 弹药加载 O(n*m) 重构** (~1.5h)
- 将弹药配置提取到外部 JSON，改为 Map O(1) 查找 + 单次遍历
- 预期：加载时间减少 ~85%

**P2 -- pushItemToSlots 反向索引** (~1h)
- 预构建 `slotFilterIndex: Record<itemID, parentID[]>`，O(1) 查找
- 预期：启动时间减少 ~5-8%

**P3 -- 模板 JSON 写入优化** (~30min)
- 内存构建完成对象，循环结束后一次 `fs.writeFileSync()`
- 预期：模板生成速度提升 95%+

**P4 -- 分级跳蚤市场数据驱动重构** (~1.5h)
- 层级配置改为声明式数据结构，单次遍历
- 预期：跳蚤更新延迟减少 ~60%

**P5 -- setArmorDuabaility 改用直接索引** (~20min)
- 使用 `items[invItem._tpl]` 替代嵌套循环
- 预期：档案处理速度提升 99%+

**P6 -- probabilityWeighter 安全修复** (~15min)
- 改用累积分布 + 二分查找，加整数/正数验证
- 预期：消除内存峰值风险

### 阶段三：数据优化 -- 预计 2-3 小时

**P7 -- pmcTypes.json 压缩** (~1h)
- 提取基础权重表，每个地图/派系只存差值
- 预期：200KB → ~20KB

**P8 -- armorMods.json 去重** (~30min)
- 提取共享插板列表为命名常量
- 预期：150KB → ~60KB

**P9 -- 清理死数据** (~30min)
- 删除 `ammo_to_add.json`、`airdrops.js`、注释代码
- 合并 `blacklistedItems` 重复定义
- 清理 buffs 空条目

### 阶段四：代码质量 -- 预计 3-4 小时

**P10 -- Bot 层级加载器重构** (~2h)
- 提取 `applyTierLoadout(bot, tierData, options)` 统一方法
- 代码量减少 ~70%

**P11 -- for...in 重构** (~30min)
- 数组改为 `for...of`，对象改为 `Object.entries()`

**P12 -- 统一使用 SPT ICloner** (~30min)
- 替换 50+ 处 `JSON.parse(JSON.stringify())` 为 `cloner.clone()`
- 克隆性能提升 ~2-3x

### 阶段五：功能修复 -- 预计 1.5 小时

**P13 -- 重建设计生成系统**
- 修复 `json_gen.ts` 确保填充 `WeapType`/`ModType`
- 修复 `json-handler.ts` 硬编码 `ModType = ""`
- 验证多语言描述文本

---

## 五、S.P.E.C.I.A.L. 评分

| 属性 | 评分 | 评价 |
|------|------|------|
| Strength (性能) | 5/10 | 多处可优化遍历和 IO |
| Perception (错误处理) | 4/10 | 缺乏防御性空值检查，硬编码依赖 |
| Endurance (可靠性) | 6/10 | 核心功能稳定，依赖全局可变状态 |
| Charisma (可读性) | 5/10 | 结构清晰但有大量重复；拼写错误多 |
| Intelligence (算法) | 6/10 | 弹道/护甲数据参考真实世界；层级设计合理 |
| Agility (响应时间) | 5/10 | 启动有明显开销；Bot 生成 600+ 后缓存生效 |
| Luck (边缘情况) | 3/10 | 16 个关键 Bug + 多处逻辑问题 |

---

*报告结束。Vault-Tec -- Preparing for the Future!*
