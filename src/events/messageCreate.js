const prefix = '!';
const { getMatchingCommands, formatAutocompleteMessage } = require('../utils/autocomplete');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const partialCommand = args[0].toLowerCase();

    // Get list of command objects from client.commands (must be a Collection or Map)
    const commandsList = [...client.commands.values()].map(cmd => ({
      name: cmd.name,
      description: cmd.description || ''
    }));

    // If user is still typing (only one arg present) show autocomplete suggestions
    if (args.length === 1 && partialCommand.length > 0) {
      const matchingCommands = getMatchingCommands(commandsList, partialCommand);

      if (matchingCommands.length > 0) {
        // Send autocomplete suggestions
        const reply = formatAutocompleteMessage(matchingCommands);
        // Reply without pinging user
        message.channel.send(reply).then(msg => {
          // Delete the suggestion message after 10 seconds to avoid clutter
          setTimeout(() => msg.delete().catch(() => {}), 10000);
        });
      }
      return; // don't run commands while showing suggestions
    }

    // Normal command execution below, e.g:
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply('There was an error executing that command.');
    }
  }
};
