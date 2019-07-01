export default app => {
    const { router, controllers } = app;

    router.get('/', controllers.Post.index);
};
