import { MessageEmbed } from 'discord.js'

export default function createStarboundTemplate(): MessageEmbed {
  return new MessageEmbed()
    .setColor('#342B59')
    .setTitle('Starbound Server')
    .setThumbnail('attachment://starbound.png')
    .attachFiles([
      {
        attachment: 'assets/images/icons/starbound.png',
        name: 'starbound.png',
      },
    ])
}
