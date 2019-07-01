import { CoreController } from 'koa-clapp';

export default class MainController extends CoreController {
    success(data) {
        this.ctx.body = {
            data,
        };
        this.ctx.status = 200;
    }
}
