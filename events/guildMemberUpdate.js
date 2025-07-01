const fs = require("fs");
const path = require("path");
const { AuditLogEvent, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const dbPath = path.join(__dirname, "../db/db.json");

module.exports = {
  name: "guildMemberUpdate",
  async execute(client, oldM, newM) {
    if (!oldM.guild || oldM.roles.cache.size >= newM.roles.cache.size) return;
    let db;
    try {
      db = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    } catch { return; }

    const roles = newM.roles.cache.filter(r => !oldM.roles.cache.has(r.id) && db?.secur?.includes(r.id));
    if (!roles.size) return;

    try {
      const log = (await newM.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberRoleUpdate })).entries.first();
      if (!log || log.target.id !== newM.id || Date.now() - log.createdTimestamp > 5000) return;
      const execId = log.executor?.id;
      if (!execId || execId === newM.id || execId === client.user.id) return;
      if (db.owners?.includes(execId) || client.config.owners.includes(execId)) return;

      await newM.roles.remove(roles).catch(() => null);

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("`🛡️`・Tentative d'ajout d'un rôle sécurisé")
        .setDescription("Un rôle **sécurisé** a été ajouté sans autorisation.")
        .addFields(
          { name: "👤 Membre ciblé", value: `<@${newM.id}> | \`${newM.id}\``, inline: true },
          { name: "👮 Ajouté par", value: `<@${execId}> | \`${execId}\``, inline: true },
          { name: "➖ Rôle retiré", value: roles.map(r => `<@&${r.id}>`).join(", ") }
        )
        .setFooter({ text: "Secur-Role System", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("auth").setLabel("Autorisé ✅").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("ref").setLabel("Refusé ❌").setStyle(ButtonStyle.Danger)
      );

      const ch = newM.guild.channels.cache.get(client.config.logs);
      if (!ch?.isTextBased()) return;
      const msg = await ch.send({ embeds: [embed], components: [row] });

      const col = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 10000 });

      col.on("collect", async i => {
        const Owner = db.owners?.includes(i.user.id) || client.config.owners.includes(i.user.id);
        if (!Owner) return i.reply({
          embeds: [new EmbedBuilder().setColor(0xFF0000).setDescription("<:990not:1371830095391756379> Seuls les owners peuvent faire ça.")],
          ephemeral: true
        });

        if (i.customId === "auth") {
          await newM.roles.add(roles).catch(() => null);
          await i.reply({
            embeds: [new EmbedBuilder().setColor(0x00ff00).setDescription("<:990yyes:1371830093252399196> Rôle sécurisé attribué.")],
            ephemeral: true
          });

          embed.addFields({ name: "<:990yyes:1371830093252399196> Autorisé par", value: `<@${i.user.id}> | \`${i.user.id}\`` });
          embed.setColor(0x00ff00);
          await msg.edit({ embeds: [embed] });

        } else {
          await i.reply({
            embeds: [new EmbedBuilder().setColor(0xFF0000).setDescription("<:990not:1371830095391756379> Aucun rôle ajouté.")],
            ephemeral: true
          });
        }

        const disabled = new ActionRowBuilder().addComponents(row.components.map(b => ButtonBuilder.from(b).setDisabled(true)));
        await msg.edit({ components: [disabled] });

        col.stop();
      });

      col.on("end", async () => {
        if (!msg.deleted) {
          const disabled = new ActionRowBuilder().addComponents(row.components.map(b => ButtonBuilder.from(b).setDisabled(true)));
          await msg.edit({ components: [disabled] }).catch(() => null);
        }
      });

    } catch (e) { 
      console.error("[SECUR]", e); 
    }
  }
};
