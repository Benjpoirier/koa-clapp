import MainController from './mainController';

export default class AppController extends MainController {
    async index() {
        const { version, appName } = this.config;

        this.success({
            appName,
            version,
        });
    }
}
