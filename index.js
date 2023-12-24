const { Client, Intents, MessageActionRow, MessageButton, MessageEmbed, Modal, TextInputComponent } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const config = require("./config.json");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const rest = new REST({ version: "10" }).setToken(config.token);

client.once("ready", () => {
  console.log(`Bot is Ready! ${client.user.tag}`);
  console.log(`Code by Wick Studio`);
  console.log(`discord.gg/wicks`);

  rest.put(Routes.applicationCommands(client.user.id), {
    body: [new SlashCommandBuilder().setName("review").setDescription("review")],
  }).catch(error => {
    console.error('فشل في تسجيل أوامر البوت :', error.code);
  });
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (interaction.isCommand()) {
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId("1_star")
          .setLabel("⭐")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("2_star")
          .setLabel("⭐⭐")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("3_star")
          .setLabel("⭐⭐⭐")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("4_star")
          .setLabel("⭐⭐⭐⭐")
          .setStyle("PRIMARY"),
        new MessageButton()
          .setCustomId("5_star")
          .setLabel("⭐⭐⭐⭐⭐")
          .setStyle("PRIMARY")
      );

      const embed = new MessageEmbed()
        .setTitle('لوحة التقييم')
        .setColor('#05131f')
        .setDescription("مرحباً! يرجى اخذ من وقتك لحظة لتقييم خدمة العملاء.")
        .setThumbnail('https://media.discordapp.net/attachments/1138092372480233522/1188406137863811122/feedback.png?ex=659a6876&is=6587f376&hm=cb62c222bd87eaa85e7ec43d88c5d09b0f85719676d3eab2fe1f238f0104269e&=&format=webp&quality=lossless&width=675&height=675')
        .addField('ملاحظة', 'انقر على أحد أزرار النجمة أدناه لتقييم خدمة العملاء')
        .setFooter(`${interaction.guild ? interaction.guild.name : 'سيرفر غير معرف'}`)
        .setTimestamp();

      embed.addField('الرجاء منك التقييم', '⭐⭐⭐⭐⭐', true);
      embed.addField('تقديم التقييم', '⭐ - Terrible\n⭐⭐ - Bad\n⭐⭐⭐ - Average\n⭐⭐⭐⭐ - Good\n⭐⭐⭐⭐⭐ - Excellent', true);

      await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
      });

    } else if (interaction.isModalSubmit()) {
      const customId = interaction.customId;
      const stars = customId.split("_")[1];
      const channel = interaction.guild.channels.cache.get(config.channelId);
      const review = interaction.fields.getTextInputValue("review");
      const starText = "⭐".repeat(stars);
  
      const embed2 = new MessageEmbed()
        .setTitle('رسالة تقييم جديدة')
        .setDescription(`**رسالة التقييم :**\n${review}\n\n`)
        .setColor('#020b12')
        .setThumbnail('https://media.discordapp.net/attachments/1138092372480233522/1188406137863811122/feedback.png?ex=659a6876&is=6587f376&hm=cb62c222bd87eaa85e7ec43d88c5d09b0f85719676d3eab2fe1f238f0104269e&=&format=webp&quality=lossless&width=675&height=675')
        .addField('تم الارسال بواسطة', interaction.user.toString(), true)
        .addField('التقييم', starText || 'لا يوجد تصنيف متاح', true)
        .setTimestamp();
  
      await channel.send({
        embeds: [embed2]
      });
  
      const channelMention = channel.toString();
      const embed = new MessageEmbed()
        .setAuthor('✅ تم')
        .setColor('#020b12')
        .setDescription(`تم ارسال تقييم الى ${channelMention}`)
        .setTimestamp();
  
      interaction.reply({ embeds: [embed], ephemeral: true }).catch(() => {});
  
    } else if (interaction.isButton()) {
      const customId = interaction.customId;
      if (customId.endsWith("star")) {
        const stars = customId.split("_")[0];
        const review = new TextInputComponent()
          .setCustomId(`review`)
          .setLabel("اكتب رسالة تقييمك هناك")
          .setStyle("SHORT")
          .setRequired(true);
        const row = new MessageActionRow().addComponents(review);
        const modal = new Modal()
          .setCustomId(`stars_${stars}`)
          .setTitle("اكتب رسالة تقييمك هناك")
          .addComponents(row);
  
        await interaction.showModal(modal);
      }
    }
  } catch (error) {
    console.error('حدث خطأ في التفاعل :', error);
    handleError(interaction, error);
  }
});

client.login(config.token).catch(error => {
  console.error('حدث خطا اثناء تسجيل الدخول :', error);
});

function handleError(interaction, error) {
  let errorMessage = 'Error';
  if (error.code) {
    switch (error.code) {
      case 50001:
        errorMessage = 'Error code : 50001';
        break;
      case 50013:
        errorMessage = 'Error code : 50013';
        break;
      case 10003:
        errorMessage = 'Error code : 10003';
        break;
      case 10011:
        errorMessage = 'Error code : 10011';
        break;
      case 10008:
        errorMessage = 'Error code : 10008';
        break;
      case 30005:
        errorMessage = 'Error code : 30005';
        break;
      case 30013:
        errorMessage = 'Error code : 30013';
        break;
      case 30016:
        errorMessage = 'Error code : 30016';
        break;
      case 500:
        errorMessage = 'Error code : 500';
        break;
      case 40001:
        errorMessage = 'Error code : 40001';
        break;
      case 429:
        errorMessage = 'Error code : 429';
        break;
      default:
        errorMessage = `Error code : ${error.code} , please go discord.gg/wicks for get help`;
        break;
    }
  } else if (error.message) {
    errorMessage = error.message;
  }
  interaction.reply({ content: errorMessage, ephemeral: true }).catch(console.error);
}