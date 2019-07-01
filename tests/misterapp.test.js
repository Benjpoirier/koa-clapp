import request from 'supertest';

import Clapp from '../lib/clapp';

describe('should test Clapp', () => {
    let app, config, inst;

    beforeEach(() => {
        config = {
            port: 3002,
            appName: 'jest test',
            version: '1.0.0',
            logging: true,
            errors: true,
            sockets: false,
        };
        app = new Clapp(config);
    });

    afterEach(() => {
        if (inst) {
            inst.close();
        }
        app = null;
    });

    it('should instantiate the app correclty', () => {
        expect(app.config).toEqual({
            port: 3002,
            appName: 'jest test',
            version: '1.0.0',
            sockets: false,
        });
        expect(app.controllers.App).toBeDefined();
    });

    it('should mapp controllers based on controllers folder', () => {
        const keys = Object.keys(app.controllers.App);
        const values = Object.values(app.controllers.App);

        expect(keys).toEqual(['delete', 'index', 'show', 'create']);

        values.forEach(value => {
            expect(value.constructor.name).toEqual('Function');
        });
    });

    it('get on / should return the configuration and the data injected by the after action', async () => {
        inst = await app.run();
        const { port, logging, errors, sockets, ...rest } = config; // eslint-disable-line no-unused-vars

        await request(inst)
            .get('/')
            .type('json')
            .expect(200)
            .expect({
                data: rest,
                injected: 'injected content',
            });
    });

    it('get on /404 should return a 404', async () => {
        inst = await app.run();

        await request(inst)
            .get('/404')
            .type('json')
            .expect(404);
    });

    it('should run the before action and throw an error', async () => {
        inst = await app.run();

        await request(inst)
            .get('/show')
            .type('json')
            .expect(500);
    });

    it('should throw an error because of method is not an async function', async () => {
        inst = await app.run();

        await request(inst)
            .post('/create')
            .type('json')
            .expect(404);
    });

    it('should call controller.User.index without calling any before or after action', async () => {
        inst = await app.run();

        await request(inst)
            .get('/users')
            .type('json')
            .expect(404);
    });

    it('should call controller.Post.index', async () => {
        inst = await app.run();

        await request(inst)
            .get('/posts')
            .type('json')
            .expect(200)
            .expect({
                data: [
                    {
                        author: 'Mike C',
                        content:
                            'Dolor consequat esse consectetur do do sint cillum enim magna est consequat voluptate. Id dolor consequat reprehenderit magna aliquip adipisicing. Minim et commodo cupidatat adipisicing aliqua tempor proident nisi dolore Lorem. Enim officia est reprehenderit amet mollit nisi consequat. Dolore sint deserunt labore laborum esse laboris sint laborum commodo. Duis magna veniam ea laborum laborum.',
                    },
                    {
                        author: 'Daniel H',
                        content:
                            'Dolor consequat esse consectetur do do sint cillum enim magna est consequat voluptate. Id dolor consequat reprehenderit magna aliquip adipisicing. Minim et commodo cupidatat adipisicing aliqua tempor proident nisi dolore Lorem. Enim officia est reprehenderit amet mollit nisi consequat. Dolore sint deserunt labore laborum esse laboris sint laborum commodo. Duis magna veniam ea laborum laborum.',
                    },
                ],
            });
    });

    it('should run with working dependencies', async () => {
        const dependencies = [
            async () => new Promise(resolve => setTimeout(() => resolve(), 400)),
            async () => {},
        ];

        app = new Clapp({ ...config, sockets: true });
        inst = await app.run({ dependencies });

        expect(inst).toBeDefined();
    });

    it('should not run with broken dependencies', async () => {
        const dependencies = [
            () =>
                new Promise((resolve, reject) => {
                    setTimeout(() => {
                        reject('error');
                    }, 400);
                }),
            async () => {},
        ];
        app = new Clapp({ ...config, sockets: true });
        inst = await app.run({ dependencies });

        expect(inst).not.toBeDefined();
    });

    it('should run with sockets and logger', async () => {
        app = new Clapp({ ...config, sockets: true });
        inst = await app.run();

        expect(app.io).toBeDefined();
    });
});
