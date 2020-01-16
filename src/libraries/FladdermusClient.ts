import '@schemas/Starbound'
import { KlasaClient } from 'klasa'
import StarboundService from '@services/StarboundService'

if (typeof process.env.NODE_ENV === 'undefined') {
  throw new Error('NODE_ENV must be either development or production.')
}

const { NODE_ENV, OWNER_ID, TOKEN } = process.env

export default class FladdermusClient extends KlasaClient {
  starbound = new StarboundService(this)

  constructor() {
    super({
      fetchAllMembers: true,
      prefix: '>',
      commandEditing: true,
      commandLogging: true,
      ownerID: OWNER_ID,
      production: NODE_ENV === 'production',
      readyMessage: client =>
        `Successfully initialized. Ready to serve ${client.guilds.size()} guilds.`,
    })

    this.on('klasaReady', () => {
      this.user.setPresence({
        activity: {
          name: 'with 1s and 0s',
          type: 'PLAYING',
        },
        status: 'online',
      })
    })
  }
}
