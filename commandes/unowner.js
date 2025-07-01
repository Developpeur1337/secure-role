const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const dbPath = path.join(__dirname, "../db/db.json");

module.exports = {
    name: "unowner",
    description: "Retirer le statut d'owner à un utilisateur.",
    botOwnerOnly: true,
    async executeSlash(client, interaction) {
        const user = interaction.options.getUser("user");

        if (!user) {
            return interaction.reply({ content: "❌ Veuillez mentionner un utilisateur valide.", ephemeral: true });
        }

        let db;
        try {
            db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        } catch (err) {
            console.error("Erreur de lecture DB:", err);
            return interaction.reply({ content: "❌ Erreur de lecture de la base de données.", ephemeral: true });
        }

        db.owners = db.owners || [];

        if (!db.owners.includes(user.id)) {
            const embed = new EmbedBuilder()
                .setDescription(`<:990not:1371830095391756379>・${user} n'est pas owner.`)
                .setColor(0xFF0000);
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        db.owners = db.owners.filter(id => id !== user.id);

        try {
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 4), "utf8");
        } catch (err) {
            console.error("Erreur d'écriture DB:", err);
            return interaction.reply({ content: "<:990not:1371830095391756379> Erreur lors de la sauvegarde de la base de données.", ephemeral: true });
        }

        client.perms.owners = db.owners;

        const confirmEmbed = new EmbedBuilder()
            .setDescription(`<:990yyes:1371830093252399196>・${user} n'est plus owner.`)
            .setColor(0x00FF00);

        return interaction.reply({ embeds: [confirmEmbed], ephemeral: true });
    },

    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(o =>
                o.setName("user")
                    .setDescription("Veuillez mentionner un utilisateur")
                    .setRequired(true)
            );
    }
};
