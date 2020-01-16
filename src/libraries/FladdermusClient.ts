import '@schemas/StarboundSchema'
import { KlasaClient } from 'klasa'
import StarboundService from '@services/StarboundService'

if (typeof process.env.NODE_ENV === 'undefined') {
  throw new Error('NODE_ENV must be either development or production.')
}

const { NODE_ENV, OWNER_ID, TOKEN } = process.env

// TODO: Is there a better way? Without this everything in src/starbound/events dies.
declare module 'klasa' {
  export interface KlasaClient {
    starbound: StarboundService
  }
}

export default class FladdermusClient extends KlasaClient {
  starbound = new StarboundService(this)

  constructor() {
    super({
      fetchAllMembers: true,
      prefix: '>',
      commandEditing: true,
      commandLogging: true,
      owners: [OWNER_ID],
      production: NODE_ENV === 'production',
      readyMessage: client =>
        `Successfully initialized. Ready to serve ${client.guilds.size} guilds.`,
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
