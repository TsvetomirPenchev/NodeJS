module.exports.getCommandLineArgument = (argName) => {
  const pattern = `--${argName}=`;
  const regex = new RegExp(pattern);
  const argument = process.argv.slice(2).filter((item) => regex.test(item));

  if (argument.length > 0) {
    return argument[0].replace(pattern, '');
  }

  return null;
};
