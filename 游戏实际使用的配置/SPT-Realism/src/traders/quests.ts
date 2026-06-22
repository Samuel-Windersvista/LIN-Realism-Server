import { IQuest } from "@spt/models/eft/common/tables/IQuest";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { ISptProfile } from "@spt/models/eft/profile/ISptProfile";
import { EventTracker } from "../misc/seasonalevents";

const treatmentQuests = require("../../db/quests/rad_treatment.json");
const exploreQuests = require("../../db/quests/zone_exploration.json");
const dynamicZoneQuests = require("../../db/quests/dynamic_zones.json");
const gasEventQuests = require("../../db/quests/gas_event.json");
const achievments = require("../../db/quests/achievements.json");

export class Quests {
    constructor(private logger: ILogger, private tables: IDatabaseTables, private modConf: any) { }

    localesEN(): Record<string, string> {
        return this.tables.locales.global["ch"];
    }
    questDB(): Record<string, IQuest> {
        return this.tables.templates.quests;
    }

    public pushAchievements() {
        achievments.forEach(a => {
            this.tables.templates.achievements.push(a);
        });

        for (let i in this.tables.locales.global) {
            let locale = this.tables.locales.global[i];
            //achievement
            locale["6705551c3d8179f4bdf93e10 name"] = "The Blue Flame";
            locale["6705551c3d8179f4bdf93e10 description"] = "Completed the Realism Mod Halloween event";
        }
    }

    //automate locales in future
    public loadHazardQuests() {

        this.pushAchievements();

        //Bad Omens - Part 1
        this.questDB()["6702afe9504c9aca4ed75d9a"] = gasEventQuests["6702afe9504c9aca4ed75d9a"];
        //Bad Omens - Part 2
        this.questDB()["6702b0a1b9fb4619debd0697"] = gasEventQuests["6702b0a1b9fb4619debd0697"];
        //Bad Omens - Part 3	
        this.questDB()["6702b0e9601acf629d212eeb"] = gasEventQuests["6702b0e9601acf629d212eeb"];
        //Former Patients
        this.questDB()["6702b8b3c0f2f525d988e428"] = gasEventQuests["6702b8b3c0f2f525d988e428"];
        //Critical Mass
        this.questDB()["670ae811bd43cbf026768126"] = gasEventQuests["670ae811bd43cbf026768126"];
        //Do No Harm
        this.questDB()["6702b3b624c7ac4e2d3e9c37"] = gasEventQuests["6702b3b624c7ac4e2d3e9c37"];

        //treatment part 1
        this.questDB()["667c643869df8111b81cb6dc"] = treatmentQuests["667c643869df8111b81cb6dc"];
        //treatment part 2
        this.questDB()["667dbbc9c62a7c2ee8fe25b2"] = treatmentQuests["667dbbc9c62a7c2ee8fe25b2"];
        //find gas
        this.questDB()["6681c5127b9973f80c7c7d12"] = exploreQuests["6681c5127b9973f80c7c7d12"];
        //find rads
        this.questDB()["6681d150fd1d7f0b7e5ae953"] = exploreQuests["6681d150fd1d7f0b7e5ae953"];
        //find dynamic zones (triggers dynamic zones to start spawning)
        this.questDB()["66dad1a18cbba6e558486336"] = dynamicZoneQuests["66dad1a18cbba6e558486336"];

        //this quest is halloween only,
        //Illicit Procedures
        this.questDB()["6705425a0351f9f55b7d8c61"] = treatmentQuests["6705425a0351f9f55b7d8c61"];
        if (!EventTracker.isHalloween) {
            this.questDB()["6705425a0351f9f55b7d8c61"].conditions.AvailableForStart[0].value = 99;
        }

        //this quest is halloween only,
        //Blue Flame - Part 1
        this.questDB()["6702b3e4aff397fa3e666fa5"] = gasEventQuests["6702b3e4aff397fa3e666fa5"];
        if (!EventTracker.isHalloween) {
            this.questDB()["6702b3e4aff397fa3e666fa5"].conditions.AvailableForStart[0].value = 99;
        }


        //this quest is halloween only, but is dependent on part 1, there are checks client side too
        //Blue Flame - Part 2
        this.questDB()["6702b4a27d4a4a89fce96fbc"] = gasEventQuests["6702b4a27d4a4a89fce96fbc"];

        for (let i in this.tables.locales.global) {
            let locale = this.tables.locales.global[i];

            // 如果是万圣节，立即启用此任务，否则依赖于之前的危险任务
// Bad Omens - Part 1
locale["6702afe9504c9aca4ed75d9a acceptPlayerMessage"] = "";
locale["6702afe9504c9aca4ed75d9a declinePlayerMessage"] = "";
locale["6702afe9504c9aca4ed75d9a completePlayerMessage"] = "";
locale["6702afe9504c9aca4ed75d9a name"] = "不祥之兆 - 第1部分";
locale["6702afe9504c9aca4ed75d9a description"] = "我们这里有个情况。我们接收了比平常更多的新病人，他们都描述了呼吸困难的症状。"
    + " 他们都声称症状是在浓雾降临他们的村庄后开始的……迷信的村民之间流传着一些谣言，一个老人喋喋不休地说雾中有黑影潜伏。"
    + " 你能相信吗！然而，他们的症状非常真实。我需要你带一些治疗物资给我们，我们的物资快用完了。";
locale["6702afe9504c9aca4ed75d9a failMessageText"] = "";
locale["6702afe9504c9aca4ed75d9a successMessageText"] = "病人情况稳定，恢复良好。然而，我仍然对他们的症状来源感到担忧……我们以前见过这些症状。我们已经从病人身上采集了血样以确认……";
locale["6702b0062a10e8202cc9c063"] = "上交成堆的药品";
locale["6702b00eaa02eb7ffdabab6d"] = "上交一次性注射器";
locale["6702b01112e0e5412edc40b2"] = "上交医用采血器";
locale["6702b0159bb4fbdf2e467147"] = "上交生理盐水瓶";
locale["6702b0215240c197de5026dd"] = "此任务将开启一系列事件";

// Bad Omens - Part 2
locale["6702b0a1b9fb4619debd0697 acceptPlayerMessage"] = "";
locale["6702b0a1b9fb4619debd0697 declinePlayerMessage"] = "";
locale["6702b0a1b9fb4619debd0697 completePlayerMessage"] = "";
locale["6702b0a1b9fb4619debd0697 name"] = "不祥之兆 - 第2部分";
locale["6702b0a1b9fb4619debd0697 description"] = "越来越多的病人涌入，症状与之前相同。无论你带多少物资给我们，这都是不可持续的。"
    + " 我不再怀疑这是一种大规模的环境危害，某种有害的雾在天气平静时积聚。更多病人描述了听觉和视觉幻觉，我尚不清楚这是某种形式的集体癔症还是有害物质具有神经毒性。"
    + "\n\n血液检测结果与我们之前采集的样本不符。我们需要找出这种污染的来源。我给你一个GAMU设备，用于在野外收集数据。你需要在储存或制造大量有毒物质的区域进行测试。"
    + " 从同一地点获取多个读数没有意义，尝试不同的区域。此外，设备必须放置在污染足够严重的区域，优先考虑污染源而不是仅仅积聚的地方。"
    + "\n\n将设备放在地上并激活它，然后等待它们完成处理，这可能需要一些时间。这些设备不可靠，有时会卡住，需要重新激活，因此你需要待在附近。我手头没有很多这种设备，不要弄丢它们。";
locale["6702b0a1b9fb4619debd0697 failMessageText"] = "";
locale["6702b0a1b9fb4619debd0697 successMessageText"] = "谢谢你，年轻人。这些数据将非常宝贵。不幸的是，这不会在短期内帮助我们的病人。回来见我讨论这个问题。如果你收集了更多数据，你会得到公平的报酬。";
locale["6702b0c6ef3aa9366e629f9c"] = "上交带有数据的GAMU设备";

// Bad Omens - Part 3
locale["6702b0e9601acf629d212eeb acceptPlayerMessage"] = "";
locale["6702b0e9601acf629d212eeb declinePlayerMessage"] = "";
locale["6702b0e9601acf629d212eeb completePlayerMessage"] = "";
locale["6702b0e9601acf629d212eeb name"] = "不祥之兆 - 第3部分";
locale["6702b0e9601acf629d212eeb description"] = "情况非常危急。天气预报显示平静的天气即将来临，这意味着污染的雾会积聚。我们被病人淹没，以至于不得不开始动用我们的医疗物资储备。"
    + " 这种污染雾的出现越来越频繁。如果你发现自己被困在其中，找到最近的避难所并待在室内，污染物的浓度会降低。"
    + "\n\n为了有效治疗我们的病人，我们需要原始有害物质的样本。你可以在储存、制造、使用或由我前同事收集有害物质的区域找到它们……";
locale["6702b0e9601acf629d212eeb failMessageText"] = "";
locale["6702b0e9601acf629d212eeb successMessageText"] = "我们将能够从这些样本中逆向工程出毒素。我猜你对人道主义努力不感兴趣，但无论如何，你也会从中受益。";
locale["6702b0fef881e41d2b389bee"] = "上交有害物质样本";

// Former Patients
locale["6702b8b3c0f2f525d988e428 acceptPlayerMessage"] = "";
locale["6702b8b3c0f2f525d988e428 declinePlayerMessage"] = "";
locale["6702b8b3c0f2f525d988e428 completePlayerMessage"] = "";
locale["6702b8b3c0f2f525d988e428 name"] = "前病人";
locale["6702b8b3c0f2f525d988e428 description"] = "样本分析证实这种物质是一种神经毒素。它对植物无害，但所有动物都会受到影响。如果你听不到或看不到任何鸟类，一片死寂，你就知道你身处其中……如果你暴露在其中，你不能依赖你的感官，听觉幻觉很常见。然而……一个病人歇斯底里地声称他们在雾中看到了什么。"
    + " 我自然会忽略这些说法并给病人镇静剂，但他们在手机上录了下来……我不能详细说明原因，我相信你明白，但我怀疑是谁在背后操纵这一切，以及录像中的人是谁。我需要你确认这一点。"
    + "\n\n你需要在他们的藏身处附近安装带有远程访问功能的摄像头。我的人员将冒着巨大的风险远程收集数据，所以不用说，你需要谨慎行事，不要被发现。";
locale["6702b8b3c0f2f525d988e428 failMessageText"] = "";
locale["6702b8b3c0f2f525d988e428 successMessageText"] = "我的怀疑得到了证实……他们在背后操纵这一切，除非还有其他人指使他们……我在这些摄像头上看到的东西将让我余生都感到恐惧。这些人非常病态。他们以前不是这样的，他们是被人为变成这样的。这次恐怖袭击可能只是个开始。他们一直在念叨关于“蓝色火焰”的咒语……我相信随着时间的推移，更多真相会浮出水面。";
locale["6702b30d5376ef5b6f661de3"] = "找到海关区域的标记房间";
locale["6702b30fb8d60f93f5c6124c"] = "在标记房间安装Wi-Fi摄像头";
locale["6702b3229a6adda650f9413d"] = "找到海岸线度假村附近的亵渎教堂";
locale["6702b3258017122356622905"] = "在亵渎教堂安装Wi-Fi摄像头";
locale["6702b33092f96b8ffcc9ab37"] = "找到塔科夫公寓的标记藏身处";
locale["6702b332a22fc611f1c37045"] = "在公寓的标记藏身处安装Wi-Fi摄像头";
locale["6702b33e951abed9d20c2741"] = "找到森林中失落村庄的标记圆圈";
locale["6702b3402c47f1bef20161b6"] = "在失落村庄的标记圆圈安装Wi-Fi摄像头";
locale["6702b3458ab88b3a52829046"] = "找到用于广播的储备站标记房间";
locale["6702b34b09f951485e97945f"] = "在标记房间安装Wi-Fi摄像头";

// Critical Mass
locale["670ae811bd43cbf026768126 acceptPlayerMessage"] = "";
locale["670ae811bd43cbf026768126 declinePlayerMessage"] = "";
locale["670ae811bd43cbf026768126 completePlayerMessage"] = "";
locale["670ae811bd43cbf026768126 name"] = "临界质量";
locale["670ae811bd43cbf026768126 description"] = "关上门。我的人已经浏览了我们迄今为止收集的录像。他们用某种密码语言交流。我们已经初步尝试解码它。从我们收集到的信息来看，他们是针对塔科夫地区铁路网络的人。"
    + " 有提到运输放射性材料，但我们无法解码这些材料的来源和目的地或具体成分。我们相信这些是你之前帮助我们定位的装卸地点。"
    + " 我需要你在这些地点放置一个RAMU设备来收集数据。这些设备的工作原理与你之前使用的GAMU设备类似。确保将它们放置在装卸地点的中心，否则它们可能无法读取数据。我相信你记得这些地点可能具有高度放射性，请小心行事。此外，尽一切可能避免接触，我们不能让他们知道我们在追踪他们的行动。";
locale["670ae811bd43cbf026768126 failMessageText"] = "";
locale["670ae811bd43cbf026768126 successMessageText"] = ".";
locale["670ae82794523bfa0846cc5a"] = "上交带有数据的RAMU设备";

// Do No Harm
locale["6702b3b624c7ac4e2d3e9c37 acceptPlayerMessage"] = "";
locale["6702b3b624c7ac4e2d3e9c37 declinePlayerMessage"] = "";
locale["6702b3b624c7ac4e2d3e9c37 completePlayerMessage"] = "";
locale["6702b3b624c7ac4e2d3e9c37 name"] = "不伤害";
locale["6702b3b624c7ac4e2d3e9c37 description"] = "进来。坐下。如果我可以坦率地说，你他妈把那些摄像头放在哪里了？我以为这种工作是你以前的“职业”的一部分？你为什么认为把这些摄像头放在容易被发现的地方是个好主意？"
    + " 他们发现了。摄像头。他们现在正在大规模行动，砍杀任何他们怀疑在监视他们的人……PMC、平民，对他们来说都无所谓。这是你的责任，你必须解决它。"
    + "\n\n我们不知道他们从哪里获取污染物。我们不知道他们是如何在如此广泛的区域分发它的。我们不知道他们为什么要收集放射性材料。我们所知道的是，他们正在策划一些大事，必须阻止他们。我不想让这一切发生，我不想再有流血事件。";
locale["6702b3b624c7ac4e2d3e9c37 failMessageText"] = "";
locale["6702b3b624c7ac4e2d3e9c37 successMessageText"] = "我想让你知道，这些血债在你手上。如果摄像头没有被发现，这一切都可以避免。无论如何，他们似乎已经减少了行动……暂时如此。我猜污染事件会减少，但他们还会回来，我们还没有破解他们的密码。";
locale["6702b3d010baa251b5fbb933"] = "杀死邪教徒";

// 万圣节专属
// Blue Flame - Part 1
locale["6702b3e4aff397fa3e666fa5 acceptPlayerMessage"] = "";
locale["6702b3e4aff397fa3e666fa5 declinePlayerMessage"] = "";
locale["6702b3e4aff397fa3e666fa5 completePlayerMessage"] = "";
locale["6702b3e4aff397fa3e666fa5 name"] = "蓝色火焰 - 第1部分";
locale["6702b3e4aff397fa3e666fa5 description"] = "这些人，这些……邪教徒……他们中的一些人是我的前病人。对他们所做的事不是我的错，你明白吗？他们自愿参加了TerraGroup的医学研究。我的工作是监测和评估他们，在允许的情况下治疗他们……"
    + " 我想我们现在手上都沾满了鲜血，不是吗？重要的是我们如何纠正我们的错误，一劳永逸地结束这一切。"
    + "\n\n 他们的领袖，他们的“祭司”，用谜语和隐语交流。他们使用密码语言在小组之间交流，但我相信我们已经根据在摄像头被发现之前捕获的录像破解了他们的密码。"
    + " 如果他们正在策划我们怀疑的事情，我们都处于极大的危险之中。无论你效忠于谁或与谁为敌，都不再重要了。然而，我不凭假设行事，我是一名医学专业人士。我需要你收集样本和数据来确认他们的计划。你需要前往TerraGroup实验室寻找放射性材料。";
locale["6702b3e4aff397fa3e666fa5 failMessageText"] = "";
locale["6702b3e4aff397fa3e666fa5 successMessageText"] = "脱轨的火车，放射性材料的装卸地点……很久以前导致塔科夫地区电网瘫痪的EMP……哦，我的天……";
locale["6702b4488d22a77322a28e0e"] = "上交来自实验室的3个放射性材料样本";
locale["6702b44f711820e614d5b1b4"] = "上交来自实验室的带有数据的RAMU设备";

// 万圣节专属
// Blue Flame - Part 2
locale["6702b4a27d4a4a89fce96fbc acceptPlayerMessage"] = "";
locale["6702b4a27d4a4a89fce96fbc declinePlayerMessage"] = "";
locale["6702b4a27d4a4a89fce96fbc completePlayerMessage"] = "";
locale["6702b4a27d4a4a89fce96fbc name"] = "蓝色火焰 - 第2部分";
locale["6702b4a27d4a4a89fce96fbc description"] = "一切都归结于此。如果我们失败，我们都会死。没有办法疏散仍然留在塔科夫的平民，邪教徒正在追踪离开该地区的路线，并与联合国和RUAF部队交火。"
    + " 他们一定知道我们发现了什么，我们知道他们那病态的“预言”。我与外界的常规通信渠道已经被切断，随着暴力事件的增加，联合国和RUAF指挥部没有回应。"
    + " 更重要的是，你前往TerraGroup的设施真的激怒了马蜂窝，Raiders正在搜寻你。我担心TerraGroup仍然以某种方式积极参与这一切……"
    + "\n\n我们只有一次机会。我们必须与外界联系并警告他们，请求帮助。我必须承认，我与TerraGroup公司的交往比我透露的要多得多，我相信你已经猜到了。我对他们以前的行动非常了解，在他们把我留在这里腐烂之前。我知道他们有未经授权的近地轨道卫星。"
    + " 如果我们能找到并使用一个强大的卫星天线来建立通信链接，我的人可以重新利用并劫持卫星以与塔科夫地区以外的地方建立联系。下一次卫星将在10月31日经过，并且只在那之后的几天内可用。夜晚的预报信号最好，干扰较少。"
    + "\n\n海岸线地区有几个卫星天线。天线需要朝北，并且有清晰的视线和良好的高度。我会给你一个设备来建立通信链接并传输授权代码。不要。弄丢。这个。设备。Mechanic只有足够的组件来制造两个。我希望我不需要提醒你，如果你失败了，我们所有人都完了。";
locale["6702b4a27d4a4a89fce96fbc failMessageText"] = "";
locale["6702b4a27d4a4a89fce96fbc successMessageText"] = "Vires in Scientia. Scientia est fortis. Et oculus spectans deus nobis.";
locale["6702b4c1fda5e39ba46ccf35"] = "与外界建立通信链接";

// 治疗 - 第1部分
locale["667c643869df8111b81cb6dc acceptPlayerMessage"] = "";
locale["667c643869df8111b81cb6dc declinePlayerMessage"] = "";
locale["667c643869df8111b81cb6dc completePlayerMessage"] = "";
locale["667c643869df8111b81cb6dc name"] = "紧急治疗 - 第1部分（猫注：辐射累积50以上才需要接）";
locale["667c643869df8111b81cb6dc description"] = "进来，年轻人。我知道你一直在不该去的地方瞎逛。你不知道辐射对健康有害吗？听着，我们现在处境艰难，没有足够的物资来治疗你和你的……熟人？你得自己去找。我们暂时无法再为你治疗，所以要更加小心。你的治疗是免费的，作为一个人情。这个人情将来要还的。";
locale["667c643869df8111b81cb6dc failMessageText"] = "";
locale["667c643869df8111b81cb6dc successMessageText"] = "这应该是你的最后一轮治疗。感觉如何？好点了吗？需要一些时间才能痊愈。我希望你吸取了教训。记住，我暂时无法再为你治疗。带上这些旧的AI-2，它们含有碘化钾，可以治疗低水平的辐射。看起来你会需要它们。你将来会还我这个人情的。";
locale["667c7cf226f52aef063b5ef7"] = "上交医用采血器";
locale["667c8a4420b5c29111af4bc7"] = "上交一次性注射器";
locale["667c8a3a189a9ffd2a5eea23"] = "上交成堆的药品";
locale["5a3fc03286f77414d64f9941"] = "此任务将重置PMC和Scav的辐射和毒性。";

// 治疗 - 第2部分
locale["667dbbc9c62a7c2ee8fe25b2 acceptPlayerMessage"] = "";
locale["667dbbc9c62a7c2ee8fe25b2 declinePlayerMessage"] = "";
locale["667dbbc9c62a7c2ee8fe25b2 completePlayerMessage"] = "";
locale["667dbbc9c62a7c2ee8fe25b2 name"] = "紧急治疗 - 第2部分（猫注：辐射累积50以上才需要接）";
locale["667dbbc9c62a7c2ee8fe25b2 description"] = "我看你没有听从我上次的建议……没关系，我们可以再次治疗你。只是你欠我的那个人情；我需要你为我们的人道主义努力带来额外的物资。如果你想让我们再次治疗你的那个“熟人”，你需要带来更多。他骚扰了我的员工，这不能容忍。让我们看看……你的静脉……你对自己做了什么？我需要一个LEDX来找到扎针的位置。";
locale["667dbbc9c62a7c2ee8fe25b2 failMessageText"] = "";
locale["667dbbc9c62a7c2ee8fe25b2 successMessageText"] = "你的治疗结束了。如果你愚蠢到再次掉进反应堆，带更多物资回来。带上LEDX；它被污染了。如果你需要进一步治疗，把它带回来。";
locale["667dbd121abe6984e4cfeb16"] = "上交医用采血器";
locale["667dbd23ef00ab79d3afb149"] = "上交医疗工具";
locale["667dbd1bb1aeca0bfbb408a7"] = "上交成堆的药品";
locale["667dbd2bedbb6aa6a6e862eb"] = "上交LEDX";
locale["66edf0495148faf0d5d3a75d"] = "此任务将重置PMC和Scav的辐射和毒性。此任务可重复。";

// 找到气体
locale["6681c5127b9973f80c7c7d12 acceptPlayerMessage"] = "";
locale["6681c5127b9973f80c7c7d12 declinePlayerMessage"] = "";
locale["6681c5127b9973f80c7c7d12 completePlayerMessage"] = "";
locale["6681c5127b9973f80c7c7d12 name"] = "安全技术员 - 第1部分";
locale["6681c5127b9973f80c7c7d12 description"] = "你好，雇佣兵。我有一些简单的工作给你。甚至在合同战争之前，我们就已经有病人因呼吸窘迫和其他奇怪的症状而来。疲劳、视野狭窄，甚至在某些情况下器官迅速衰竭……"
    + " 你和你的……公司？给该地区带来的混乱使这成为了低优先级，我们更关心的是处理枪伤。"
    + "\n\n然而，我们最近又有一批病人出现了很久以前的那些症状；我需要你找到这种污染的来源。我们不确定这是否与你之前帮助解决的水污染有关。"
    + "\n\n在海关路旁的工厂和仓库综合体曾经有一家化工厂，位于检查站和加油站之间。它属于TerraGroup公司或其子公司之一，我相信你对它们很熟悉。这可能是污染的来源之一。他们的商标随处可见，你不会错过。我需要你找到一些用于制造和储存化学产品的基础设施。我会派人去取样。";
locale["6681c5127b9973f80c7c7d12 failMessageText"] = "";
locale["6681c5127b9973f80c7c7d12 successMessageText"] = "谢谢你，雇佣兵。我的人已经确认这里制造的物质与我们一些病人所接触的污染物相符。这有严重的后果……但这与你无关。我可能还有更多工作给你。";
locale["6681c60bf1e98af2b3def8cc"] = "找到用于制造的基础设施";
locale["6682854b9ad02262e978d803"] = "找到用于储存的基础设施";

// 找到放射性物质
locale["6681d150fd1d7f0b7e5ae953 acceptPlayerMessage"] = "";
locale["6681d150fd1d7f0b7e5ae953 declinePlayerMessage"] = "";
locale["6681d150fd1d7f0b7e5ae953 completePlayerMessage"] = "";
locale["6681d150fd1d7f0b7e5ae953 name"] = "安全技术员 - 第2部分";
locale["6681d150fd1d7f0b7e5ae953 description"] = "我的人发现的不仅仅是一个化工厂。现场发现的清单表明，还有更多的货物运往塔科夫地区以外。从我们在外部的联系人来看，火车似乎没有到达目的地。"
    + " 我们不知道他们会走哪条路线，海关地区有许多铁路线交叉。我们所知道的是，货物中不仅有有毒物质，还有放射性材料。我不敢推测它们的预期用途是什么。"
    + "\n\n我需要你找到运送这些货物的火车，以便我的人可以安全处理它们，以免落入坏人之手。此外，我们从可靠的线人那里听说，一些……不道德的当地人将部分货物运往另一个地点；靠近河边的一个大仓库。我们不确定他们走了多远。货物将标有TerraGroup的财产。";
locale["6681d150fd1d7f0b7e5ae953 failMessageText"] = "";
locale["6681d150fd1d7f0b7e5ae953 successMessageText"] = "我的人将被派往脱轨地点并立即行动以取回货物。我希望你明白这是一个敏感问题，需要保密。我也希望你在行动时至少戴了呼吸器，没有碰任何东西……";
locale["6681d1e23a21783b8b9c14ba"] = "找到运送TerraGroup货物的火车";
locale["6682859c9d440e2a1e92fc89"] = "找到被盗的放射性货物";

// 找到动态区域（触发动态区域开始生成）
locale["66dad1a18cbba6e558486336 acceptPlayerMessage"] = "";
locale["66dad1a18cbba6e558486336 declinePlayerMessage"] = "";
locale["66dad1a18cbba6e558486336 completePlayerMessage"] = "";
locale["66dad1a18cbba6e558486336 name"] = "健康与安全";
locale["66dad1a18cbba6e558486336 description"] = "我需要你非常、非常仔细地听我说的一切。现在不是忽视我所说的话的时候。如果你不听，那么无论发生什么都是你的责任。"
    + "\n\n我不能告诉你我们在脱轨地点发现了什么，这太敏感了。我希望你理解，并且你知道你可以信任我。我能告诉你的是，火车脱轨不是意外，根据清单，许多材料失踪了。还有其他火车没有到达目的地，我想我不需要详细说明这意味着什么。"
    + "\n\n有人在雇佣当地人搬运这些非法材料。我需要你找到他们装卸这些材料的地点。我们需要找出它们被运往哪里。消息来源告诉我，这些地点可能会迅速消失。有许多不同的可能地点，你可能需要多次检查同一区域才能找到它们。"
    + "\n\n你在听吗？很好。这些材料极其危险，具有放射性。这些物质有些……不寻常，几乎就像周围的空气都被污染了。如果你不小心准备，你很可能会缓慢而痛苦地死去。作为一名医生，我不喜欢夸张。我们缺乏治疗严重辐射中毒的资源。如果你生病了，祈祷你能设法凑齐所有治疗所需的物资。";
locale["66dad1a18cbba6e558486336 failMessageText"] = "";
locale["66dad1a18cbba6e558486336 successMessageText"] = "你幸存下来并找到了污染地点？我担心我不得不雇佣其他雇佣兵来完成这项任务。请不要生气，我只是在说实际的话。保持警惕，我怀疑你会在未来一段时间内遇到更多这样的地点。";
locale["66dad1c505699b23af0ec446"] = "找到海关的装卸地点";
locale["66dad1cb72e715b2f7ae7d0a"] = "在海关的装卸地点放置标记";
locale["66ddb2de064eeae93da154ca"] = "找到海岸线的装卸地点";
locale["66ddb5a5a0c634bb0c8b1b11"] = "在海岸线的装卸地点放置标记";
locale["66ddb5cce3de442223979ac8"] = "找到立交桥的装卸地点";
locale["66ddb5d04e6c5562e560f705"] = "在立交桥的装卸地点放置标记";
locale["66edf085bc2977dd40c64c48"] = "接受此任务后，动态危险区域将生成。";

// 非法程序
locale["6705425a0351f9f55b7d8c61 acceptPlayerMessage"] = "";
locale["6705425a0351f9f55b7d8c61 declinePlayerMessage"] = "";
locale["6705425a0351f9f55b7d8c61 completePlayerMessage"] = "";
locale["6705425a0351f9f55b7d8c61 name"] = "非法程序";
locale["6705425a0351f9f55b7d8c61 description"] = "好吧，好吧，好吧……你搞出了个大麻烦，哈哈！看看你，你全毁了！我说你能活下来是幸运的，但我想你现在宁愿死了。"
    + " 听着，我多年来制定了许多应急计划，甚至是为了这样的事情。别对自己太苛刻，你和你的医生被耍了。这里有一些你无法理解的力量在起作用。"
    + " 对我来说无所谓，我是个幸存者，我可以在任何环境中茁壮成长。如果你做了什么，那就是帮我摆脱了那些底层垃圾。"
    + " 什么？哦对了，治疗！是的，我可以治疗你，但这会花费你。现金仍然是王道，宝贝，哈哈！";
locale["6705425a0351f9f55b7d8c61 failMessageText"] = "";
locale["6705425a0351f9f55b7d8c61 successMessageText"] = "别忘了当你再次辐射你的蛋蛋时来找我，哈哈！";
locale["670542841b112dda237d2131"] = "上交卢布";
locale["670542a1b4fecacfd3a6729a"] = "此任务将重置PMC和Scav的辐射和毒性。此任务可重复。";
        }
    }

    public resetRepeatableQuests(profile: ISptProfile) {
        //rad treatment
        this.resetQuestHelper(profile, "667dbbc9c62a7c2ee8fe25b2");

        if (EventTracker.isHalloween) {
            //Illicit Procedures
            this.resetQuestHelper(profile, "6705425a0351f9f55b7d8c61");
        }
    }

    public resetQuestHelper(profile: ISptProfile, questId: string) {
        const pmc = profile.characters.pmc;

        let questCompleted = false;

        for (let q in pmc.Quests) {
            let quest = pmc.Quests[q];
            if (quest.qid === questId) {
                if (quest.status === 4) {
                    questCompleted = true;
                    quest.status = 2;
                    quest.completedConditions = [];
                    if (quest.statusTimers["4"]) delete quest.statusTimers["4"];
                    if (quest.statusTimers["3"]) delete quest.statusTimers["3"];
                }

                break;
            }
        }

        if (!questCompleted) return;

        //TaskConditionCounters
        for (let key in pmc.TaskConditionCounters) {
            if (pmc.TaskConditionCounters[key].sourceId === questId) {
                delete pmc.TaskConditionCounters[key];
            }
        }

    }

    public removeFIRQuestRequire() {
        for (let i in this.questDB()) {
            let quest = this.questDB()[i];
            if (quest && quest.conditions && quest.conditions.AvailableForFinish) {

                let availForFin = quest.conditions.AvailableForFinish;
                for (let requirement in availForFin) {
                    if (availForFin[requirement].onlyFoundInRaid) {
                        availForFin[requirement].onlyFoundInRaid = false;
                    }
                }
            }
        }

        if (this.modConf.logEverything == true) {
            this.logger.info("FIR Requirements Removed");
        }
    }

    public fixMechanicQuests() {
        for (let i in this.questDB()) {
            if (!this.questDB()[i].type.toLowerCase().includes("weaponassembly")) continue;
            let quest = this.questDB()[i];
            if (!quest?.conditions?.AvailableForFinish) continue;
            for (let j in quest.conditions.AvailableForFinish) {
                let condition = quest.conditions.AvailableForFinish[j];
                if (condition["ergonomics"]) {
                    condition["ergonomics"].value = 1;
                    condition["ergonomics"].compareMethod = ">=";
                }
                if (condition["recoil"]) {
                    condition["recoil"].value = 1;
                    condition["recoil"].compareMethod = ">=";
                }
                if (condition["weight"]) {
                    condition["weight"].value = 0;
                    condition["weight"].compareMethod = ">=";
                }
                if (condition["width"]) {
                    condition["width"].value = 0;
                    condition["width"].compareMethod = ">=";
                }
                if (condition["height"]) {
                    condition["height"].value = 0;
                    condition["height"].compareMethod = ">=";
                }
                if (condition["durability"]) {
                    condition["durability"].value = 1;
                    condition["durability"].compareMethod = ">=";
                }
                if (condition["baseAccuracy"]) {
                    condition["baseAccuracy"].value = -1;
                    condition["baseAccuracy"].compareMethod = ">=";
                }
            }

            let id = this.questDB()[i]._id;
            let desc = this.localesEN()[id + " description"];
            if (desc) {
                this.localesEN()[id + " description"] = `${desc}` + "\n\n耐久、人机功效、后座力、重量 和 尺寸 等 改枪要求 均已被移除。";
            }
        }

        if (this.modConf.logEverything == true) {
            this.logger.info("Mechanic Quests Fixed");
        }
    }
}
