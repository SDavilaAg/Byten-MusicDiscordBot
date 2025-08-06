function getMatchingCommands(commandsList, partial) {
  if (!partial) return [];
  partial = partial.toLowerCase();
  return commandsList.filter(cmd => cmd.name.startsWith(partial));
}

function formatAutocompleteMessage(commands) {
  if (commands.length === 0) return 'No matching commands found.';
  return '🔎 Did you mean:\n' + commands
    .slice(0, 5) // limit suggestions to 5
    .map(cmd => `• **${cmd.name}**: ${cmd.description || 'No description'}`)
    .join('\n');
}

module.exports = {
  getMatchingCommands,
  formatAutocompleteMessage
};
