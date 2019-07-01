export default app => {
    const { router, routes, controllers } = app;

    router.get('/', controllers.User.index);

    router.use(routes.documentMiddleware('/:userId/documents'));
};
