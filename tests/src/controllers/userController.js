import MainController from './mainController';

export default class UserController extends MainController {
    async index() {
        await new Promise(resolve => setTimeout(resolve, 3000));
        this.failure();
    }
}
