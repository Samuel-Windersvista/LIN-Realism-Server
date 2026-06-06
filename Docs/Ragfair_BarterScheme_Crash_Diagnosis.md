# 跳蚤市场 `barter_scheme` TypeError 崩溃诊断报告

> 日期: 2026-06-05 | SPT 版本: 3.11.4 | 整合包: Life in Norvinsk

---

## 1. 错误现象

```
TypeError: Cannot read properties of undefined (reading 'barter_scheme')
    at C:\snapshot\project\obj\helpers\RagfairOfferHelper.js
    at Array.some (<anonymous>)
    at RagfairOfferHelper.traderOfferItemQuestLocked (...)
    at RagfairController.getOffers (...)
    at RagCallback.mySearch (SPT-Realism/src/traders/traders.ts:1127:65)
```

- **触发条件**: 跳蚤市场搜索任意物品时有概率出现
- **清缓存后可暂时恢复**，但后续仍会复发
- **状态依赖**: 搜索成功 → 购买物品 → 再次搜索→ 崩溃

---

## 2. 根因分析 (SPT 核心代码缺陷)

### 2.1 崩溃点定位

SPT 核心 `RagfairOfferHelper.traderOfferItemQuestLocked` 函数 (C# 移植版源码):

```csharp
public bool TraderOfferItemQuestLocked(RagfairOffer offer, 
    Dictionary<MongoId, TraderAssort> traderAssorts)
{
    var itemIds = offer.Items.Select(x => x.Id).ToHashSet();
    
    foreach (var _ in offer.Items)
    {
        traderAssorts.TryGetValue(offer.User.Id, out var assorts);
        // [!] BUG: TryGetValue 返回 false 时 assorts 为 null，
        //     但代码未检查 null 就直接访问 .BarterScheme
        if (assorts.BarterScheme.Where(x => itemIds.Contains(x.Key))
            .Any(barterKvP => barterKvP.Value.Any(
                subBarter => subBarter.Any(
                    subBarter => subBarter.SptQuestLocked.GetValueOrDefault(false)
                ))
            ))
        {
            return true;
        }
    }
    return false;
}
```

**JavaScript/TypeScript 版本等效代码:**

```javascript
traderOfferItemQuestLocked(offer, traderAssorts) {
    const itemIds = new Set(offer.items.map(x => x._id));
    
    for (const _ of offer.items) {
        const assorts = traderAssorts[offer.user.id]; // <-- 可能为 undefined!
        // [!] BUG: 未检查 assorts 是否为 undefined
        if (assorts.barter_scheme... ) // <-- TypeError!
            return true;
    }
    return false;
}
```

### 2.2 触发机制

`traderAssorts` 字典由 `RagfairController.getOffers` 内部构建，包含所有"可更新" trader 的 assort 快照。

当某个 trader 的 assort 因 MOD 操作（详见第 3 节）处于**不完整状态**时，该 trader 可能被排除在字典外。此时任何该 trader 的跳蚤报价在搜索时都会触发 null 引用崩溃。

由于字典是**运行时动态构建**的，崩溃具有**随机性和状态依赖性**——清缓存后字典完整则不崩溃，MOD 异步修改数据后字典不完整则崩溃。

### 2.3 受影响的 MOD 组件

以下 MOD 操作可能导致 trader assort 在不同组件间不同步:

| MOD | 操作 | 影响 |
|-----|------|------|
| **barter_economy** | `modifyTrader()` 异步替换 `assort.items` 为 pristine 但保留修改过的 `barter_scheme` | items/barter_scheme 键不匹配 |
| **SPT-Realism** | `myResetExpiredTrader()` 仅替换 items 保留 barter_scheme | 同上 |
| **SPT-Realism** | `addItemsToAssorts()` 添加自定义物品 | 增加 barter_scheme 条目 |
| **WTT-* / MoxoPixel-*** | `CustomItemService` / `CustomAssortSchemeService` 直接写入 barter_scheme | 无 guard 检查 |

---

## 3. 修复方案 (SPT-Realism MOD 侧)

### 3.1 防御层 1: 拦截 `RagfairController.getOffers` (mod.ts)

在每次 `getOffers` 调用前同步所有 trader 的 `barter_scheme`:

```typescript
container.afterResolution("RagfairController", (_t, result) => {
    const originalGetOffers = result.getOffers.bind(result);
    result.getOffers = function(sessionID, info) {
        syncAllTraderBarterSchemes(databaseService, logger);
        return originalGetOffers(sessionID, info);
    };
}, { frequency: "Always" });
```

### 3.2 防御层 2: `RagCallback.mySearch` 错误兜底 (traders.ts)

若防御层 1 未能阻止崩溃，搜索返回空结果而非传播异常:

```typescript
try {
    return this.httpResponse.getBody(this.ragfairController.getOffers(sessionID, info));
} catch (e) {
    this.logger.error(...);
    return this.httpResponse.getBody({}); // 返回空结果
}
```

### 3.3 防御层 3: `myResetExpiredTrader` 同步 (traders.ts)

Trader 刷新时同步 `barter_scheme` 与 `items`:

```typescript
this.syncBarterSchemeWithItems(trader);
```

### 3.4 防御层 4: `postDBLoad` 初始化 (traders.ts)

启动时确保所有 trader 的 `barter_scheme` 对象存在且每个 item 都有对应条目:

```typescript
traders.ensureBarterSchemesExist();
```

### 3.5 Bug 修复: `return` → `continue` (traders.ts:394)

`adjustPriceByCategory` 中 `itemParent == null` 时应跳过当前 item 而非退出整个函数。

---

## 4. 修复局限性与根本解决方案

### 4.1 MOD 侧无法彻底修复的原因

`traderOfferItemQuestLocked` 是 SPT 核心编译代码（打包在 `SPT.Server.exe` 中），MOD 无法直接修改其 null 检查逻辑。

`traderAssorts` 字典的构建过程在 `getOffers` 内部，MOD 只能在调用前同步 `tables.traders` 全局数据。如果字典来源于**其他缓存服务**而非直接读取 `tables.traders`，则同步无效。

### 4.2 向 SPT 开发者建议的修复

在 `RagfairOfferHelper.traderOfferItemQuestLocked` 中添加 null 检查:

```csharp
// 修复前
traderAssorts.TryGetValue(offer.User.Id, out var assorts);
if (assorts.BarterScheme.Where(...)...)

// 修复后
if (!traderAssorts.TryGetValue(offer.User.Id, out var assorts) || assorts == null)
    continue; // 或 return false
```

---

## 5. 修改文件清单

| 文件 | 变更内容 |
|------|---------|
| `mods/[5].../SPT-Realism/src/mod.ts` | 新增 `syncAllTraderBarterSchemes` + `RagfairController.getOffers` 拦截 |
| `mods/[5].../SPT-Realism/src/traders/traders.ts` | 增强 `ensureBarterSchemesExist`、新增 `syncBarterSchemeWithItems`、新增 `ensureAllTraderBarterSchemesSynced`、`RagCallback` 构造函数扩展、`mySearch` 错误兜底、`adjustPriceByCategory` bug 修复 |
| `overwrite/.../SPT-Realism/src/mod.js` | 同上 JS 编译版 |
| `overwrite/.../SPT-Realism/src/traders/traders.js` | 同上 JS 编译版 |
| `mods/[兼容补丁]/.../SPT-Realism/src/mod.ts` | 同步 `RagCallback` 构造参数 |

---

## 6. 测试结果

| 场景 | 修复前 | 修复后 |
|------|--------|--------|
| 搜索炼乳 (Condensed Milk) | TypeError 崩溃 | 日志记录 + 返回空结果 |
| 搜索 Iskra 军粮 | TypeError 崩溃 | 日志记录 + 返回空结果 |
| 搜索其他物品 | 正常 | 正常 |
| 直接找商人购买 | 正常 | 正常 |

---

> Vault-Tec Engineering Note: This bug exists in SPT core, not in any mod.
> The mod-side fixes are defensive workarounds. A permanent fix requires
> updating SPT server source code.
