import { MessageEmbed } from 'discord.js'
import { EventStore } from 'klasa'
import StarboundBaseEvent from '@structures/StarboundBaseEvent'
import { ExtendedMessage } from '@services/StarboundService'
import createStarboundTemplate from '@templates/StarboundTemplate'

export default class StarboundPlayerChatEvent extends StarboundBaseEvent {
  constructor(store: EventStore, file: string[], directory: string) {
    super(store, file, directory, {
      name: 'StarboundPlayerChatEvent',
      enabled: true,
      event: 'chat',
      emitter: 'starbound',
      once: false,
    })
  }

  /**
   * Builds the embed and sends the chat message(s).
   */
  run(message: ExtendedMessage | ExtendedMessage[]) {
    const embed = Array.isArray(message)
      ? this.multipleMessageEmbed((message as unknown) as ExtendedMessage[])
      : this.singleMessageEmbed((message as unknown) as ExtendedMessage)

    this.channel?.send(embed)
  }

  /**
   * Create the embed for a single chat message.
   */
  private singleMessageEmbed({
    discordName,
    playerName,
    message,
  }: ExtendedMessage) {
    const embed = createStarboundTemplate()

    if (discordName) {
      embed
        .setDescription(`${discordName} ${message}`)
        .setFooter(`Playing as ${playerName}.`)
    } else {
      embed
        .setDescription(`**<${playerName}>** ${message}`)
        .setFooter(`Not linked to Discord.`)
    }

    return embed
  }

  /**
   * Create the embed for a stack/queue of chat messages.
   */
  private multipleMessageEmbed(messages: ExtendedMessage[]) {
    if (!messages.length) {
      return void console.warn('Got an empty array of chat messages?', messages)
    }

    const embed = createStarboundTemplate()
    const firstMessage = messages[0]
    const { discordName, playerName } = firstMessage
    const messageString = messages
      .map((message, n) => `${n + 1} ${message.message}`)
      .join('\n')

    if (discordName) {
      embed
        .setDescription(`${discordName}\n${messageString}`)
        .setFooter(`Playing as ${playerName}.`)
    } else {
      embed
        .setDescription(`**<${playerName}>**\n${messageString}`)
        .setFooter(`Not linked to Discord.`)
    }

    return embed
  }
}
