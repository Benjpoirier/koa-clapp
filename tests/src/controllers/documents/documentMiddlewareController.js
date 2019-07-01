import { CoreController } from '../../../../lib/clapp.js';

export default class DocumentControllerMiddleware extends CoreController {
    index() {
        this.success([
            {
                name: 'docA.pdf',
            },
        ]);
    }
}
