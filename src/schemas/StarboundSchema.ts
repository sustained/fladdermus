import { Client } from 'klasa'

Client.defaultUserSchema.add('starbound', folder => {
  return folder
    .add('chatColour', 'string', { default: 'RANDOM' })
    .add('playerName', 'string')
    .add('accountName', 'string')
    .add('statistics', stats => {
      return stats
        .add('lastLogin', 'integer', { configurable: false, default: 0 })
        .add('totalLogins', 'integer', { configurable: false, default: 0 })
        .add('minutesPlayed', 'integer', { configurable: false, default: 0 })
    })
})

Client.defaultClientSchema.add('starbound', starbound => {
  return starbound
    .add('autoStart', 'boolean', { default: false })
    .add('autoRestart', 'boolean', { default: false })
    .add('enabledEvents', 'string', {
      default: ['join', 'part', 'chat', 'start', 'stop'],
      array: true,
    })
    .add('queueMessages', 'boolean', { default: false })
    .add('authorisedUsers', 'user', { array: true })
})
