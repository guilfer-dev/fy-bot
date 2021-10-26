import Discord from "discord.js"
import 'dotenv/config';

const client = new Discord.Client(
    {
        intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
        partials: ["CHANNEL"]
    });

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`)
})

let target;
let canSwear;
let swearTimes = 0;

client.on("messageCreate", msg => {

    const { content } = msg;
    let mention = content.match(/\<\@\!?\d{0,20}>/g);
    const sanitizedMessage = content.trim().split(' ');
    mention === -1 || mention === null ? mention = false : mention = mention[0];


    if (content.startsWith('!fy')) {
        if (sanitizedMessage.length === 2
            && mention) {
            if (swearTimes === 0
            ) {
                target = mention
                msg.reply(`Fuck you, ${mention}`);
                canSwear = true;
                return
            } else if (swearTimes > 0) {
                msg.reply(`Its time for ${target} to fuck himself`)
                return
            }
        }
        else if (sanitizedMessage[1] === '--help') {
            msg.reply(
                `"!fy <@user>": Only stops after called 10 times
"!fy --rounds: Shows target and rounds left
"!fy --off: yet to be implemented
"!fy --on: yet to be implemented
"!fy --help": Shows bot commands`
            )
        } else if (sanitizedMessage[1] === '--rounds') {
            if (!target) {
                msg.reply('No target set yet')
            } else msg.reply(`${target} went to fuck himself ${swearTimes} out of 10`)
        } else {
            msg.reply('Command must be: "!fy <@user>" or !fy --help for more information')
            return
        }
    }

    if (target === mention
        && msg.author.username !== process.env.BOT_NAME
        && canSwear) {
        msg.reply(`Fuck you, ${target}`)
        swearTimes++
        if (swearTimes >= 10) {
            canSwear = false
            swearTimes = 0;
            return
        }
    }
});


client.login(process.env.CLIENT_TOKEN)