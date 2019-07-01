import MainController from '../mainController';

export default class DocumentMiddlewareController extends MainController {
    async show() {
        this.success([
            {
                name: 'ID-Card.jpg',
                path: 'http://google.fr',
            },
        ]);
    }
}
