import MainController from './mainController';

export default class AppController extends MainController {
    async beforeAction(method) {
        if (method === 'show') {
            throw new Error('beforeAction');
        }
    }

    async afterAction(method) {
        if (method === 'index') {
            this.ctx.body.injected = 'injected content';
        }
    }

    async delete() {
        this.ctx.status = 204;
    }

    async index() {
        const { version, appName } = this.config;

        this.success({
            appName,
            version,
        });
    }

    async show() {
        this.ctx.body = 'bad request';
    }

    create() {}
}
