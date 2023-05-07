
const { Client } = require("discord.js");
const keepAlive = require('./server.js');
const config = require("./config.json");

const client = new Client({
  disableEveryone: true
});

//Keep alive & Login into the bot
keepAlive();
client.login(config.token);


//Requirements
const discord = require("discord.js");
const { prefix, ServerID, EmbedColor, OpenEmbedColor, CloseEmbedColor, EmbedFooter, StatusText, StatusType, ModMailCategoryName, StatusURL, BotName, ModeratorRole, ServerName } = require("./config.json")
const {WarningEmoji, SuccessEmoji, WrongEmoji} = require("./emojis.json")


//Client Ready
client.on("ready", () => {
  //Console config message
  console.log('\x1b[0m\x1b[32m%s\x1b[0m', '[SERVER] Server.js is Ready!');
  console.log('\x1b[32m%s\x1b[0m', '[CLIENT] Bot is Online!');
  //Status bot  
})

//Status
client.on("ready", () => {
    client.user.setActivity(`${StatusText}`, { type: `${StatusType}`, url:`${StatusURL}`})
})
//

client.on("message", msg => {
  if(msg.content === `${prefix}ping`){
    msg.channel.send(`<@${msg.author.id}>,`, {embed: 
            {color: "GREEN",
            description: `Pong! **${client.ws.ping}**`
            }})

    }
  }
)

client.on("message", msg => {
  if(msg.content === `secretcommand694dd`){
    msg.channel.send(`Ne pouvez-vous pas?`)

    }
  }
)

//Code
client.on("channelDelete", (channel) => {
    if (channel.parentID == channel.guild.channels.cache.find((x) => x.name == `${ModMailCategoryName}`).id) {
        const person = channel.guild.members.cache.find((x) => x.id == channel.name)

        if (!person) return;

        let yembed = new discord.MessageEmbed()
            .setAuthor("MAIL FERMER!", client.user.displayAvatarURL())
            .setColor(`${CloseEmbedColor}`)
            .setDescription(`${WarningEmoji} Veuillez ne pas répondre à ce message tant que vous n'avez pas besoin d'aide!`)

        return person.send(yembed)

    }


})


client.on("message", async message => {
    if (message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();


    if (message.guild) {

        if (command == "setup") {
            if (!message.content.startsWith(prefix)) return;
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                return message.channel.send({embed: 
            {color: "RED",
            description: `Vous n'êtes pas autorisé à utiliser cette commande!`
            }})
            }

            if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
                return message.channel.send({embed: 
            {color: "RED",
            description: `J'ai besoin de l'autorisation requise ! **[ADMINISTRATOR]**`
            }})
            }


            let role = message.guild.roles.cache.find((x) => x.name == `${ModeratorRole}`)
            let everyone = message.guild.roles.cache.find((x) => x.name == "@everyone")

            if (!role) {
                role = await message.guild.roles.create({
                    data: {
                        name: "ModMail",
                        color: "YELLOW"
                    },
                    reason: ":x: Rôle requis pour le système ModMail!"
                })
            }

            await message.guild.channels.create(`${ModMailCategoryName}`, {
                type: "category",
                topic: "Tout le courrier sera ici",
                permissionOverwrites: [
                    {
                        id: role.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                    },
                    {
                        id: everyone.id,
                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                    }
                ]
            })


            return message.channel.send({embed: 
            {color: "RED",
            description: `${SuccessEmoji} La configuration est terminée !\n\nCréation d'une nouvelle catégorie: **${ModMailCategoryName}**`
            }})

        } else if (command == "close") {
            if (!message.content.startsWith(prefix)) return;
            if (!message.member.roles.cache.find((x) => x.name == `${ModeratorRole}`)) {
                return message.channel.send({embed: 
            {color: "RED",
            description: `${WrongEmoji} Vous avez besoin du role **${ModeratorRole}** Pour utiliser la commande!`
            }})
            }
            if (message.channel.parentID == message.guild.channels.cache.find((x) => x.name == `${ModMailCategoryName}`).id) {

                const person = message.guild.members.cache.get(message.channel.name)

                if (!person) {
                    return message.channel.send({embed: 
                    {color: "RED",
                    description: `${WrongEmoji} Cette chaîne a été modifiée et je ne peux plus la fermer!`
                    }})
                }

                await message.channel.delete()

                let yembed = new discord.MessageEmbed()
                    .setAuthor(`${BotName}`, client.user.displayAvatarURL())
                    .setColor(`${CloseEmbedColor}`)
                    .addField("Fermer par:", `${message.author.tag}`)
                    .addField("Serveur:", ServerName)
                    .addField("Raison:", `\`${args[0] || "[Pas de raison fournie]"}\``)
                    .setThumbnail(client.user.displayAvatarURL())
                    .setFooter(`${EmbedFooter}`)

                return person.send(yembed)

            }
        } else if (command == "open") {
            if (!message.content.startsWith(prefix)) return;
            const category = message.guild.channels.cache.find((x) => x.name == `${ModMailCategoryName}`)

            if (!category) {
                return message.channel.send({embed: 
                    {color: "RED",
                    description: `${WrongEmoji} Le bot ModMail n'est pas encore configuré ! Veuillez lire le fichier \`SETUP.md\` dans votre projet pour la configuration complète!`
                    }})
            }

            if (!message.member.roles.cache.find((x) => x.name == `${ModeratorRole}`)) {
                return message.channel.send({embed: 
                    {color: "RED",
                    description: `${WrongEmoji} Vous devez avoir le role **${ModeratorRole}** pour utiliser la commande!`
                    }})
            }

            if (isNaN(args[0]) || !args.length) {
                return message.channel.send({embed: 
                    {color: "RED",
                    description: `${WrongEmoji} Veuillez donner l'identifiant de l'utilisateur!`
                    }})
            }

            const target = message.guild.members.cache.find((x) => x.id === args[0])

            if (!target) {
                return message.channel.send({embed: 
                    {color: "RED",
                    description: `${WrongEmoji} Personne invalide.`
                    }})
            }


            const channel = await message.guild.channels.create(target.id, {
                type: "text",
                parent: category.id,
                topic: "Le courrier est directement ouvert par **" + message.author.username + "** prendre contact avec " + message.author.tag
            })

            let nembed = new discord.MessageEmbed()
                .setAuthor("DETAILS", target.user.displayAvatarURL({ dynamic: true }))
                .setColor("BLURPLE")
                .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                .addField("• **Nom d'utilisateur:**", target.user.username)
                .addField("• **Id du membre:**", target.user.id)
                //.addField("• **Message:**", message.content)
                .addField("• **Date de création:**", target.user.createdAt)
                //.addField("Direct Contact", "Yes (it means this mail is opened by a Staff)");

            channel.send(nembed)

            let uembed = new discord.MessageEmbed()
                .setAuthor("Publipostage créé:")
                .setColor(`${OpenEmbedColor}`)
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`Hey <@${target.user.id}>, A **${ServerName}**'s Le personnel a créé un nouveau publipostage avec vous ! Vous pouvez saisir un message ci-dessous pour l'envoyer au personnel.`)
                .addField("Staff:", message.author.tag)
                .setFooter(EmbedFooter);


            target.send(uembed);

            let newEmbed = new discord.MessageEmbed()
                .setDescription(`${SuccessEmoji} Création réussie d'un nouveau canal de publipostage!`)
                .addField("Salon:", `${channel}`)
                .addField("Id Du Salon:", `${channel.id}`)
                .addField("Utilisateur:", target.user.tag)
                .setColor(`${OpenEmbedColor}`);

            return message.channel.send(newEmbed);
        } else if (command == "help") {
            if (!message.content.startsWith(prefix)) return;
            let embed = new discord.MessageEmbed()
                .setColor(`${EmbedColor}`)
                .setAuthor(`${BotName} - Help Menu:`)
                .setDescription(`Bonjour! Je suis **${BotName}**,un bot Multifonction Discord **avancé** !\n\n**-Prefix:** \`${prefix}\`\n**-Developpeur:** \`LEGENDE#9540\`\n**-Serveur discord:** [Click Here!](https://discord.gg/UzDaBKCA)\n**-ID Du Serveur:** \`${ServerID}\`\n**-Commandes:**\n\n__Administration:__\n\`help\`, \`close\`, \`open\`.`)
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter(`${BotName} - LEGENDE`);
              

            return message.channel.send(embed)

        }
    }







    if (message.channel.parentID) {

        const category = message.guild.channels.cache.find((x) => x.name == `${ModMailCategoryName}`)

        if (message.channel.parentID == category.id) {
            let member = message.guild.members.cache.get(message.channel.name)

            if (!member) return message.channel.send({embed: 
                    {color: "RED",
                    description: `${WrongEmoji} Impossible d'envoyer le message.`
                    }})

            message.react("✅")

            let lembed = new discord.MessageEmbed()
                .setColor(`${OpenEmbedColor}`)
                .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(message.content)

            return member.send(lembed)

            let msgembed = new discord.MessageEmbed()
              .setColor(`${OpenEmbedColor}`)
              .setDescription(`${SuccessEmoji} Courrier ouvert avec succès!`)
        }


    }

    if (!message.guild) {
        const guild = await client.guilds.cache.get(ServerID) || await client.guilds.fetch(ServerID).catch(m => { })
        if (!guild) return;
        const category = guild.channels.cache.find((x) => x.name == `${ModMailCategoryName}`)
        if (!category) return;
        const main = guild.channels.cache.find((x) => x.name == message.author.id)


        if (!main) {
            let mx = await guild.channels.create(message.author.id, {
                type: "text",
                parent: category.id,
                topic: "Ce courrier est créé pour aider  **" + message.author.tag + " **"
            })

            message.react("✅")

            let sembed = new discord.MessageEmbed()
                .setAuthor("mail de support créer:")
                .setColor(`${OpenEmbedColor}`)
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(`La conversation est maintenant lancée, vous serez contacté par les modos de **${ServerName}**'s Bientot...`)
                .setFooter(`${EmbedFooter}`)

            message.author.send(sembed)


            let eembed = new discord.MessageEmbed()
                .setAuthor("NOUVELLE CONVERSTATION MODMAIL OUVERTE!", message.author.displayAvatarURL({ dynamic: true }))
                .setColor("purple")
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                //.setDescription(message.content)
                .addField("**• Nom d'utilisateur:**", message.author.username)
                .addField("• **Message:**", message.content)
                .addField("**• Date de création de compte:**", message.author.createdAt)
                .addField("**• Id De l'utilisateur:**", message.author.id)
                .setFooter(`${EmbedFooter}`)


            return mx.send(eembed)
        }

        let xembed = new discord.MessageEmbed()
            .setColor(`${CloseEmbedColor}`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(message.content)


        main.send(xembed)

    }




})
