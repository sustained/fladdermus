import { Command } from 'klasa'

export default class extends Command {
  constructor(...args) {
    super(...args, {
      name: 'test',
      runIn: ['text', 'dm'],
      description: 'Test.',
    })
  }

  async run(message, [...params]) {
    message.reply(this.constants.PATHS.IMAGES)
  }

  async init() {}
}
