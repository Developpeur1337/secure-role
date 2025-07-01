const commands = [];
const fs = require('node:fs');
const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        await client.guilds.fetch();
        console.clear()
        console.log(`
                                                 █████╗ ██╗     ███████╗██████╗ ████████╗███████╗    ██████╗  ██████╗ ████████╗
                                                ██╔══██╗██║     ██╔════╝██╔══██╗╚══██╔══╝██╔════╝    ██╔══██╗██╔═══██╗╚══██╔══╝
                                                ███████║██║     █████╗  ██████╔╝   ██║   █████╗      ██████╔╝██║   ██║   ██║   
                                                ██╔══██║██║     ██╔══╝  ██╔══██╗   ██║   ██╔══╝      ██╔══██╗██║   ██║   ██║   
                                                ██║  ██║███████╗███████╗██║  ██║   ██║   ███████╗    ██████╔╝╚██████╔╝   ██║   
                                                ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝    ╚═════╝  ╚═════╝    ╚═╝                                                  
                                                                                                                                        
        `.magenta);

        console.log('                               ══════════════════════════════════════════════════════════════════════════════════════'.magenta);
        console.log(`                                                         Bot: ${client.user.username}#${client.user.discriminator}`.magenta);
        console.log(`                                                         ID: ${client.user.id}`.magenta);
        console.log(`                                                         Serveurs: ${client.guilds.cache.size}`.magenta);
        console.log('                               ══════════════════════════════════════════════════════════════════════════════════════'.magenta);
    
        const commandFiles = fs.readdirSync(`./commandes`).filter(file => file.endsWith(".js"));
        commandFiles.forEach(commandFile => {
            const command = require(`../commandes/${commandFile}`);
            if (command.data) commands.push(command.data.toJSON());
        });

        const rest = new REST({ version: '10' }).setToken(client.token);

        rest.put(
            Routes.applicationCommands(client.user.id), { body: commands }
            )
            .then((data) => console.log(`[SLASH] ${data.length} slashs enregistrés.`))
            .catch(console.error);
    }
}