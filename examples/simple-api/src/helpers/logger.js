import chalk from 'chalk';
import { createLogger, format, transports } from 'winston';

export default createLogger({
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, timestamp }) => {
            const type = level === 'error' ? chalk.red('error') : chalk.yellow('info');

            return `${chalk.inverse(timestamp)} ${type} ${message}`;
        }),
    ),
    transports: [new transports.Console()],
});
