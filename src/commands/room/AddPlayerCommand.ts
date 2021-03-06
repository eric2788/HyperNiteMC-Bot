import CommandNode from "../../managers/command/CommandNode";
import {GuildMember, TextChannel} from "discord.js";
import BotUtils from "../../utils/BotUtils";
import ChannelManager from "../../managers/ChannelManager";

export default class AddPlayerCommand extends CommandNode {

    constructor(parent: CommandNode) {
        super(parent, "add", BotUtils.getCommandChannels(), BotUtils.getRoles(), "新增對象到你的房間", ["<玩家tag>"], "addplayer");
    }

    async execute(channel: TextChannel, guildMember: GuildMember, args: string[]) {
        const mem: GuildMember = BotUtils.getGuild().members.cache.get(!args[0].startsWith('@') ? args[0] : args[0].substr(1));
        if (mem == undefined) {
            await channel.send(`${guildMember.user.tag} 找不到對象。`);
            return;
        } else if (mem.id === guildMember.id) {
            await channel.send(`${guildMember.user.tag} 對象無法為自己!`);
            return;
        }
        if (ChannelManager.contain(guildMember.user, mem)) {
            await channel.send(`${guildMember.user.tag}  你已新增過該對象了。`);
            return;
        }
        if (ChannelManager.addPlayer(guildMember.user, mem.user)) {
            await channel.send(`${guildMember.user.tag}  成功新增該對象到你的房間。`);
        } else {
            await channel.send(`${guildMember.user.tag}  你沒有創建過房間。`);
        }
    }


}
