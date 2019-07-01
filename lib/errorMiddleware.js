module.exports = async (ctx, next) => {
    try {
        await next();

        if (ctx.status >= 404) {
            ctx.throw(404);
        }
    } catch (error) {
        const { message, status = 500 } = error;

        ctx.status = status;
        ctx.body = {
            error: {
                code: status,
                message,
            },
        };
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'test') {
            ctx.app.emit('error', error, ctx);
        }
    }
};
