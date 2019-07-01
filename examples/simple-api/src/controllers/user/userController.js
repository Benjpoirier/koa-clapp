import MainController from '../mainController';

export default class UserController extends MainController {
    async index() {
        this.success([
            {
                name: 'Hilda Daniels',
            },
            {
                name: 'Katherine Lowe',
            },
        ]);
    }
}
