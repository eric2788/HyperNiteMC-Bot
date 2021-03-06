import {Client, Guild, GuildChannel, Role, TextChannel} from "discord.js";
import Manager from "../managers/command/CommandManager";
import RoomCommand from "../commands/room/RoomCommand";
import ChannelManager from "../managers/ChannelManager";
import TrainerCommand from "../commands/trainer/TrainerCommand";
import IPCommand from "../commands/IPCommand";
import UpTimeCommand from "../commands/UpTimeCommand";
import moment from 'moment-timezone';
import RequestCommand from "../commands/request/RequestCommand";
import BetaCommand from "../commands/BetaCommand";

moment.locale('zh-TW');
moment.tz.setDefault('Asia/Hong_Kong');

class Bot {

    private readonly _guild: Guild;

    constructor(client: Client, guild: Guild) {
        this._guild = guild;
        Bot._textChannels = new Set<TextChannel>([...guild.channels.cache.values()].filter(ch => ch.type === 'text').map(ch => ch as TextChannel));
        Bot._roles = new Set<Role>(guild.roles.cache.values());
    }

    private static _textChannels: Set<TextChannel> = new Set<TextChannel>();

    static get textChannels(): Set<TextChannel> {
        return this._textChannels;
    }

    private static _roles: Set<Role> = new Set<Role>();

    static get roles(): Set<Role> {
        return this._roles;
    }

    get guild(): Guild {
        return this._guild;
    }

    public static onActivate(): void {
        Manager.register(new RoomCommand());
        Manager.register(new TrainerCommand());
        Manager.register(new IPCommand());
        Manager.register(new UpTimeCommand());
        Manager.register(new RequestCommand());
        Manager.register(new BetaCommand());
        ChannelManager.launchIdleChecker();
        console.log("Command registered");
    }


}

let bot: Bot = null;

let activateTime: Date = new Date(0, 0, 0, 0);

const activate = (client: Client, guild: Guild): void => {
    if (bot == null) {
        bot = new Bot(client, guild);
        Bot.onActivate();
    }
    client.user.setPresence({
        activity: {
            name: 'BingoMC伺服器片段',
            url: 'https://www.youtube.com/results?search_query=bingomc',
            type: "WATCHING"
        },
        status: "dnd"
    }).catch(r => console.error((r as Error).message));
    activateTime = new Date();
};

const getActivateTime = (): Date => {
    return activateTime;
};

const getChannels = (): Set<TextChannel> => {
    return bot == null ? new Set<TextChannel>() : Bot.textChannels;
};

const getRoles = (): Set<Role> => {
    return bot == null ? new Set<Role>() : Bot.roles;
};

const getGuild = (): Guild => {
    if (bot == null) throw Error("Bot is null");
    return bot.guild;
};

const getCommandChannels = (): Set<TextChannel> => {
    return new Set<TextChannel>(getGuild().channels.cache.filter(g => g.name.includes(`指令`) && g instanceof TextChannel).map(g => g as TextChannel));
};

const findChannels = <T extends GuildChannel>(type: typeof GuildChannel, ...id: string[]): Set<T> => {
    const channels: Set<T> = new Set<T>();
    for (let d of id) {
        const gc: GuildChannel = BotUtils.getGuild().channels.cache.get(d);
        if (gc != undefined && gc instanceof type) channels.add(gc as T);
    }
    return channels;
};

const findRole = (...id: string[]): Set<Role> => {
    let roles: Set<Role> = new Set<Role>();
    for (let d of id) {
        const role: Role = BotUtils.getGuild().roles.cache.get(d);
        if (d != undefined) roles.add(role);
    }
    return roles;
};

const BotUtils = {
    activate,
    getChannels,
    getRoles,
    getGuild,
    getCommandChannels,
    findChannels,
    findRole,
    getActivateTime
};

export default BotUtils;
