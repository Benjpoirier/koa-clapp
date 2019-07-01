import compress from 'koa-compress';
import cors from 'kcors';
import etag from 'koa-etag';
import helmet from 'koa-helmet';
import Clapp from 'koa-clapp';

import logger from './helpers/logger';

const app = new Clapp({
    appName: 'simple-api',
    version: '1.0.0',
    port: 3000,
    socket: true,
    logging: true,
    errors: true,
    logger,
});

app.use(cors({ exposeHeaders: ['Content-Disposition'] }))
    .use(compress())
    .use(etag())
    .use(helmet());

app.run();

