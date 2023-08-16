module.exports.getCommandLineArgument = (argName) => {
  const argIndex = process.argv.indexOf(argName);

  if (argIndex !== -1 && argIndex + 1 < process.argv.length) {
    return process.argv[argIndex + 1];
  }

  return null;
};
