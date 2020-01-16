/**
 * Return the valid subcommands for a command.
 *
 * @param {Command} command
 */
export function getSubCommands(command) {
  if (!command.subcommands) {
    return []
  }

  return command.usage.parsedUsage.map(tag =>
    tag.possibles.map(possible => possible.name)
  )
}
