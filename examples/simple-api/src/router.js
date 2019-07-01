export default app => {
    const { router, routes, controllers } = app;

    router.get('/', controllers.App.index);
    router.use(routes.user('/users'));
};
