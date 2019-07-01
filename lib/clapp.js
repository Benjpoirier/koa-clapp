const cluster = require('cluster');
const os = require('os');
const path = require('path');
const http = require('http');
const KoaRouter = require('koa-router');
const CoreApp = require('./coreApp');

module.exports = class App extends CoreApp {
    constructor(options) {
        super(options);
    }

    async run(options) {
        try {
            if (options) {
                for (const dependency of options.dependencies) {
                    await dependency();
                }
            }
            this._mountCustomMiddlewares();
            return this._serverListen();
        } catch (error) {
            this.logger.error(error);
        }
    }

    _mountCustomMiddlewares() {
        this.middleware = [...this.customMiddlewares, ...this.middleware, this._mountRoutes()];
    }

    _mountRoutes() {
        // inject routes from app with koarouer and controller
        const router = new KoaRouter();
        const module = require(path.join(this.srcPath, '/src/router'));
        const loadRoutes = module.default /* istanbul ignore next */ || module;
        loadRoutes({
            router,
            routes: this.routes,
            controllers: this.controllers,
        });
        return router.middleware();
    }

    _serverListen() {
        /* istanbul ignore if */
        if (cluster.isMaster && process.env.NODE_ENV === 'production') {
            os.cpus().forEach(() => cluster.fork());

            cluster.on('online', worker =>
                this.logger.info(`Worker ${worker.process.pid} online.`),
            );
            cluster.on('message', message => this.logger.info(message));
            cluster.on('exit', (worker, signal) => {
                this.logger.info(
                    `Worker ${worker.process.pid} died (signal: ${signal}). Restarting...`,
                );
                cluster.fork();
            });
        } else {
            const server = http.createServer(this.callback()); //create server with koa callback
            if (this.config.sockets) {
                this.io = require('socket.io')(server);
            }
            return this.listen(this.config.port, () =>
                this.logger.info(`${this.config.appName} - ${this.config.version}`),
            );
        }
    }
};

module.exports.CoreController = require('./coreController');
