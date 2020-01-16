import { Client } from 'klasa'

Client.defaultUserSchema.add('starbound', folder => {
  return folder
    .add('chatColour', 'string', { default: 'RANDOM' })
    .add('playerName', 'string')
    .add('accountName', 'string')
    .add('statistics', stats => {
      return stats
        .add('totalLogins', 'integer', { configurable: false, default: 0 })
        .add('minutesPlayed', 'integer', { configurable: false, default: 0 })
    })
})

Client.defaultClientSchema.add('starbound', starbound => {
  return starbound
    .add('autoStart', 'boolean', { default: false })
    .add('autoRestart', 'boolean', { default: false })
})
