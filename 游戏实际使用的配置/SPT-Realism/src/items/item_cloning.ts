
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { JsonUtil } from "@spt/utils/JsonUtil";
import { IQuest } from "@spt/models/eft/common/tables/IQuest";
import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { StaticArrays } from "../utils/arrays";

export class ItemCloning {
    constructor(private logger: ILogger, private tables: IDatabaseTables, private modConfig, private jsonUtil: JsonUtil, private medItems, private crafts) { }

    itemDB(): Record<string, ITemplateItem> {
        return this.tables.templates.items;
    }
    questDB(): Record<string, IQuest> {
        return this.tables.templates.quests;
    }

    public createCustomMedItems() {
        //SJ0 Regen
        this.cloneMedicalItem(
            "5c10c8fd86f7743d7d706df3",
            "6783aca07b1449bd298b10f8",
            this.medItems.SJ0.MaxHpResource,
            this.medItems.SJ0.medUseTime,
            this.medItems.SJ0.hpResourceRate,
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_loot.bundle",
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_container.bundle",
            "blue",
            this.medItems.SJ0.effects_damage,
            {}
        );
        this.addToHandbook("6783aca07b1449bd298b10f8", "5b47574386f77428ca22b33a", 98000);
        this.addToLocale("6783aca07b1449bd298b10f8", "SJ0 TGLabs 战斗兴奋剂注射器", "SJ0", "TerraGroup Labs 首次尝试研发具有再生特性的战斗兴奋剂。尽管有报道称最初的试验结果令人鼓舞，但 USEC 特工在战区进行的测试却因大量未报告的副作用而以灾难告终。该兴奋剂随后被召回销毁，但塔科夫地区的一些不法分子设法截获了大量该产品，并至今仍在兜售，他们经常重复使用旧的肾上腺素注射器外壳或其他任何能弄到手的东西。");

        //Adrenal Debuffs
        this.cloneMedicalItem(
            "5c10c8fd86f7743d7d706df3",
            "6783ad365524129829f0099d",
            0,
            2,
            0,
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_loot.bundle",
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_container.bundle",
            "blue",
            {},
            {}
        );
        this.addToHandbook("6783ad365524129829f0099d", "5b47574386f77428ca22b33a", 1);
        this.addToLocale("6783ad365524129829f0099d", "Adrenal Debuff", "Adrenal", "If you are seeing this outside of the handbook, something has gone wrong.");

        //Regen Debuff
        this.cloneMedicalItem(
            "5c10c8fd86f7743d7d706df3",
            "6783ad5260cc8e9597065ec5",
            0,
            2,
            0,
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_loot.bundle",
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_container.bundle",
            "blue",
            {},
            {}
        );
        this.addToHandbook("6783ad5260cc8e9597065ec5", "5b47574386f77428ca22b33a", 1);
        this.addToLocale("6783ad5260cc8e9597065ec5", "Regen Debuff", "Regen", "If you are seeing this outside of the handbook, something has gone wrong.");

        //Clotting Debuffs
        this.cloneMedicalItem(
            "5c10c8fd86f7743d7d706df3",
            "6783ad5fce6705d14a117b15",
            0,
            2,
            0,
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_loot.bundle",
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_container.bundle",
            "blue",
            {},
            {}
        );
        this.addToHandbook("6783ad5fce6705d14a117b15", "5b47574386f77428ca22b33a", 1);
        this.addToLocale("6783ad5fce6705d14a117b15", "Clotting Debuff", "Clotting", "If you are seeing this outside of the handbook, something has gone wrong.");

        //Weight Debuffs
        this.cloneMedicalItem(
            "5c10c8fd86f7743d7d706df3",
            "6783ad886700d7d90daf548d",
            0,
            2,
            0,
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_loot.bundle",
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_container.bundle",
            "blue",
            {},
            {}
        );
        this.addToHandbook("6783ad886700d7d90daf548d", "5b47574386f77428ca22b33a", 1);
        this.addToLocale("6783ad886700d7d90daf548d", "Weight Debuff", "Weight", "If you are seeing this outside of the handbook, something has gone wrong.");

        //Performance Debuffs
        this.cloneMedicalItem(
            "5c10c8fd86f7743d7d706df3",
            "6783ad9f56a70af01706bf5f",
            0,
            2,
            0,
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_loot.bundle",
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_container.bundle",
            "blue",
            {},
            {}
        );
        this.addToHandbook("6783ad9f56a70af01706bf5f", "5b47574386f77428ca22b33a", 1);
        this.addToLocale("6783ad9f56a70af01706bf5f", "Performance Debuff", "Performance", "If you are seeing this outside of the handbook, something has gone wrong.");

        //Generic Debuffs
        this.cloneMedicalItem(
            "5c10c8fd86f7743d7d706df3",
            "6783adb2a43ec97b902c4080",
            0,
            2,
            0,
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_loot.bundle",
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_container.bundle",
            "blue",
            {},
            {}
        );
        this.addToHandbook("6783adb2a43ec97b902c4080", "5b47574386f77428ca22b33a", 1);
        this.addToLocale("6783adb2a43ec97b902c4080", "Generic Debuff", "Generic", "If you are seeing this outside of the handbook, something has gone wrong.");

        //Damage Debuffs
        this.cloneMedicalItem(
            "5c10c8fd86f7743d7d706df3",
            "6783adc3899d65035b52e21b",
            0,
            2,
            0,
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_loot.bundle",
            "assets/content/weapons/usable_items/item_syringe/item_stimulator_adrenaline_container.bundle",
            "blue",
            {},
            {}
        );
        this.addToHandbook("6783adc3899d65035b52e21b", "5b47574386f77428ca22b33a", 1);
        this.addToLocale("6783adc3899d65035b52e21b", "Damage Debuff", "Damage", "If you are seeing this outside of the handbook, something has gone wrong.");
    }

    public createCustomWeapons() {
        //Mechanic custom SKS
        this.cloneGenericItem("574d967124597745970e7c94", "6783ade075bc42ef5d2bfcf9", "violet");
        this.addToHandbook("6783ade075bc42ef5d2bfcf9", "5b5f78e986f77447ed5636b1", 12500);
        this.addToLocale("6783ade075bc42ef5d2bfcf9", "机械师定制SKS", "机械师的SKS", "机械师对这支SKS步枪进行了定制改装：扳机组件经过抛光，弹簧也进行了轻量化处理，使扳机扣动更轻更顺畅。导气系统也进行了改装，以降低射击时的后坐力，但代价是牺牲了可靠性。减重设计也减轻了步枪的重量，并改善了平衡性。");
        this.addToMastering("6783ade075bc42ef5d2bfcf9", "SKS");
        this.addCustomWeapsToQuests("574d967124597745970e7c94", "6783ade075bc42ef5d2bfcf9");

        //Mechanic custom OP-SKS
        this.cloneGenericItem("587e02ff24597743df3deaeb", "6783adfafb90a12e7033616a", "violet");
        this.addToHandbook("6783adfafb90a12e7033616a", "5b5f78e986f77447ed5636b1", 15000);
        this.addToLocale("6783adfafb90a12e7033616a", "机械师定制 OP-SKS", "机械师的OP-SKS", "机械师对这支OP-SKS步枪进行了定制改装：扳机组件经过抛光，弹簧也进行了轻量化处理，使扳机扣动更轻更顺畅。导气系统也进行了改装，以降低射击时的后坐力，但代价是牺牲了可靠性。减重设计降低了步枪的重量，并改善了平衡性。此外，这支SKS步枪的精度也得到了最大程度的提升。");
        this.addToMastering("6783adfafb90a12e7033616a", "SKS");
        this.addCustomWeapsToQuests("587e02ff24597743df3deaeb", "6783adfafb90a12e7033616a");

        //Mechanic custom STM
        this.cloneGenericItem("60339954d62c9b14ed777c06", "6783ae0d0410dd9ffe6f732c", "violet");
        this.addToHandbook("6783ae0d0410dd9ffe6f732c", "5b5f796a86f774093f2ed3c0", 15000);
        this.addToLocale("6783ae0d0410dd9ffe6f732c", "机械师定制 STM-9", "机械师的STM-9", "机械师对这支STM-9进行了改装：安装了一个可以让STM全自动射击的装置。然而，由于改装方式较为简陋，现在它只能全自动射击，可靠性有所下降。");
        this.addToMastering("6783ae0d0410dd9ffe6f732c", "M4");
        this.addCustomWeapsToQuests("60339954d62c9b14ed777c06", "6783ae0d0410dd9ffe6f732c");

        //Mechanic custom Saiga12k
        this.cloneGenericItem("576165642459773c7a400233", "6783ae2805a0c56e8da43e4d", "violet");
        this.addToHandbook("6783ae2805a0c56e8da43e4d", "5b5f794b86f77409407a7f92", 15000);
        this.addToLocale("6783ae2805a0c56e8da43e4d", "机械师定制的 Saiga 12k", "机械师的Saiga12", "机械师对这支Saiga 12k步枪进行了定制改装：导轨经过抛光处理，使枪机循环更加顺畅，从而降低了后坐力并提高了可靠性。进弹坡也经过抛光处理，进一步提升了可靠性。导气系统和复进簧也进行了改装，进一步降低了后坐力。");
        this.addToMastering("6783ae2805a0c56e8da43e4d", "AKM");
        this.addCustomWeapsToQuests("576165642459773c7a400233", "6783ae2805a0c56e8da43e4d");

        //Mechanic custom Benelli M3
        this.cloneGenericItem("6259b864ebedf17603599e88", "6783ae5bb52da6ed912e3d01", "violet");
        this.addToHandbook("6783ae5bb52da6ed912e3d01", "5b5f794b86f77409407a7f92", 20000);
        this.addToLocale("6783ae5bb52da6ed912e3d01", "机械师定制的贝内利 M3", "机械师的M3", "技师对这支贝内利M3霰弹枪进行了定制改装：装弹口经过改造，使装弹更加便捷快速；枪机和扳机经过抛光处理，使循环更加顺畅，射速更快，同时也加快了弹膛操作；复进簧也进行了轻量化处理，进一步提升了射速；导气系统也进行了改装，以降低后坐力和耐用性，但代价是牺牲了可靠性。");
        this.addToMastering("6783ae5bb52da6ed912e3d01", "MP153");
        this.addCustomWeapsToQuests("6259b864ebedf17603599e88", "6783ae5bb52da6ed912e3d01");

        //Skier .366 Vepr
        this.cloneGenericItem("59e6687d86f77411d949b251", "6783ae6a4973f4b13b9418a7", "orange");
        this.addToHandbook("6783ae6a4973f4b13b9418a7", "5b5f78e986f77447ed5636b1", 10000);
        this.addToLocale("6783ae6a4973f4b13b9418a7", "滑雪者的定制版 VPO-209", "滑雪者的VPO-209", "滑雪者粗略地改装了这把VPO-209，使其能够全自动射击。由于这种改装十分简陋，该步枪现在只能全自动射击，且可靠性有所降低。");
        this.addToMastering("6783ae6a4973f4b13b9418a7", "AKM");
        this.addCustomWeapsToQuests("59e6687d86f77411d949b251", "6783ae6a4973f4b13b9418a7");

        //add shotguns to inventory slot filters because BSG:
        let defaultInventory = this.itemDB()["55d7217a4bdc2d86028b456d"]._props;
        defaultInventory.Slots[0]._props.filters[0].Filter.push("5447b6094bdc2dc3278b4567");
        defaultInventory.Slots[1]._props.filters[0].Filter.push("5447b6094bdc2dc3278b4567");
    }

    public createCustomPlates() {
        //XSAPI Chest Plate
        this.cloneGenericItem("64afdcb83efdfea28601d041", "6783ae9ee00fdb2053bf6848", "blue");
        this.addToHandbook("6783ae9ee00fdb2053bf6848", "5b5f704686f77447ec5d76d7", 95000);
        this.addToLocale("6783ae9ee00fdb2053bf6848", "XSAPI防弹插板", "XSAPI", "XSAPI插板（即“超小型武器防护插板”）的设计旨在提供超越SAPI和ESAPI级别的防护能力。");
        this.pushItemToSlots("64afdcb83efdfea28601d041", "6783ae9ee00fdb2053bf6848");

        //Osprey MK4 plates
        this.cloneGenericItem("64afdcb83efdfea28601d041", "6783aec223d48324c0b278f5", "blue");
        this.addToHandbook("6783aec223d48324c0b278f5", "5b5f704686f77447ec5d76d7", 70000);
        this.addToLocale("6783aec223d48324c0b278f5", "鹗式 MK4 防弹插板", "鹗式 MK4 防弹插板", "专为与英军配发的“鹗式”（Osprey）系列防弹衣配套使用的插板。");
        this.pushItemToSlots("64afdcb83efdfea28601d041", "6783aec223d48324c0b278f5");
    }

    public createCustomAttachments() {

        //Mechanic SKS .366 TKM Barrel
        this.cloneGenericItem("634f02331f9f536910079b51", "6783aeeb56a0b663fc25f97d", "violet");
        this.addToHandbook("6783aeeb56a0b663fc25f97d", "5b5f75c686f774094242f19f", 15000);
        this.addToLocale("6783aeeb56a0b663fc25f97d", "SKS .366 TKM 型 520 毫米枪管", "SKS .366 520mm", "一支适用于 .366 TKM 口径 SKS 步枪的 520 毫米枪管。");
        this.pushItemToSlots("634f02331f9f536910079b51", "6783aeeb56a0b663fc25f97d");

        //Mechanic VPO-215 23inch 7.62x39 Barrel
        this.cloneGenericItem("5de65547883dde217541644b", "6783af0b3999424f691f5432", "violet");
        this.addToHandbook("6783af0b3999424f691f5432", "5b5f75c686f774094242f19f", 15000);
        this.addToLocale("6783af0b3999424f691f5432", "VPO-215“白鼬”7.62×39 毫米口径，23 英寸枪管", "215 7.62x39 23\"", "A 23 inch (600mm) barrel for VPO-215 rifle chambered in 7.62x39mm.");
        this.pushItemToSlots("5de65547883dde217541644b", "6783af0b3999424f691f5432");

        //Mechanic RatWorx AUG .300 BLk Adapter
        this.cloneGenericItem("630f27f04f3f6281050b94d7", "6783af1a6a4c63d3f0b0c2e0", "violet");
        this.addToHandbook("6783af1a6a4c63d3f0b0c2e0", "5b5f724c86f774093f2ecf15", 15000);
        this.addToLocale("6783af1a6a4c63d3f0b0c2e0", "斯太尔 AUG RAT Worx .300 BLK 枪口装置适配器", "RatWorx .300BLK", "RAT Worx 适配器可让 .300 BLK 口径的 AUG 步枪安装各种 AR-10 枪口装置。由 Research And Testing Worx 公司制造。");

        //Mechanic AUG 406mm 300blk Barrel
        this.cloneGenericItem("5c48a2852e221602b21d5923", "6783af21bc7d60d8f050eddb", "violet");
        this.addToHandbook("6783af21bc7d60d8f050eddb", "5b5f75c686f774094242f19f", 15000);
        this.addToLocale("6783af21bc7d60d8f050eddb", "MDR .300 BLK 型 16 英寸枪管", "MDR 300BLK 16\"", "适用于 MDR 系列武器的 16 英寸（406 毫米）枪管，专为 .300 BLK 弹药设计。");
        this.pushItemToSlots("5c48a2852e221602b21d5923", "6783af21bc7d60d8f050eddb");

        //Mechanic MDR 406mm 300blk Barrel
        this.cloneGenericItem("630e39c3bd357927e4007c15", "6783af2816da8f04134317a5", "violet");
        this.addToHandbook("6783af2816da8f04134317a5", "5b5f75c686f774094242f19f", 15000);
        this.addToLocale("6783af2816da8f04134317a5", "斯太尔 AUG A3 .300 BLK 型 16 英寸枪管", "A3 300BLK 16\"", "一支专为 .300 BLK 弹药设计的斯太尔 AUG A3 枪管，长度为 16 英寸（417 毫米）。");
        this.pushItemToSlots("630e39c3bd357927e4007c15", "6783af2816da8f04134317a5");

        //Mechanic MCX 171mm 5.56 Barrel
        this.cloneGenericItem("5fbbfabed5cb881a7363194e", "6783af2e6b6b13935074bbb5", "violet");
        this.addToHandbook("6783af2e6b6b13935074bbb5", "5b5f75c686f774094242f19f", 15000);
        this.addToLocale("6783af2e6b6b13935074bbb5", "MCX 5.56×45 毫米 171 毫米枪管", "MCX 171mm 5.56", "一支适用于 MCX 系列武器、膛室为 5.56×45 毫米的 171 毫米枪管。");
        this.pushItemToSlots("5fbbfabed5cb881a7363194e", "6783af2e6b6b13935074bbb5");

        //Mechanic MCX 229mm 5.56 Barrel
        this.cloneGenericItem("5fbbfacda56d053a3543f799", "6783af363a06237d1afd123d", "violet");
        this.addToHandbook("6783af363a06237d1afd123d", "5b5f75c686f774094242f19f", 15000);
        this.addToLocale("6783af363a06237d1afd123d", "MCX 5.56×45 毫米 229 毫米枪管", "MCX 229mm 5.56", "一支适用于 MCX 系列武器、膛室为 5.56×45 毫米的 229 毫米枪管。");
        this.pushItemToSlots("5fbbfacda56d053a3543f799", "6783af363a06237d1afd123d");

        //Mechanic SPEAR 330mm .308 Barrel
        this.cloneGenericItem("652910565ae2ae97b80fdf35", "6783af3c10208e7f0c64a02c", "violet");
        this.addToHandbook("6783af3c10208e7f0c64a02c", "5b5f75c686f774094242f19f", 15000);
        this.addToLocale("6783af3c10208e7f0c64a02c", "MCX SPEAR 7.62×51 毫米 330 毫米枪管", "SPEAR 330mm .308", "一支13英寸（330毫米）枪管，适用于发射7.62×51毫米（.308 Winchester）弹药的MCX SPEAR突击步枪。由西格绍尔（SIG Sauer）公司制造。");
        this.pushItemToSlots("652910565ae2ae97b80fdf35", "6783af3c10208e7f0c64a02c");

        //Mechanic custom ar15 260mm barrel
        this.cloneGenericItem("55d35ee94bdc2d61338b4568", "6783af433f159a5ae961078a", "violet");
        this.addToHandbook("6783af433f159a5ae961078a", "5b5f75c686f774094242f19f", 10000);
        this.addToLocale("6783af433f159a5ae961078a", "机械师定制版 260 毫米 AR-15 枪管", "Mech AR 260mm", "机械师在冲突爆发前从海外进口了一批枪管坯料，如今已开始投入使用。这支 260 毫米枪管的枪口冠部经过精密加工，提升了射击精度。更重要的是，其导气孔并未像大多数短型 AR-15 枪管那样被扩大，从而降低了后坐力和枪管烧蚀，但代价是因燃气作用时间（dwell time）过短而导致可靠性下降。为充分发挥此枪管的性能，建议搭配能提升可靠性的附件使用。");
        this.pushItemToSlots("55d35ee94bdc2d61338b4568", "6783af433f159a5ae961078a");

        //366 AKM Muzzle Break Compensator
        this.cloneGenericItem("59e61eb386f77440d64f5daf", "6783af4a205ba84b88b7372b", "violet");
        this.addToHandbook("6783af4a205ba84b88b7372b", "5b5f724c86f774093f2ecf15", 3000);
        this.addToLocale("6783af4a205ba84b88b7372b", "机械师定制版 .366 AKM 式枪口制退器", ".366 TKM Brake", "机械师将此制退器扩孔，以适配 .366 TKM 口径。");
        this.pushItemToSlots("5a9fbb74a2750c0032157181", "6783af4a205ba84b88b7372b");

        //366 Spikes Tactical Comp
        this.cloneGenericItem("5a9ea27ca2750c00137fa672", "6783af53a4a479af0614186c", "violet");
        this.addToHandbook("6783af53a4a479af0614186c", "5b5f724c86f774093f2ecf15", 8000);
        this.addToLocale("6783af53a4a479af0614186c", "机械师定制版 .366 TKM Spikes Tactical Dynacomp", ".366 TKM Dynacomp", "机械师将此补偿器扩孔，以适配 .366 TKM 口径。");
        this.pushItemToSlots("5a9fbb74a2750c0032157181", "6783af53a4a479af0614186c");

        //366 Zenit DTK Comp
        this.cloneGenericItem("5649ab884bdc2ded0b8b457f", "6783af5a827b39b7e3604b22", "violet");
        this.addToHandbook("6783af5a827b39b7e3604b22", "5b5f724c86f774093f2ecf15", 10000);
        this.addToLocale("6783af5a827b39b7e3604b22", "机械师定制版 .366 TKM Zenit DTK-1", ".366 TKM DTK-1", "Mechanic bored out this compensator to accomodate .366 TKM.");
        this.pushItemToSlots("5a9fbb74a2750c0032157181", "6783af5a827b39b7e3604b22");

        //366 JMAC Comp
        this.cloneGenericItem("5f633f68f5750b524b45f112", "6783af60ff68ec5c54f53ed6", "violet");
        this.addToHandbook("6783af60ff68ec5c54f53ed6", "5b5f724c86f774093f2ecf15", 20000);
        this.addToLocale("6783af60ff68ec5c54f53ed6", "机械师定制版 .366 TKM JMac RRD-4C", ".366 TKM RRD-4C", "机械师将此补偿器扩孔，以适配 .366 TKM 口径。");
        this.pushItemToSlots("5a9fbb74a2750c0032157181", "6783af60ff68ec5c54f53ed6");
    }

    public createCustomHazardItems() {

        const terraGroupDislaimer = "\n\n法律免责声明: \n\n本产品为泰拉集团（Terragroup Corporation）的财产。未经授权持有、改装或篡改本装置均属严格禁止行为，且违反泰拉集团的许可协议。违规者将对其行为承担法律责任。敬请注意，本装置由泰拉集团远程监控并追踪，以确保符合所有相关法律法规。\""
        const dataNotification = "该装置已被部署并存有大量数据。部分商人可能会认为其中所含的数据具有价值。\n\n";

        //Radiological Assessment and Monitoring Unit
        const ramuId = "66fd521442055447e2304fda";
        const remuDescript = "\"放射性评估与监测单元（RAMU）是由泰拉集团（TerraGroup Corporation）开发的一种放射性检测设备，集成了多种技术，用于测量并记录辐射水平、辐射类型，并识别同位素。" + terraGroupDislaimer;
        this.cloneGenericItem("5c05308086f7746b2101e90b", ramuId, "orange", "assets/content/items/barter/item_barter_electr_controller/quest_gals_d3.bundle");
        this.addToHandbook(ramuId, "5b47574386f77428ca22b2ef", 10000);
        this.addToLocale(ramuId, "放射性评估与监测单元", "RAMU", remuDescript);
        const ramu = this.itemDB()[ramuId];
        ramu._props.Height = 2;
        ramu._props.Width = 2;
        ramu._props.Weight = 3.1;
        ramu._props.CanSellOnRagfair = false;

        const ramuDataId = "670120ce354987453daf3d0c";
        this.cloneGenericItem(ramuId, ramuDataId, "orange", "assets/content/items/barter/item_barter_electr_controller/quest_gals_d3.bundle");
        this.addToHandbook(ramuDataId, "5b47574386f77428ca22b2ef", 350000);
        this.addToLocale(ramuDataId, "放射性评估与监测单元（含数据）", "RAMU (Data)", dataNotification + remuDescript);
        const ramuData = this.itemDB()[ramuDataId];

        //Gas Assessment and Monitoring Unit
        const gamuId = "66fd571a05370c3ee1a1c613";
        const gamuDescript = "\"气体评估与监测单元（GAMU）是由泰拉集团（TerraGroup Corporation）开发的一种设备，集成了多种技术，用于测量并记录有害的挥发性有机和无机化合物。" + terraGroupDislaimer;
        this.cloneGenericItem("5c05308086f7746b2101e90b", gamuId, "green", "assets/content/items/barter/item_barter_electr_controller/item_barter_electr_controller.bundle");
        this.addToHandbook(gamuId, "5b47574386f77428ca22b2ef", 10000);
        this.addToLocale(gamuId, "气体评估与监测单元", "GAMU", gamuDescript);
        const gamu = this.itemDB()[gamuId];
        gamu._props.Height = 2;
        gamu._props.Width = 2;
        gamu._props.Weight = 2.1;
        gamu._props.CanSellOnRagfair = false;

        const gamuDataId = "670120df4f0c4c37e6be90ae";
        this.cloneGenericItem(gamuId, gamuDataId, "green", "assets/content/items/barter/item_barter_electr_controller/item_barter_electr_controller.bundle");
        this.addToHandbook(gamuDataId, "5b47574386f77428ca22b2ef", 220000);
        this.addToLocale(gamuDataId, "气体评估与监测单元（含数据）", "GAMU (Data)", dataNotification + gamuDescript);
        const gamuData = this.itemDB()[gamuDataId];

        //Radiological Sample
        const radSampleId = "66fd57171f981640e667fbe2";
        this.cloneGenericItem("5c05308086f7746b2101e90b", radSampleId, "orange", "assets/content/items/quest/item_quest_chemcontainer/item_quest_chemcontainer.bundle");
        this.addToHandbook(radSampleId, "5b47574386f77428ca22b2ef", 300000);
        this.addToLocale(radSampleId, "放射性物质样本", "辐射样本", "一份用途不明的放射性物质样本，天知道被用来做什么。对于道德底线薄弱或一心求死的人来说，它极其珍贵。");
        const radSample = this.itemDB()[radSampleId];
        radSample._props.Height = 2;
        radSample._props.Width = 1;
        radSample._props.Weight = 4.32;
        radSample._props.CanSellOnRagfair = false;

        //Gas Sample
        const gasSampleId = "66fd588956f73c4f38dd07ae";
        this.cloneGenericItem("5c05308086f7746b2101e90b", gasSampleId, "green", "assets/content/items/quest/item_quest_chemcontainer/item_quest_chemcontainer.bundle"); //replace with chemical sample quest item when spt v3.10 releases
        this.addToHandbook(gasSampleId, "5b47574386f77428ca22b2ef", 150000);
        this.addToLocale(gasSampleId, "有毒物质样本", "有毒物质样本", "一份未知危险物质的样本。从容器内可以看出，该物质黏稠度极高，但一旦受到扰动便会变得极易挥发。你在接触它之后感到剧烈偏头痛，并且喉咙开始发紧……容器似乎并非完全气密。");
        const gasSample = this.itemDB()[gasSampleId];
        gasSample._props.Height = 2;
        gasSample._props.Width = 1;
        gasSample._props.Weight = 1.27;
        gasSample._props.CanSellOnRagfair = false;

        //Safe Container
        const containerId = "66fd588d397ed74159826cf0";
        this.cloneGenericItem("59fb042886f7746c5005a7b2", containerId, "violet", "assets/content/items/quest/item_quest_container_carbon_case/item_quest_container_carbon_case.bundle");
        this.addToHandbook(containerId, "5b5f6fa186f77409407a7eb7", 25000);
        this.addToLocale(containerId, "危险物质安全容器", "危险物质容器", "\"屏蔽加固环境（SAFE）容器能够安全、可靠地储存包括放射性、生物性和化学性危害在内的各类危险物质。" + terraGroupDislaimer);
        const container = this.itemDB()[containerId];
        container._props.Height = 2;
        container._props.Width = 2;
        container._props.CanSellOnRagfair = false;
        container._props.Weight = 6.2;

        //一些模组移除了克隆容器的过滤器，以确保兼容性。
        container._props.Grids = [
            {
                "_id": "67b85ebd5cd57c2f33728a76",
                "_name": "main",
                "_parent": "66fd588d397ed74159826cf0",
                "_props": {
                    "cellsH": 5,
                    "cellsV": 2,
                    "filters": [
                        {
                            "ExcludedFilter": [],
                            "Filter": [
                                radSampleId,
                                gasSampleId
                            ]
                        }
                    ],
                    "isSortingTable": false,
                    "maxCount": 0,
                    "maxWeight": 0,
                    "minCount": 0
                },
                "_proto": "55d329c24bdc2d892f8b4567"
            }
        ];

        //Makeshift Transmitter
        const transmitterId = "6703082a766cb6d11310094e";
        this.cloneGenericItem("63a0b2eabea67a6d93009e52", transmitterId, "green", "assets/content/items/quest/item_quest_radio_repeater/item_quest_radio_repeater.bundle");
        this.addToHandbook(transmitterId, "5b47574386f77428ca22b2ef", 15000);
        this.addToLocale(transmitterId, "简易发射器", "发射器", "一台简易发射器，若连接到足够强大的卫星天线，便可与外界取得联系。");
        const transmitter = this.itemDB()[transmitterId];
        transmitter._props.CanSellOnRagfair = false;

        StaticArrays.secureContainers.forEach(s => {
            if (!this.itemDB()[s]._props.Grids[0]._props.filters[0]) return; //if SVM or another mod changed secure container filters
            this.itemDB()[s]._props.Grids[0]._props.filters[0].Filter.push(containerId);
            this.itemDB()[s]._props.Grids[0]._props.filters[0].ExcludedFilter.push(ramuId, gamuId, ramuDataId, gamuDataId);
        });

        const skierId = "58330581ace78e27b8b10cee";
        const theraId = "54cb57776803fa99248b456e";
        const fenceId = "579dc571d53a0658a154fbec";

        const traders = this.tables.traders;
        StaticArrays.traders.forEach(t => {
            if (t === skierId || t === theraId) return;
            traders[t].base.items_buy_prohibited.id_list.push("66fd588956f73c4f38dd07ae", "66fd57171f981640e667fbe2", "670120df4f0c4c37e6be90ae", "670120ce354987453daf3d0c", "6703082a766cb6d11310094e");
        });

        traders[skierId].base.items_buy.id_list.push("66fd588956f73c4f38dd07ae", "66fd57171f981640e667fbe2");
        traders[theraId].base.items_buy.id_list.push("66fd588956f73c4f38dd07ae", "66fd57171f981640e667fbe2", "670120df4f0c4c37e6be90ae", "670120ce354987453daf3d0c");
        traders[fenceId].base.items_buy.id_list.push("66fd588956f73c4f38dd07ae", "66fd57171f981640e667fbe2", "670120df4f0c4c37e6be90ae", "670120ce354987453daf3d0c");
    }

    private addCustomWeapsToQuests(originalWeapon: string, weapToAdd: string) {
        for (let q in this.questDB()) {
            let quest = this.questDB()[q];

            if (!quest?.conditions?.AvailableForFinish) continue;

            let availForFin = quest.conditions.AvailableForFinish;
            for (let r in availForFin) {
                let requirement = availForFin[r];

                if (requirement.conditionType !== "CounterCreator" || !requirement.counter?.conditions) continue;

                for (let c in requirement.counter.conditions) {
                    let subCondition = requirement.counter.conditions[c];
                    if (subCondition.conditionType == "Kills" && subCondition.weapon && subCondition.weapon.includes(originalWeapon)) {
                        subCondition.weapon.push(weapToAdd);
                    }
                }
            }
        }
    }

    private addToMastering(id: string, masteringCat: string) {
        let mastering = this.tables.globals.config.Mastering;
        for (let cat in mastering) {
            if (mastering[cat].Name === masteringCat) {
                mastering[cat].Templates.push(id);
            }
        }
    }

    private pushItemToSlots(orignalId: string, newID: string) {
        for (let item in this.itemDB()) {
            for (let slot in this.itemDB()[item]._props.Slots) {
                if (this.itemDB()[item]._props.Slots[slot]._props?.filters != null && this.itemDB()[item]._props.Slots[slot]._props.filters[0].Filter.includes(orignalId)) {
                    this.itemDB()[item]._props.Slots[slot]._props.filters[0].Filter.push(newID);
                }
            }
            if (this.itemDB()[item]._props?.ConflictingItems != null && this.itemDB()[item]._props.ConflictingItems.includes(orignalId)) {
                this.itemDB()[item]._props.ConflictingItems.push(newID);
            }
        }
    }

    private cloneGenericItem(itemToClone: string, newItemID: string, color: string = "default", prefabPath: string = "") {
        this.cloneItem(itemToClone, newItemID);
        let itemID = this.itemDB()[newItemID];
        itemID._props.BackgroundColor = color;
        if (prefabPath != "") itemID._props.Prefab.path = prefabPath;
        if (this.modConfig.logEverything == true) {
            this.logger.info("Item " + itemID._id + " Added");
        }
    }

    private cloneMedicalItem(itemToClone: string, newItemID: string, maxHpResource: number, medUseTime: number, hpResourceRate: number, prefabePath: string, usePrefabPath: string, color: string, effectsDamage: any, effectsHealth: any) {
        this.cloneItem(itemToClone, newItemID);
        let itemID = this.itemDB()[newItemID];
        itemID._props.MaxHpResource = maxHpResource;
        itemID._props.medUseTime = medUseTime;
        itemID._props.hpResourceRate = hpResourceRate;
        itemID._props.Prefab.path = prefabePath;
        itemID._props.UsePrefab.path = usePrefabPath;
        itemID._props.BackgroundColor = color;
        itemID._props.effects_damage = effectsDamage;
        itemID._props.effects_health = effectsHealth;
        itemID._props.CanSellOnRagfair = false;
        if (this.modConfig.logEverything == true) {
            this.logger.info("Item " + itemID._id + " Added");
        }
    }

    private addToHandbook(id: string, parentID: string, price: number) {

        this.tables.templates.handbook.Items.push(
            {
                "Id": id,
                "ParentId": parentID,
                "Price": price
            }
        );
    }

    public addToLocale(id: string, name: string, shortname: string, description: string) {

        const nameId = `${id}` + " Name";
        const shortnameId = `${id}` + " ShortName";
        const descriptionId = `${id}` + " Description";
        const locales = this.tables.locales.global;

        for (let lang in locales) {
            locales[lang][nameId] = name;
            locales[lang][shortnameId] = shortname;
            locales[lang][descriptionId] = description;
        }
    }

    private cloneItem(itemtoClone: string, newitemID: string) {
        this.itemDB()[newitemID] = this.jsonUtil.clone(this.itemDB()[itemtoClone])
        this.itemDB()[newitemID]._id = newitemID;
        if (this.modConfig.logEverything == true) {
            this.logger.info(this.itemDB()[itemtoClone]._name + " cloned");
        }
    }
}