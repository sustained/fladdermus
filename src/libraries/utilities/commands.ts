import { Command } from 'klasa'

/**
 * Return the valid subcommands for a command.
 *
 * @param {Command} command
 */
export function getSubCommands(command: Command): string[] {
  if (!command.subcommands) {
    return []
  }

  return command.usage.parsedUsage.reduce((subcommands, tag) => {
    subcommands.push(...tag.possibles.map(possible => possible.name))
    return subcommands
  }, [])
}
