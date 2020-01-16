const { Event } = require('klasa')
import { MessageEmbed } from 'discord.js'

module.exports = class extends Event {
  constructor(...args) {
    super(...args, {
      name: 'ExclusiveCommandNotice',
      enabled: true,
      event: 'commandInhibited',
      once: false,
    })
  }

  async run(message, command, response) {
    if (Array.isArray(response)) {
      for (const res of response) {
        switch (res.reason) {
          case 'exclusive':
            message.sendEmbed(new MessageEmbed().setTitle('umm'))
            // message.sendMessage(
            //   `Sorry but that command is exclusive to the "${res.guild}" guild!`
            // )
            break
        }
      }
    }
  }
}
