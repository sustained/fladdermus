import { Language, LanguageStore, LanguageOptions, util } from 'klasa'
import { MessageEmbed } from 'discord.js'
import createStarboundTemplate from '../libraries/templates/StarboundTemplate'

// TODO: We can't make this one file a `.ts` file because
// it causes problems with the typings.
// TODO: It's not ideal that the language stuff is interspersed with embed-related
// code, if necessary we can move the strings themselves to their own file?
export default class LanguageEnUS extends Language {
  constructor(
    store, //: LanguageStore,
    file, //: string[],
    directory, //: string,
    options //: LanguageOptions
  ) {
    super(store, file, directory, options)

    this.language = {
      INHIBITOR_EXCLUSIVE_COMMAND_NOTICE: (cmdName, guildNames) =>
        new MessageEmbed().setDescription(
          `Sorry but the \`${cmdName}\` command is exclusive to the following guild(s):\n\n${guildNames
            .map(name => `- ${name}`)
            .join(', ')}
          `
        ),
      INHIBITOR_EXCLUSIVE_SUBCOMMAND_NOTICE: (cmdName, guildNames) =>
        new MessageEmbed().setDescription(
          `Sorry but the \`${cmdName}\` command is exclusive to the following guild(s):\n\n${guildNames
            .map(name => `- ${name}`)
            .join(', ')}
          `
        ),
      STARBOUND_START_ALREADY_RUNNING: () =>
        createStarboundTemplate()
          .setColor('RED')
          .setDescription(
            'The Starbound server is already online (or booting up)!'
          ),
      STARBOUND_START_SUCCESS: () =>
        createStarboundTemplate()
          .setColor('GREEN')
          .setDescription('The Starbound server is now booting up.'),
      STARBOUND_START_FAILURE: () =>
        createStarboundTemplate()
          .setColor('RED')
          .setDescription('The Starbound server could not be started!'),
      STARBOUND_STOP_SUCCESS: () =>
        createStarboundTemplate()
          .setColor('GREEN')
          .setDescription('The Starbound server has been stopped!'),
      STARBOUND_STOP_FAILURE: message =>
        createStarboundTemplate()
          .setColor('RED')
          .setDescription('The Starbound server could not be started. :('),
      STARBOUND_NO_PERMISSION: action =>
        createStarboundTemplate()
          .setColor('RED')
          .setDescription(
            `Sorry, you don't have permission to ${action} the server.`
          ),
      STARBOUND_AUTH_USER_REQUIRED: action =>
        createStarboundTemplate()
          .setColor('ORANGE')
          .setDescription(`You need to specify a valid user to (de)authorise.`),
      STARBOUND_AUTH_FAILURE: action =>
        createStarboundTemplate()
          .setColor('RED')
          .setDescription(`You do not have permission to (de)authorise users.`),
      STARBOUND_AUTH_SUCCESS: (member, action) =>
        createStarboundTemplate()
          .setColor('GREEN')
          .setDescription(
            `Succcessfully ${
              action === 'add' ? 'authorised' : 'deauthorised'
            } ${member}!`
          ),
    }
  }

  async init() {
    await super.init()
  }
}
