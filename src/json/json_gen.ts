import { ITemplateItem } from "@spt/models/eft/common/tables/ITemplateItem";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { Utils } from "../utils/utils";
import { ParentClasses } from "../utils/enums";
import { StaticArrays } from "../utils/arrays";

const modConfig = require("../../config/config.json");

const armorPlateTemplates = require("../../db/templates/gear/armorPlateTemplates.json");
const armorComponentsTemplates = require("../../db/templates/gear/armorComponentsTemplates.json");
const armorChestrigTemplates = require("../../db/templates/gear/armorChestrigTemplates.json");
const helmetTemplates = require("../../db/templates/gear/helmetTemplates.json");
const armorVestsTemplates = require("../../db/templates/gear/armorVestsTemplates.json");
const armorMasksTemplates = require("../../db/templates/gear/armorMasksTemplates.json");
const chestrigTemplates = require("../../db/templates/gear/chestrigTemplates.json");
const headsetTemplates = require("../../db/templates/gear/headsetTemplates.json");
const cosmeticsTemplates = require("../../db/templates/gear/cosmeticsTemplates.json");
const bagTemplates = require("../../db/templates/gear/bagTemplates.json");

const ammoTemplates = require("../../db/templates/ammo/ammoTemplates.json");

const MuzzleDeviceTemplates = require("../../db/templates/attatchments/MuzzleDeviceTemplates.json");
const BarrelTemplates = require("../../db/templates/attatchments/BarrelTemplates.json");
const MountTemplates = require("../../db/templates/attatchments/MountTemplates.json");
const ReceiverTemplates = require("../../db/templates/attatchments/ReceiverTemplates.json");
const StockTemplates = require("../../db/templates/attatchments/StockTemplates.json");
const ChargingHandleTemplates = require("../../db/templates/attatchments/ChargingHandleTemplates.json");
const ScopeTemplates = require("../../db/templates/attatchments/ScopeTemplates.json");
const IronSightTemplates = require("../../db/templates/attatchments/IronSightTemplates.json");
const MagazineTemplates = require("../../db/templates/attatchments/MagazineTemplates.json");
const AuxiliaryModTemplates = require("../../db/templates/attatchments/AuxiliaryModTemplates.json");
const ForegripTemplates = require("../../db/templates/attatchments/ForegripTemplates.json");
const PistolGripTemplates = require("../../db/templates/attatchments/PistolGripTemplates.json");
const GasblockTemplates = require("../../db/templates/attatchments/GasblockTemplates.json");
const HandguardTemplates = require("../../db/templates/attatchments/HandguardTemplates.json");
const FlashlightLaserTemplates = require("../../db/templates/attatchments/FlashlightLaserTemplates.json");

const AssaultRifleTemplates = require("../../db/templates/weapons/AssaultRifleTemplates.json");
const AssaultCarbineTemplates = require("../../db/templates/weapons/AssaultCarbineTemplates.json");
const MachinegunTemplates = require("../../db/templates/weapons/MachinegunTemplates.json");
const MarksmanRifleTemplates = require("../../db/templates/weapons/MarksmanRifleTemplates.json");
const PistolTemplates = require("../../db/templates/weapons/PistolTemplates.json");
const ShotgunTemplates = require("../../db/templates/weapons/ShotgunTemplates.json");
const SMGTemplates = require("../../db/templates/weapons/SMGTemplates.json");
const SniperRifleTemplates = require("../../db/templates/weapons/SniperRifleTemplates.json");
const SpecialWeaponTemplates = require("../../db/templates/weapons/SpecialWeaponTemplates.json");
const GrenadeLauncherTemplates = require("../../db/templates/weapons/GrenadeLauncherTemplates.json");

const allValidArmorSlots = [
    "front_plate",
    "back_plate",
    "left_side_plate",
    "right_side_plate",
    "soft_armor_front",
    "soft_armor_back",
    "soft_armor_left",
    "soft_armor_right",
    "collar",
    "shoulder_l",
    "shoulder_r",
    "groin",
    "groin_back",
    "helmet_top",
    "helmet_back",
    "helmet_ears",
    "helmet_eyes",
    "helmet_jaw"
];

export class JsonGen {

    constructor(private logger: ILogger, private tables: IDatabaseTables, private modConf, private utils: Utils) { }

    itemDB(): Record<string, ITemplateItem> {
        return this.tables.templates.items;
    }

    public ammoTemplatesCodeGen() {
        for (let i in this.itemDB()) {
            let serverItem = this.itemDB()[i];
            if (serverItem._parent === ParentClasses.AMMO || serverItem._parent === ParentClasses.AMMO_BOX) {
                ammoTemplates[i] = this.assignJSONToAmmo(serverItem, ammoTemplates[i]);
            }
        }
        this.utils.writeConfigJSON(ammoTemplates, "db/templates/ammo/ammoTemplates.json");
    }

    public gearTemplatesCodeGen() {
        for (let i in this.itemDB()) {
            let serverItem = this.itemDB()[i];
            if (serverItem?._props?.armorClass != null) {
                let armorLevl: number = typeof serverItem._props.armorClass === 'number' ? serverItem._props.armorClass : parseInt(serverItem._props.armorClass as string);
                if (serverItem._parent === ParentClasses.CHESTRIG && armorLevl > 0) {
                    armorChestrigTemplates[i] = this.assignJSONToGear(serverItem, armorChestrigTemplates[i]);
                }
                if ((serverItem._parent === ParentClasses.ARMOR_PLATE || serverItem._parent === ParentClasses.BUILT_IN_ARMOR) && armorLevl > 0) {
                    armorPlateTemplates[i] = this.assignJSONToGear(serverItem, armorPlateTemplates[i]);
                }
                if (serverItem._parent === ParentClasses.ARMOREDEQUIPMENT && armorLevl > 0) {
                    armorComponentsTemplates[i] = this.assignJSONToGear(serverItem, armorComponentsTemplates[i]);
                }
                if (serverItem._parent === ParentClasses.HEADWEAR && armorLevl > 0) {
                    helmetTemplates[i] = this.assignJSONToGear(serverItem, helmetTemplates[i]);
                }
                if (serverItem._parent === ParentClasses.ARMORVEST && armorLevl > 0) {
                    armorVestsTemplates[i] = this.assignJSONToGear(serverItem, armorVestsTemplates[i]);
                }
                if (serverItem._parent === ParentClasses.CHESTRIG && armorLevl === 0) {
                    chestrigTemplates[i] = this.assignJSONToGear(serverItem, chestrigTemplates[i]);
                }
                if (serverItem._parent === ParentClasses.HEADSET) {
                    headsetTemplates[i] = this.assignJSONToGear(serverItem, headsetTemplates[i]);
                }
                if ((serverItem._parent === ParentClasses.HEADWEAR || serverItem._parent === ParentClasses.FACECOVER) && armorLevl <= 1) {
                    cosmeticsTemplates[i] = this.assignJSONToGear(serverItem, cosmeticsTemplates[i]);
                }
                if ((serverItem._parent === ParentClasses.BACKPACK)) {
                    bagTemplates[i] = this.assignJSONToGear(serverItem, bagTemplates[i]);
                }
            }
        }
        this.utils.writeConfigJSON(armorPlateTemplates, "db/templates/gear/armorPlateTemplates.json");
        this.utils.writeConfigJSON(armorComponentsTemplates, "db/templates/gear/armorComponentsTemplates.json");
        this.utils.writeConfigJSON(armorChestrigTemplates, "db/templates/gear/armorChestrigTemplates.json");
        this.utils.writeConfigJSON(helmetTemplates, "db/templates/gear/helmetTemplates.json");
        this.utils.writeConfigJSON(armorVestsTemplates, "db/templates/gear/armorVestsTemplates.json");
        this.utils.writeConfigJSON(chestrigTemplates, "db/templates/gear/chestrigTemplates.json");
        this.utils.writeConfigJSON(headsetTemplates, "db/templates/gear/headsetTemplates.json");
        this.utils.writeConfigJSON(cosmeticsTemplates, "db/templates/gear/cosmeticsTemplates.json");
        this.utils.writeConfigJSON(bagTemplates, "db/templates/gear/bagTemplates.json");
    }

    public weapTemplatesCodeGen() {
        for (let i in this.itemDB()) {
            let serverItem = this.itemDB()[i];
            if (serverItem._props.RecolDispersion) {
                if (serverItem._props.weapClass === "assaultCarbine") {
                    AssaultCarbineTemplates[i] = this.assignJSONToWeap(serverItem, AssaultCarbineTemplates[i]);
                }
                if (serverItem._props.weapClass === "assaultRifle") {
                    AssaultRifleTemplates[i] = this.assignJSONToWeap(serverItem, AssaultRifleTemplates[i]);
                }
                if (serverItem._props.weapClass === "smg") {
                    SMGTemplates[i] = this.assignJSONToWeap(serverItem, SMGTemplates[i]);
                }
                if (serverItem._props.weapClass === "machinegun") {
                    MachinegunTemplates[i] = this.assignJSONToWeap(serverItem, MachinegunTemplates[i]);
                }
                if (serverItem._props.weapClass === "marksmanRifle") {
                    MarksmanRifleTemplates[i] = this.assignJSONToWeap(serverItem, MarksmanRifleTemplates[i]);
                }
                if (serverItem._props.weapClass === "sniperRifle") {
                    SniperRifleTemplates[i] = this.assignJSONToWeap(serverItem, SniperRifleTemplates[i]);
                }
                if (serverItem._props.weapClass === "pistol") {
                    PistolTemplates[i] = this.assignJSONToWeap(serverItem, PistolTemplates[i]);
                }
                if (serverItem._props.weapClass === "shotgun") {
                    ShotgunTemplates[i] = this.assignJSONToWeap(serverItem, ShotgunTemplates[i]);
                }
                if (serverItem._props.weapClass === "specialWeapon") {
                    SpecialWeaponTemplates[i] = this.assignJSONToWeap(serverItem, SpecialWeaponTemplates[i]);
                }
                if (serverItem._props.weapClass === "grenadeLauncher") {
                    GrenadeLauncherTemplates[i] = this.assignJSONToWeap(serverItem, GrenadeLauncherTemplates[i]);
                }
            }
        }
        this.utils.writeConfigJSON(AssaultRifleTemplates, "db/templates/weapons/AssaultRifleTemplates.json");
        this.utils.writeConfigJSON(AssaultCarbineTemplates, "db/templates/weapons/AssaultCarbineTemplates.json");
        this.utils.writeConfigJSON(MachinegunTemplates, "db/templates/weapons/MachinegunTemplates.json");
        this.utils.writeConfigJSON(MarksmanRifleTemplates, "db/templates/weapons/MarksmanRifleTemplates.json");
        this.utils.writeConfigJSON(PistolTemplates, "db/templates/weapons/PistolTemplates.json");
        this.utils.writeConfigJSON(ShotgunTemplates, "db/templates/weapons/ShotgunTemplates.json");
        this.utils.writeConfigJSON(SMGTemplates, "db/templates/weapons/SMGTemplates.json");
        this.utils.writeConfigJSON(SniperRifleTemplates, "db/templates/weapons/SniperRifleTemplates.json");
        this.utils.writeConfigJSON(SpecialWeaponTemplates, "db/templates/weapons/SpecialWeaponTemplates.json");
        this.utils.writeConfigJSON(GrenadeLauncherTemplates, "db/templates/weapons/GrenadeLauncherTemplates.json");
    }

    public attTemplatesCodeGen() {
        for (let i in this.itemDB()) {
            let serverItem = this.itemDB()[i];
            if (serverItem._props.ToolModdable == true || serverItem._props.ToolModdable == false) {
                for (let value in StaticArrays.modTypes) {
                    if (serverItem._parent === StaticArrays.modTypes[value]) {
                        if (StaticArrays.modTypes[value] === "550aa4bf4bdc2dd6348b456b" ||
                            StaticArrays.modTypes[value] === "550aa4dd4bdc2dc9348b4569" ||
                            StaticArrays.modTypes[value] === "550aa4cd4bdc2dd8348b456c"
                        ) {
                            MuzzleDeviceTemplates[i] = this.assignJSONToMod(serverItem, MuzzleDeviceTemplates[i], "muzzle");
                        }
                        if (StaticArrays.modTypes[value] === "555ef6e44bdc2de9068b457e") {
                            BarrelTemplates[i] = this.assignJSONToMod(serverItem, BarrelTemplates[i], "barrel");
                        }
                        if (StaticArrays.modTypes[value] === "55818b224bdc2dde698b456f") {
                            MountTemplates[i] = this.assignJSONToMod(serverItem, MountTemplates[i], "mount");
                        }
                        if (StaticArrays.modTypes[value] === "55818a304bdc2db5418b457d") {
                            ReceiverTemplates[i] = this.assignJSONToMod(serverItem, ReceiverTemplates[i], "receiver");
                        }
                        if (StaticArrays.modTypes[value] === "55818a594bdc2db9688b456a") {
                            StockTemplates[i] = this.assignJSONToMod(serverItem, StockTemplates[i], "stock");
                        }
                        if (StaticArrays.modTypes[value] === "55818a6f4bdc2db9688b456b") {
                            ChargingHandleTemplates[i] = this.assignJSONToMod(serverItem, ChargingHandleTemplates[i], "charging");
                        }
                        if (StaticArrays.modTypes[value] === "55818acf4bdc2dde698b456b" ||
                            StaticArrays.modTypes[value] === "55818ad54bdc2ddc698b4569" ||
                            StaticArrays.modTypes[value] === "55818add4bdc2d5b648b456f" ||
                            StaticArrays.modTypes[value] === "55818ae44bdc2dde698b456c" ||
                            StaticArrays.modTypes[value] === "55818aeb4bdc2ddc698b456a"
                        ) {
                            ScopeTemplates[i] = this.assignJSONToMod(serverItem, ScopeTemplates[i], "scope");
                        }
                        if (StaticArrays.modTypes[value] === "55818ac54bdc2d5b648b456e") {
                            IronSightTemplates[i] = this.assignJSONToMod(serverItem, IronSightTemplates[i], "irons");
                        }
                        if (StaticArrays.modTypes[value] === "5448bc234bdc2d3c308b4569" ||
                            StaticArrays.modTypes[value] === "610720f290b75a49ff2e5e25" ||
                            StaticArrays.modTypes[value] === "627a137bf21bc425b06ab944"
                        ) {
                            MagazineTemplates[i] = this.assignJSONToMod(serverItem, MagazineTemplates[i], "magazine");
                        }
                        if (StaticArrays.modTypes[value] === "5a74651486f7744e73386dd1" ||
                            StaticArrays.modTypes[value] === "55818afb4bdc2dde698b456d"
                        ) {
                            AuxiliaryModTemplates[i] = this.assignJSONToMod(serverItem, AuxiliaryModTemplates[i], "aux");
                        }
                        if (StaticArrays.modTypes[value] === "55818af64bdc2d5b648b4570") {
                            ForegripTemplates[i] = this.assignJSONToMod(serverItem, ForegripTemplates[i], "foregrip");
                        }
                        if (StaticArrays.modTypes[value] === "55818a684bdc2ddd698b456d") {
                            PistolGripTemplates[i] = this.assignJSONToMod(serverItem, PistolGripTemplates[i], "pistolgrip");
                        }
                        if (StaticArrays.modTypes[value] === "56ea9461d2720b67698b456f") {
                            GasblockTemplates[i] = this.assignJSONToMod(serverItem, GasblockTemplates[i], "gasblock");
                        }
                        if (StaticArrays.modTypes[value] === "55818a104bdc2db9688b4569") {
                            HandguardTemplates[i] = this.assignJSONToMod(serverItem, HandguardTemplates[i], "handguard");
                        }
                        if (StaticArrays.modTypes[value] === "55818b084bdc2d5b648b4571" ||
                            StaticArrays.modTypes[value] === "55818b164bdc2ddc698b456c"
                        ) {
                            FlashlightLaserTemplates[i] = this.assignJSONToMod(serverItem, FlashlightLaserTemplates[i], "flashlight");
                        }
                    }
                }
            }
        }
        this.utils.writeConfigJSON(MuzzleDeviceTemplates, "db/templates/attatchments/MuzzleDeviceTemplates.json");
        this.utils.writeConfigJSON(BarrelTemplates, "db/templates/attatchments/BarrelTemplates.json");
        this.utils.writeConfigJSON(MountTemplates, "db/templates/attatchments/MountTemplates.json");
        this.utils.writeConfigJSON(ReceiverTemplates, "db/templates/attatchments/ReceiverTemplates.json");
        this.utils.writeConfigJSON(StockTemplates, "db/templates/attatchments/StockTemplates.json");
        this.utils.writeConfigJSON(ChargingHandleTemplates, "db/templates/attatchments/ChargingHandleTemplates.json");
        this.utils.writeConfigJSON(ScopeTemplates, "db/templates/attatchments/ScopeTemplates.json");
        this.utils.writeConfigJSON(IronSightTemplates, "db/templates/attatchments/IronSightTemplates.json");
        this.utils.writeConfigJSON(MagazineTemplates, "db/templates/attatchments/MagazineTemplates.json");
        this.utils.writeConfigJSON(AuxiliaryModTemplates, "db/templates/attatchments/AuxiliaryModTemplates.json");
        this.utils.writeConfigJSON(ForegripTemplates, "db/templates/attatchments/ForegripTemplates.json");
        this.utils.writeConfigJSON(PistolGripTemplates, "db/templates/attatchments/PistolGripTemplates.json");
        this.utils.writeConfigJSON(GasblockTemplates, "db/templates/attatchments/GasblockTemplates.json");
        this.utils.writeConfigJSON(HandguardTemplates, "db/templates/attatchments/HandguardTemplates.json");
        this.utils.writeConfigJSON(FlashlightLaserTemplates, "db/templates/attatchments/FlashlightLaserTemplates.json");
    }

    private assignJSONToAmmo(serverItem: ITemplateItem, fileItem: any) {

        if (fileItem) {
            fileItem;
            return fileItem;
        }

        let ItemID = serverItem._id;
        let Name = serverItem._name;
        let LoyaltyLevel = 2;

        let item = {
            ItemID,
            Name,
            LoyaltyLevel
        };

        return item;
    }

    private assignJSONToGear(serverItem: ITemplateItem, fileItem: any) {

        if (fileItem) {
            fileItem;
            return fileItem;
        }

        let ItemID = serverItem._id;
        let Name = serverItem._name;
        let AllowADS = true;
        let LoyaltyLevel = 2;
        let ReloadSpeedMulti = 1;
        let Price = 0;
        let Comfort = 1;
        let ArmorClass = "";
        let CanSpall = false;
        let SpallReduction = 1;
        // let BlocksMouth = false;
        // let dB = 0;

        let item = {
            ItemID,
            Name,
            AllowADS,
            LoyaltyLevel,
            Price,
            ReloadSpeedMulti,
            Comfort

        };

        return item;
    }

    private assignJSONToWeap(serverItem: ITemplateItem, fileItem: any) {

        // new items properties can be added, and  property values can be replaced, by delcaring them in this if statement
        if (fileItem) {
            // fileItem.HeatFactor = serverItem._props.HeatFactor; You need to give it a value. If you set it to the server item's propety value, the new property will only appear if the server mod has that property
            fileItem;
            return fileItem;
        }

        let ItemID = serverItem._id;
        let Name = serverItem._name;
        let WeapType = "";
        let OperationType = "";
        let WeapAccuracy = 0;
        let BaseTorque = 0;
        let RecoilDamping = serverItem._props.RecoilDampingHandRotation;
        let RecoilHandDamping = serverItem._props.RecoilReturnPathDampingHandRotation;
        let OffsetRotation = serverItem._props.RecoilReturnPathOffsetHandRotation;
        let RecoilIntensity = serverItem._props.RecoilCategoryMultiplierHandRotation;
        let HasShoulderContact = false;
        let WeaponAllowADS = false;
        let Ergonomics = serverItem._props.Ergonomics
        let VerticalRecoil = serverItem._props.RecoilForceUp;
        let HorizontalRecoil = serverItem._props.RecoilForceBack;
        let Dispersion = serverItem._props.RecolDispersion;
        let CameraRecoil = serverItem._props.RecoilCamera;
        let VisualMulti = 1;
        let Convergence = serverItem._props.RecoilReturnSpeedHandRotation;
        let RecoilAngle = serverItem._props.RecoilAngle;
        let DurabilityBurnRatio = serverItem._props.DurabilityBurnRatio;
        let BaseMalfunctionChance = serverItem._props.BaseMalfunctionChance;
        let HeatFactorGun = serverItem._props.HeatFactorGun;
        let HeatFactorByShot = serverItem._props.HeatFactorByShot;
        let CoolFactorGun = serverItem._props.CoolFactorGun;
        let CoolFactorGunMods = serverItem._props.CoolFactorGunMods;
        let AllowOverheat = serverItem._props.AllowOverheat;
        let CenterOfImpact = serverItem._props.CenterOfImpact;
        let HipAccuracyRestorationDelay = serverItem._props.HipAccuracyRestorationDelay;
        let HipAccuracyRestorationSpeed = serverItem._props.HipAccuracyRestorationSpeed;
        let HipInnaccuracyGain = serverItem._props.HipInnaccuracyGain;
        let ShotgunDispersion = serverItem._props.ShotgunDispersion;
        let Velocity = serverItem._props.Velocity;
        let Weight = serverItem._props.Weight;
        let AutoROF = serverItem._props.bFirerate;
        let SemiROF = serverItem._props.SingleFireRate;
        let LoyaltyLevel = 2;
        let BaseReloadSpeedMulti = 1;
        let BaseChamberSpeedMulti = 1;
        let MaxChamberSpeed = 1.5;
        let MinChamberSpeed = 0.7;
        let IsManuallyOperated = false;
        let BaseChamberCheckSpeed = 1;
        let BaseFixSpeed = 1;

        let item = {
            ItemID,
            Name,
            WeapType,
            OperationType,
            WeapAccuracy,
            BaseTorque,
            RecoilDamping,
            RecoilHandDamping,
            OffsetRotation,
            RecoilIntensity,
            HasShoulderContact,
            WeaponAllowADS,
            Ergonomics,
            VerticalRecoil,
            HorizontalRecoil,
            Dispersion,
            CameraRecoil,
            VisualMulti,
            Convergence,
            RecoilAngle,
            DurabilityBurnRatio,
            BaseMalfunctionChance,
            HeatFactorGun,
            HeatFactorByShot,
            CoolFactorGun,
            CoolFactorGunMods,
            AllowOverheat,
            CenterOfImpact,
            HipAccuracyRestorationDelay,
            HipAccuracyRestorationSpeed,
            HipInnaccuracyGain,
            ShotgunDispersion,
            Velocity,
            Weight,
            AutoROF,
            SemiROF,
            LoyaltyLevel,
            BaseReloadSpeedMulti,
            BaseChamberSpeedMulti,
            MaxChamberSpeed,
            MinChamberSpeed,
            IsManuallyOperated,
            BaseChamberCheckSpeed,
            BaseFixSpeed
        };
        return item;

    }

    private assignJSONToMod(serverItem: ITemplateItem, fileItem: any, ID: string) {

        //new items properties can be added, and  property values can be replaced, by delcaring them in this if statement
        if (fileItem) {
            return fileItem;
        }

        let ItemID = serverItem._id;
        let Name = serverItem._name;
        let ModType = "";
        let VerticalRecoil = serverItem._props.Recoil;
        let HorizontalRecoil = serverItem._props.Recoil;
        let Dispersion = 0;
        let CameraRecoil = 0;
        let AutoROF = 0;
        let SemiROF = 0;
        let ModMalfunctionChance = 0;
        let ReloadSpeed = 0;
        let AimSpeed = 0;
        let Convergence = 0;
        let CanCycleSubs = false;
        let RecoilAngle = 0;
        let StockAllowADS = false;
        let FixSpeed = 0;
        let ChamberSpeed = 0;
        let ModShotDispersion = 0;
        let Ergonomics = serverItem._props.Ergonomics
        let Accuracy = serverItem._props.Accuracy
        let CenterOfImpact = serverItem._props.CenterOfImpact
        let HeatFactor = serverItem._props.HeatFactor
        let CoolFactor = serverItem._props.CoolFactor
        let MalfunctionChance = serverItem._props.MalfunctionChance
        let LoadUnloadModifier = serverItem._props.LoadUnloadModifier
        let CheckTimeModifier = serverItem._props.CheckTimeModifier
        let DurabilityBurnModificator = serverItem._props.DurabilityBurnModificator;
        let HasShoulderContact = serverItem._props.HasShoulderContact;
        let BlocksFolding = serverItem._props.BlocksFolding;
        let Velocity = serverItem._props.Velocity;
        let ConflictingItems = serverItem._props.ConflictingItems;
        let Weight = serverItem._props.Weight;
        let ShotgunDispersion = serverItem._props.ShotgunDispersion;
        let Loudness = serverItem._props.Loudness;
        let MalfChance = 0;
        let Price = 0;
        let LoyaltyLevel = 1;

        if (ID === "muzzle") {
            let item = {
                ItemID,
                Name,
                ModType,
                VerticalRecoil,
                HorizontalRecoil,
                Dispersion,
                CameraRecoil,
                AutoROF,
                SemiROF,
                ModMalfunctionChance,
                CanCycleSubs,
                Accuracy,
                HeatFactor,
                CoolFactor,
                DurabilityBurnModificator,
                Velocity,
                RecoilAngle,
                ConflictingItems,
                Ergonomics,
                Weight,
                ModShotDispersion,
                Loudness,
                MalfChance,
                Convergence,
                Price,
                LoyaltyLevel
            };
            return item;
        }

        if (ID === "barrel") {
            let item = {
                ItemID,
                Name,
                ModType,
                VerticalRecoil,
                HorizontalRecoil,
                AutoROF,
                SemiROF,
                ModMalfunctionChance,
                Convergence,
                Accuracy,
                CenterOfImpact,
                HeatFactor,
                CoolFactor,
                DurabilityBurnModificator,
                Velocity,
                ConflictingItems,
                Ergonomics,
                Weight,
                ShotgunDispersion,
                Loudness,
                MalfChance
            };
            return item;
        }
        if (ID === "mount") {
            let item = {
                ItemID,
                Name,
                ModType,
                Ergonomics,
                Accuracy,
                ConflictingItems,
                Weight
            };
            return item;
        }
        if (ID === "receiver") {
            let item = {
                ItemID,
                Name,
                ModType,
                ModMalfunctionChance,
                Accuracy,
                HeatFactor,
                CoolFactor,
                DurabilityBurnModificator,
                ConflictingItems,
                Ergonomics,
                Weight,
                MalfChance
            };
            return item;
        }
        if (ID === "charging") {
            let item = {
                ItemID,
                Name,
                ModType,
                ReloadSpeed,
                ConflictingItems,
                FixSpeed,
                Ergonomics,
                Weight,
                ChamberSpeed
            };
            return item;
        }
        if (ID === "scope" || ID === "irons") {
            let item = {
                ItemID,
                Name,
                ModType,
                AimSpeed,
                Accuracy,
                ConflictingItems,
                Ergonomics,
                Weight
            };
            return item;
        }
        if (ID === "magazine") {
            let item = {
                ItemID,
                Name,
                ModType,
                ReloadSpeed,
                Ergonomics,
                MalfunctionChance,
                LoadUnloadModifier,
                CheckTimeModifier,
                ConflictingItems,
                Weight
            };
            return item;
        }
        if (ID === "aux") {
            let item = {
                ItemID,
                Name,
                ModType,
                VerticalRecoil,
                HorizontalRecoil,
                AutoROF,
                SemiROF,
                ModMalfunctionChance,
                AimSpeed,
                ReloadSpeed,
                Ergonomics,
                Accuracy,
                ConflictingItems,
                FixSpeed,
                HeatFactor,
                CoolFactor,
                DurabilityBurnModificator,
                Weight,
                MalfChance

            };
            return item;
        }
        if (ID === "foregrip" || ID === "pistolgrip") {
            let item = {
                ItemID,
                Name,
                ModType,
                VerticalRecoil,
                HorizontalRecoil,
                Dispersion,
                AimSpeed,
                Ergonomics,
                Accuracy,
                ConflictingItems,
                Weight
            };
            return item;
        }
        if (ID === "stock") {
            let item = {
                ItemID,
                Name,
                ModType,
                VerticalRecoil,
                HorizontalRecoil,
                Dispersion,
                AutoROF,
                SemiROF,
                ModMalfunctionChance,
                CameraRecoil,
                AimSpeed,
                Ergonomics,
                Accuracy,
                HasShoulderContact,
                BlocksFolding,
                StockAllowADS,
                ConflictingItems,
                Weight
            };
            return item;
        }
        if (ID === "gasblock") {
            let item = {
                ItemID,
                Name,
                ModType,
                VerticalRecoil,
                HorizontalRecoil,
                Dispersion,
                AutoROF,
                SemiROF,
                ModMalfunctionChance,
                CanCycleSubs,
                Accuracy,
                HeatFactor,
                CoolFactor,
                DurabilityBurnModificator,
                ConflictingItems,
                Ergonomics,
                Weight,
                MalfChance
            };
            return item;
        }
        if (ID === "handguard") {
            let item = {
                ItemID,
                Name,
                ModType,
                VerticalRecoil,
                HorizontalRecoil,
                Dispersion,
                AimSpeed,
                ChamberSpeed,
                Ergonomics,
                Accuracy,
                HeatFactor,
                CoolFactor,
                ConflictingItems,
                Weight
            };
            return item;
        }
        if (ID === "flashlight") {
            let item = {
                ItemID,
                Name,
                ModType,
                ConflictingItems,
                Ergonomics,
                Weight
            };
            return item;
        }
        if (ID === "unknown") {
            let item = {
                ItemID,
                Name,
                ModType,
                VerticalRecoil,
                HorizontalRecoil,
                Dispersion,
                CameraRecoil,
                AutoROF,
                SemiROF,
                ModMalfunctionChance,
                ReloadSpeed,
                AimSpeed,
                ChamberSpeed,
                CanCycleSubs,
                Ergonomics,
                Accuracy,
                CenterOfImpact,
                HeatFactor,
                CoolFactor,
                MalfunctionChance,
                LoadUnloadModifier,
                CheckTimeModifier,
                DurabilityBurnModificator,
                HasShoulderContact,
                BlocksFolding,
                Velocity,
                RecoilAngle,
                ConflictingItems,
                FixSpeed,
                StockAllowADS,
                Weight,
                MalfChance
            };
            return item;
        }
    }
}