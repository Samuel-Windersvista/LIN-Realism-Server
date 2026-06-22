import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ParentClasses } from "../utils/enums";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ItemStatHandler } from "./json-handler";

export class DescriptionGen {

    constructor(private tables: IDatabaseTables, private modConfig: any, private logger: ILogger, private statHandler: ItemStatHandler) { }

    itemDB(): Record<string, ITemplateItem> {
        return this.tables.templates.items;
    }

    public descriptionGen() {
        for (let lang in this.tables.locales.global) {
            this.descriptionGenHelper(lang);
        }
    }

    private descriptionGenHelper(lang: string) {
        let locale = this.tables.locales.global[lang];
        for (let i in this.statHandler.modifiedItems) {
            const fileItem = this.statHandler.modifiedItems[i];
            this.attachmentDescription(fileItem, locale);
            this.gunDescription(fileItem, locale);
            this.gearDescription(fileItem, locale);
        }
        for (let templateId in this.itemDB()) {
            const item = this.itemDB()[templateId];
            this.medDescription(item, locale, templateId);
            this.ammoDescriptions(item, locale, templateId)
        }
    }

    private gunDescription(fileItem, locale: Record<string, string>) {
        if (fileItem.$type.includes("Gun")) {
            let type = fileItem.WeapType;
            let templateId = fileItem.ItemID;
            if (type === "DI") {
                locale[`${templateId}` + " Description"] = "该武器采用直接导气式系统，因此安装消音器会增加耐久损耗。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "short_AK") {
                locale[`${templateId}` + " Description"] = "该武器枪管较短，导气时间较短，因此可靠性降低。建议在使用时安装枪口助推器，或至少安装消音器。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
        }
    }

    private gearDescription(fileItem, locale: Record<string, string>) {
        if (fileItem.$type.includes("Gear")) {
            let templateId = fileItem.ItemID;
            let serverItem = this.itemDB()[templateId];
            if ((serverItem._parent === ParentClasses.ARMOREDEQUIPMENT || serverItem._parent === ParentClasses.HEADWEAR || serverItem._parent === ParentClasses.FACECOVER) && serverItem._props.HasHinge == true) {
                if (fileItem.AllowADS == true) {
                    locale[`${templateId}` + " Description"] = "该面罩允许在使用任何展开状态的枪托时使用瞄具。" + `\n\n${locale[`${templateId}` + " Description"]}`;
                }
                else {
                    locale[`${templateId}` + " Description"] = "该面罩在使用展开/打开状态的枪托时不允许使用瞄具，除非武器/枪托本身支持。" + `\n\n${locale[`${templateId}` + " Description"]}`;
                }
                locale[`${templateId}` + " Description"] = "该面罩在展开时会额外降低移动速度。人机功效惩罚仅在展开时生效。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if ((serverItem._parent === ParentClasses.ARMOREDEQUIPMENT || serverItem._parent === ParentClasses.HEADWEAR || serverItem._parent === ParentClasses.FACECOVER) && serverItem._props.HasHinge == false) {
                if (fileItem.AllowADS == false) {
                    locale[`${templateId}` + " Description"] = "该装备在使用展开/打开状态的枪托时会阻挡瞄具的使用，除非武器/枪托本身支持。" + `\n\n${locale[`${templateId}` + " Description"]}`;
                }
            }
        }
    }

    private attachmentDescription(fileItem, locale: Record<string, string>) {
        if (fileItem.$type.includes("WeaponMod")) {
            let type = fileItem.ModType;
            let templateId = fileItem.ItemID;
            let serverItem = this.itemDB()[templateId];
            if (type === "bipod") {
                locale[`${templateId}` + " Description"] = "两脚架可以提高掩体探测范围，并在架设时提供更高的稳定性和后坐力控制。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "DI") {
                locale[`${templateId}` + " Description"] = "该武器采用直接导气式系统，因此安装消音器会增加耐久损耗。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "short_AK") {
                locale[`${templateId}` + " Description"] = "该武器枪管较短，导气时间较短，因此可靠性降低。建议在使用时安装枪口助推器，或至少安装消音器。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if ((serverItem._parent === ParentClasses.SILENCER || serverItem._parent === ParentClasses.FLASH_HIDER || serverItem._parent === ParentClasses.COMPENSATOR) && fileItem.ModMalfunctionChance !== 0) {
                locale[`${templateId}` + " Description"] = "该枪口配件的故障率降低效果不适用于手动操作枪械（如栓动步枪）。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (fileItem.CanCycleSubs == true && (serverItem._parent === ParentClasses.SILENCER || serverItem._parent === ParentClasses.GASBLOCK)) {
                locale[`${templateId}` + " Description"] = "该配件可以确保亚音速弹药可靠循环。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "short_barrel") {
                locale[`${templateId}` + " Description"] = "短管受益于枪口增压器，提高了可靠性，但会增加耐久度消耗和射速。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "gas") {
                locale[`${templateId}` + " Description"] = "这个充气手柄在射击时减少气体/烟雾。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "booster") {
                locale[`${templateId}` + " Description"] = "这个枪口设备是一个增压器。它在短管步枪上提供完整的射速、故障和耐久度消耗数据，而在长管步枪上提供较少的增益。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "muzzle_supp_adapter" || type === "sig_taper_brake" || type === "barrel_2slot") {
                locale[`${templateId}` + " Description"] = "这个枪口设备是一个适配器，如果装上了消音器，将失去除精确性外的所有属性。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "shot_pump_grip_adapt") {
                locale[`${templateId}` + " Description"] = "如果在这个泵把手上安装了前握把，将会提高弹膛/泵送速度。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "buffer_adapter" || type === "stock_adapter" || type === "grip_stock_adapter") {
                locale[`${templateId}` + " Description"] = "这个适配器通过提高或降低与枪管对齐的枪托来改变武器的后坐力特性。除非装上枪托，否则不会提供任何属性。如果有手枪握把槽，装上手枪握把后，会提升包括 人机功效、后坐力，膛室/泵/枪栓 的速度。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "hydraulic_buffer") {
                locale[`${templateId}` + " Description"] = "这个液压缓冲器在没有安装在霰弹枪、狙击步枪或突击卡宾枪上时，会失去所有的后坐力减少属性。故障几率属性仅适用于非手动操作的枪械。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "buffer") {
                locale[`${templateId}` + " Description"] = "这个缓冲管在没有安装在使用缓冲器的武器系统（如M4、ADAR、MK47、SR25、STM等）上时，会失去后坐力、射速和耐久度消耗属性。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "buffer_stock") {
                locale[`${templateId}` + " Description"] = "这个枪托在没有安装在使用缓冲器的武器系统（如M4、ADAR、MK47、SR25、STM等）上时，会失去射速和耐久度消耗属性。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "stock" && fileItem.StockAllowADS == true) {
                locale[`${templateId}` + " Description"] = "这个枪托允许在佩戴任何面罩的情况下瞄准。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "foregrip_adapter") {
                locale[`${templateId}` + " Description"] = "这个适配器如果装上了握把，将会失去其负面的人机功效属性。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "sight") {
                locale[`${templateId}` + " Description"] = "瞄准时的速度和精准性修正仅在使用此瞄准镜时生效。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
            if (type === "mount") {
                locale[`${templateId}` + " Description"] = "精准性修正仅在安装在其上的瞄准镜生效时生效。" + `\n\n${locale[`${templateId}` + " Description"]}`;
            }
        }
    }

    private medDescription(item: ITemplateItem, locale: Record<string, string>, templateId: string) {
        if (item._parent === ParentClasses.STIMULATOR && this.modConfig.stim_changes === true) {
            //generic
            if (item._id === "5fca13ca637ee0341a484f46" || item._id === "637b612fb7afa97bfc3d7005" || item._id === "637b6251104668754b72f8f9") {
                locale[`${templateId}` + " Description"] = `\n\n${locale[`${templateId}` + " Description"]}` + "\n\n警告: 可能包含以下副作用： 持续疼痛, 脑震荡/脑肿胀, 颤栗, 代谢减缓, 抗压下降, 免疫下降, 喘气声, 慢性疼痛和整体活力下降。";
            }
            //regen
            if (item._id === "5c0e534186f7747fa1419867" || item._id === "5c0e530286f7747fa1419862" || item._id === "6783aca07b1449bd298b10f8") {
                locale[`${templateId}` + " Description"] = `\n\n${locale[`${templateId}` + " Description"]}` + "\n\n警告: 可能包含以下副作用： 持续疼痛, 颤栗以及增加瘀伤、伤害和组织损伤的易感性。";
            }
            //damage
            if (item._id === "5ed515ece452db0eb56fc028" || item._id === "637b6179104668754b72f8f5") {
                locale[`${templateId}` + " Description"] = `\n\n${locale[`${templateId}` + " Description"]}` + "\n\n警告: 可能包含以下副作用： 脑震荡/脑肿胀, 颤栗, 感知下降, 注意力下降，活力下降，器官功能迅速恶化和坏死。";
            }
            //adrenal
            if (item._id === "5c10c8fd86f7743d7d706df3" || item._id === "5ed515e03a40a50460332579" || item._id === "637b620db7afa97bfc3d7009") {
                locale[`${templateId}` + " Description"] = `\n\n${locale[`${templateId}` + " Description"]}` + "\n\n警告: 可能包含以下副作用： 试管效应, 颤栗, 喘气声, 疲劳, 虚弱和压力性心肌病。";
            }
            //clotting
            if (item._id === "5ed515f6915ec335206e4152" || item._id === "5c0e533786f7747fa23f4d47") {
                locale[`${templateId}` + " Description"] = `${locale[`${templateId}` + " Description"]}` + "\n\n警告: 可能包含以下副作用： 持续疼痛, 颤栗, 注意力下降，感知下降、呼吸困难, 慢性疼痛和血凝。";
            }
            //weight
            if (item._id === "5ed51652f6c34d2cc26336a1" || item._id === "66507eabf5ddb0818b085b68") {
                locale[`${templateId}` + " Description"] = `${locale[`${templateId}` + " Description"]}` + "\n\n警告: 可能包含以下副作用： 试管效应, 颤栗, 感知下降, 代谢减缓, 喘气声, 疲劳和虚弱。";
            }
            //performance
            if (item._id === "5ed5160a87bb8443d10680b5" || item._id === "5ed515c8d380ab312177c0fa" || item._id === "5c0e531d86f7747fa23f4d42" || item._id === "5c0e531286f7747fa54205c2") {
                locale[`${templateId}` + " Description"] = `${locale[`${templateId}` + " Description"]}` + "\n\n警告: 可能包含以下副作用： 试管效应, 颤栗, 抗压等级下降, 喘气声和肌肉疼痛。";
            }
        }
    }

    private ammoDescriptions(item: ITemplateItem, locale: Record<string, string>, tempalteId: string) {
        if (item._parent === ParentClasses.AMMO && item._props.ammoHear === 1) {
            locale[`${tempalteId}` + " Description"] = "这种弹药是亚音速的，其口径需要特殊的配件或改装才能进行可靠的开火。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
        }
        if (item._parent === ParentClasses.AMMO) {
            if (item._id === "56dff4ecd2720b5f5a8b4568" || item._id === "59e4d24686f7741776641ac7") {
                locale[`${tempalteId}` + " Description"] = "这款弹药是超音速的，没有修改或使用特殊消音器（如PBS消音器）将无法保证射击的可靠性。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber20g") {
                locale[`${tempalteId}` + " Description"] = "弹药统计数据来自 Toz-106。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber12g") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 610mm枪管。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber23x75") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 700mm枪管。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber46x30") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 MP7。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber57x28") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 标准P90/264mm枪管。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber9x18PM") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 Makarov。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber9x19PARA") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 254mm枪管。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber1143x23ACP") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 254mm枪管。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber9x33R") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 127mm枪管。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber9x21") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 SR-1MP。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber762x25TT") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 TT-30托卡列夫。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber762x35") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 229mm枪管。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber9x39") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 VSS/AS VAL。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber366TKM") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 415mm枪管/标准AKM样式步枪。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber556x45NATO") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 419mm枪管。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber545x39") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 415mm枪管/标准AKM样式步枪。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber762x39") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 415mm枪管/标准AKM样式步枪。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber762x51") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 508mm枪管。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber762x54R") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 508mm枪管。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber127x55") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 ASH-12。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
            if (item._props.Caliber === "Caliber86x70") {
                locale[`${tempalteId}` + " Description"] = "弹药的统计数据基于 610mm枪管。" + `\n\n${locale[`${tempalteId}` + " Description"]}`;
            }
        }
    }
}