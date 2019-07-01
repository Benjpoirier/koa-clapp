const koaLogger = require('koa-logger');

module.exports = logger =>
    koaLogger((str, args) => {
        const log = args[3] >= 400 ? logger.error : logger.info;
        log(str.trim());
    });
