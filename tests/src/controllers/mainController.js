import { CoreController } from '../../../lib/clapp.js';

export default class MainController extends CoreController {
    success(data) {
        this.ctx.body = {
            data,
        };
        this.ctx.status = 200;
    }

    failure() {
        this.ctx.status = 404;
    }
}
