const fs = require("fs");
const path = require("path");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const dbPath = path.join(__dirname, "../db/db.json");

module.exports = {
    name: "secur",
    description: "Gérer les rôles sécurisés (add, remove, list)",
    botOwner: true,
    async executeSlash(client, interaction) {
        const sub = interaction.options.getSubcommand();
        const role = interaction.options.getRole("role");
        const embed = new EmbedBuilder();

        let db = {};
        try {
            db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        } catch (e) {}
        db.secur ??= [];

        const writeDB = () => fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        switch (sub) {
            case "add":
                if (db.secur.includes(role.id))
                    return interaction.reply({ embeds: [embed.setColor(0xFF0000).setDescription(`<:990not:1371830095391756379> Le rôle ${role} est déjà dans la liste des roles sécurisés.`)], ephemeral: true });
                db.secur.push(role.id);
                try { writeDB(); } catch {
                    return interaction.reply({ embeds: [embed.setColor(0xFF0000).setDescription("<:990not:1371830095391756379> Erreur lors de la sauvegarde.")], ephemeral: true });
                }
                return interaction.reply({ embeds: [embed.setColor(0x00ff00).setDescription(`<:990yyes:1371830093252399196> Le rôle ${role} a bien été ajouté à la liste des roles sécurisés.`)], ephemeral: true });

            case "remove":
                if (!db.secur.includes(role.id))
                    return interaction.reply({ embeds: [embed.setColor(0xFF0000).setDescription(`<:990not:1371830095391756379> Le rôle ${role} n'est pas dans la liste des roles sécurisés.`)], ephemeral: true });
                db.secur = db.secur.filter(id => id !== role.id);
                try { writeDB(); } catch {
                    return interaction.reply({ embeds: [embed.setColor(0xFF0000).setDescription("<:990not:1371830095391756379> Erreur lors de la sauvegarde.")], ephemeral: true });
                }
                return interaction.reply({ embeds: [embed.setColor(0x00ff00).setDescription(`<:990yyes:1371830093252399196> Le rôle ${role} a bien été retiré, désormais n'importe quelle personne peut l'ajouter.`)], ephemeral: true });

            case "list":
                return interaction.reply({
                    embeds: [embed
                        .setColor(0x00AEFF)
                        .setTitle("Rôles sécurisés")
                        .setDescription(db.secur.length ? db.secur.map((id, i) => `\`${i + 1}\` - <@&${id}> | \`${id}\``).join("\n") : "*Aucun rôle sécurisé.*")
                    ],
                    ephemeral: true
                });
        }
    },

    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addSubcommand(sub =>
                sub.setName("add").setDescription("Ajouter un rôle sécurisé").addRoleOption(opt => opt.setName("role").setDescription("Le rôle à ajouter").setRequired(true)))
            .addSubcommand(sub =>
                sub.setName("remove").setDescription("Retirer un rôle sécurisé").addRoleOption(opt => opt.setName("role").setDescription("Le rôle à retirer").setRequired(true)))
            .addSubcommand(sub =>
                sub.setName("list").setDescription("Lister les rôles sécurisés"));
    }
};
