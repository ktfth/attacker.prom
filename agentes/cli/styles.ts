import chalk from 'chalk';

export const styles = {
  header: (text: string) => chalk.bold.blue(text),
  success: (text: string) => chalk.green(text),
  error: (text: string) => chalk.red(text),
  warning: (text: string) => chalk.yellow(text),
  info: (text: string) => chalk.cyan(text),
  highlight: (text: string) => chalk.magenta(text),
  
  box: (title: string, content: string) => {
    const line = '─'.repeat(50);
    return `
${chalk.blue('┌' + line + '┐')}
${chalk.blue('│')} ${chalk.bold.white(title.padEnd(48))} ${chalk.blue('│')}
${chalk.blue('├' + line + '┤')}
${content.split('\n').map(l => `${chalk.blue('│')} ${l.padEnd(48)} ${chalk.blue('│')}`).join('\n')}
${chalk.blue('└' + line + '┘')}
    `;
  }
};

export const banner = `
${chalk.yellow('█▀▄▀█ █▀▀ █▀ ▀█▀ █▀█ █▀▀')}
${chalk.yellow('█ ▀ █ ██▄ ▄█  █  █▀▄ ██▄')}
${chalk.gray('Alavancagem Digital para Negócios Reais')}
`;
