const Koa = require('koa');
const path = require('path');
const fs = require('fs');
const koaRouter = require('koa-router');
const loggerMiddleware = require('./loggerMiddleware');
const errorMiddleware = require('./errorMiddleware');

module.exports = class CoreApp extends Koa {
    constructor(options) {
        super();
        const config = {
            appName: 'clapp',
            version: '1.0.0',
            port: 3000,
            sockets: false,
            logging: false,
            logger: console,
            errors: false,
            ...options,
        };
        this._initConfig(config);
        this._initControllers();
        this._initRoutes();
    }

    _initConfig({ logger, logging, errors, ...config }) {
        this.logger = logger;
        this.customMiddlewares = Object.values({
            loggerMiddleware: logging && loggerMiddleware(this.logger),
            errorMiddleware: errors && errorMiddleware,
        }).filter(middleware => middleware);
        this.config = config;
        this.srcPath = path.dirname(require.main.filename); //get Path from import
        this.controllers = {};
        this.routes = {};
    }

    _initControllers(folderPath = path.join(this.srcPath, '/src/controllers')) {
        const items = fs.readdirSync(folderPath).filter(item => item !== 'mainController.js');

        items.forEach(item => {
            const stats = fs.statSync(`${folderPath}/${item}`);

            if (stats.isDirectory()) {
                this._initControllers(`${folderPath}/${item}`);
            } else if (item.endsWith('Controller.js')) {
                this._controllerMapping(folderPath, item);
            }
        });
    }

    _controllerMapping(folderPath, file) {
        const filePath = path.join(folderPath, file); // get controller path from controller folder
        const module = require(filePath);
        const controller = module.default /* istanbul ignore next */ || module;
        const controllerName = controller.name.replace('Controller', '');

        // get methods name from the controller without making an instance
        const methods = Object.getOwnPropertyNames(
            Object.getOwnPropertyDescriptors(controller).prototype.value,
        );
        const actions = {
            beforeAction: !!methods.find(method => method.toLowerCase() === 'beforeaction'),
            afterAction: !!methods.find(method => method.toLowerCase() === 'afteraction'),
        };
        //Expose only public methods and create a koa callback with ctx.
        this.controllers[controllerName] = methods
            .filter(
                name =>
                    !['constructor', 'beforeAction', 'afterAction'].includes(name) &&
                    !name.startsWith('_'),
            )
            .reduce(this._controllerMethodsMapping(controller, controllerName, actions), {});
    }

    _controllerMethodsMapping(controller, controllerName, actions) {
        return (accumulator, method) => {
            accumulator[method] = async ctx => {
                const instance = new controller({
                    ctx,
                    config: this.config,
                    io: this.io,
                    logger: this.logger,
                });

                if (actions.beforeAction) {
                    await instance.beforeAction(method);
                }

                await instance[method]();

                if (actions.afterAction) {
                    await instance.afterAction(method);
                }
            };
            return accumulator;
        };
    }

    _initRoutes(folderPath = path.join(this.srcPath, '/src/routes')) {
        /* istanbul ignore else */
        if (fs.existsSync(folderPath)) {
            const items = fs.readdirSync(folderPath);
            const routeFileEnd = 'Routes.js';
            const routeMiddlewareFileEnd = 'RoutesMiddleware.js';
            items.forEach(item => {
                const stats = fs.statSync(`${folderPath}/${item}`);
                /* istanbul ignore else */
                if (stats.isDirectory()) {
                    this._initRoutes(`${folderPath}/${item}`);
                } else if (item.endsWith(routeFileEnd)) {
                    this._routerMapping(folderPath, item, routeFileEnd);
                } else if (item.endsWith(routeMiddlewareFileEnd)) {
                    this._routerMapping(folderPath, item, routeMiddlewareFileEnd);
                }
            });
        }
    }

    _routerMapping(folderPath, file, fileEnd) {
        const filePath = path.join(folderPath, file); // get routes path from controller folder
        const module = require(filePath);
        const route = module.default /* istanbul ignore next */ || module;
        const name = file.replace(fileEnd, '');
        const routeName = fileEnd === 'Routes.js' ? name : `${name}Middleware`;

        this.routes[routeName] = prefix => {
            const router = new koaRouter();
            router.prefix(prefix);
            route({ controllers: this.controllers, router, routes: this.routes, prefix });
            return router.middleware();
        };
    }
};
