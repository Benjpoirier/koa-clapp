export default app => {
    const { router, routes, controllers } = app;

    router.get('/', controllers.App.index);
    router.get('/show', controllers.App.show);
    router.post('/create', controllers.App.create);

    router.use(routes.user('/users'));
    router.use(routes.post('/posts'));
};
