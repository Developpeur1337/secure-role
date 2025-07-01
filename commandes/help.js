const { SlashCommandBuilder, EmbedBuilder, chatInputApplicationCommandMention } = require("discord.js");

module.exports = {
    name: "help",
    description: "Affiche la page d'aide du bot",
    botOwner: true,
    async executeSlash(client, interaction) {
        const commands = await client.application.commands.fetch();
        const fdp = commands.find(c => c.name === "secur");

        const data = [
            { name: "secur add", id: fdp?.id, desc: "Ajoute un role à la liste des roles sécurisés" },
            { name: "secur remove", id: fdp?.id, desc: "Retire un role des roles sécurisés" },
            { name: "secur list", id: fdp?.id, desc: "Affiche la liste des roles sécurisés" },
            { name: "owner", desc: "Ajoute un owner ou affiche la liste" },
            { name: "unowner", desc: "Enlève un owner" }
        ];

        const desc = data.map(cmd => {
            const [base, sub] = cmd.name.split(" ");
            const mainCmd = commands.find(c => c.name === base);
            if (sub && cmd.id) return `* </${cmd.name}:${cmd.id}> \`-\` ${cmd.desc}`;
            if (mainCmd) return `* ${chatInputApplicationCommandMention(base, mainCmd.id)} \`-\` ${cmd.desc}`;
            return `* \`/${cmd.name}\` \`-\` ${cmd.desc} *(non trouvée)*`;
        }).join("\n");

        const embed = new EmbedBuilder()
            .setColor(0x2F3136)
            .setDescription([
                "**__Page d'aide__**",
                "",
                "<a:Fleche:1289675112559280140> **Commandes slash :**",
                desc
            ].join("\n"))
            .setImage("https://cdn.discordapp.com/attachments/1051238708734611506/1051238771045187665/barre.jpg");

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },

    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Affiche la page d'aide du bot")
};
