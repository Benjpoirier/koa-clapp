import anonymizer from './anonimizer';
import MainController from '../mainController';

export default class PostController extends MainController {
    async index() {
        const data = [
            {
                author: 'Mike Casey',
                content:
                    'Dolor consequat esse consectetur do do sint cillum enim magna est consequat voluptate. Id dolor consequat reprehenderit magna aliquip adipisicing. Minim et commodo cupidatat adipisicing aliqua tempor proident nisi dolore Lorem. Enim officia est reprehenderit amet mollit nisi consequat. Dolore sint deserunt labore laborum esse laboris sint laborum commodo. Duis magna veniam ea laborum laborum.',
            },
            {
                author: 'Daniel Howell',
                content:
                    'Dolor consequat esse consectetur do do sint cillum enim magna est consequat voluptate. Id dolor consequat reprehenderit magna aliquip adipisicing. Minim et commodo cupidatat adipisicing aliqua tempor proident nisi dolore Lorem. Enim officia est reprehenderit amet mollit nisi consequat. Dolore sint deserunt labore laborum esse laboris sint laborum commodo. Duis magna veniam ea laborum laborum.',
            },
        ];
        this.success(anonymizer(data));
    }
}
