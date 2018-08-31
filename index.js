const config = require('./config.json');
const Discord = require('discord.js');
const util = require('util');
const bot = new Discord.Client({
    disableEveryone: true,
    disabledEvents: ['TYPING_START']
});

bot.on("ready", () => {
    bot.user.setGame('JaverBot - Info: #pomoc');
    console.log(`Bot jest online!\n${bot.users.size} users, in ${bot.guilds.size} polaczono z serwerem.`);
});

bot.on("guildCreate", guild => {
    console.log(`Dołączył do gildii ${guild.name} (${guild.id}), posiadaną przez ${guild.owner.user.username} (${guild.owner.user.id}).`);
});

bot.on("message", async message => { 

    if(message.author.bot || message.system) return;
    
    if(message.channel.type === 'dm') {
        return;
    } 

    console.log(message.content);
    
    if (message.content.indexOf(config.prefix) === 0) {
        
        let msg = message.content.slice(config.prefix.length);

        let args = msg.split(" ");

        let cmd = args[0].toLowerCase();

        args.shift();

        
        if (cmd === 'czesc' || cmd === 'siema') {
            message.channel.send(`Witaj ${message.author.toString()}`);
            return; 
        }

        else if (cmd === 'pomoc') { // ping > pong just in case..
            return message.channel.send('Twórca bota: Javer01 | #pomoc2');
		}
		else if (cmd === 'pomoc2') {
			return message.channel.send('Wersja bota: 0.1 BETA | #pomoc3')
		}
		else if (cmd === 'pomoc3') {
			return message.channel.send('Github: Yamesiak | #pomoc4')
        }

        else if (cmd === "eval" && message.author.id === config.owner){
            const code = args.join("xd ");
            return evalCmd(message, code);
        }

        else {
            message.channel.send(`Nie znaleziono komendy! Jeśli to błąd zgłoś go do @Javer01#7601`);
            return;
        }
        
    } else if (message.content.indexOf("<@"+bot.user.id) === 0 || message.content.indexOf("<@!"+bot.user.id) === 0) {

        return message.channel.send(`Użyj \`${config.prefix}\` aby współdziałać ze mną.`);
    }
    return;
});

function evalCmd(message, code) {
    if(message.author.id !== config.owner) return;
    try {
        let evaled = eval(code);
        if (typeof evaled !== "string")
            evaled = util.inspect(evaled);
            message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}
function clean(text) {
    if (typeof(text) !== 'string') {
        text = util.inspect(text, { depth: 0 });
    }
    text = text
        .replace(/`/g, '`' + String.fromCharCode(8203))
        .replace(/@/g, '@' + String.fromCharCode(8203))
        .replace(config.token, 'mfa.NDg1MTY3NTQ3MjM1MTcyMzUz.DmsnIQ.uA1zWYuWtGMgDkSaIuR5EbPq7yU')
    return text;
}

process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception: ', errorMsg);
});

process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: ', err);
});

bot.login(config.token);