Clapp is built arround koa js, it means that all features you are used to with Koa can be implemented without any changes.
it's purpose is to offer :
- Pre-configured package with `koa-router` and `koa-logger`
- A fixed way to organize our code taking advantage of `class` and heritage.
- A small layer above `koa-router`
- Few optionals built-in features (socketIo, loggerMiddleware, errorMiddleware) which can be use with correct clapp config

# Installation and requirements

Miserapp works well with or without `babel`, but needs at least a quite recent node version to support `class`

You should first start by experiencing our `clapp-starter`
```shell
> git clone git@github.com:benjpoirier/koa-clapp-starter.git
> cd koa-clapp-starter
> rm -rf .git
```

# Getting Started

## Quick folder structure overview

```
clapp-starter
└───src
│   └───controllers
│   │   ├── appController.js
│   │   └── mainController.js
│   ├─── router.js
│   └─── main.js
├─── index.js
├─── nodemon.json
├─── package-lock.json
└─── package.json
```

You can start the example by moving inside clapp-starter and using `npm ci` and `npm start`

## Quick code overview

router.js
```js
module.exports = app => {
    const { router, controllers } = app;

    router.get('/', controllers.App.index);
};

```

router.js takes `app` as parameter which exposes`router`, `controllers` and `routes` (read router section)
The app parameter exposes a list of our controllers. In this case you have a controller named `appController` with a class `AppController` and a method `index`. It will expose an object like :
```js
controller: {
    App: {
        index: [Function]
    }
}
```

!> Important: read controller section

You can access http://localhost:3000/ which exposesan endpoint the name and the version of you app.

## let start coding
router.js
```js
module.exports = app => {
    const { router, controllers } = app;

    router.get('/', controllers.App.index);
    router.get('/users', controllers.User.index);
};

```
and a new controller `src/controllers/userController.js`

```js
const MainController = require('./mainController');

module.exports = class UserController extends MainController {
    async index() {
        // this.success is declared on MainController
        this.success([
            {
                name: "Hulda Robinson"
            },
            {
                name: "Sadie Fox"
            }
        ]);
    }
};

```

You can access http://localhost:3000/users which exposesan endpoint with users.
that's it. :)

# Go deeper

## Clapp config

| Name         | Type      | Default      | Required | Description                                                                                                   |
| ------------ | --------- | ------------ | :------: | ------------------------------------------------------------------------------------------------------------- |
| `appName`    | `string`  | `clapp`  | ✕        | Name                                                                                                          |
| `version`    | `string`  | `1.0.0`      | ✕        | version                                                                                                       |
| `port`       | `number`  | `3000`       | ✕        | port                                                                                                          |
| `sockets`    | `boolean` | `false`      | ✕        | expose `this.io` on controllers using socker.io                                                               |
| `logging`    | `boolean` | `false`      | ✕        | enable logs with internal middleware                                                                          |
| `errors`     | `boolean` | `false`      | ✕        | enable catch errors with internal middleware                                                                  |
| `logger`     | `Logger`  | `console`    | ✕        | logging library which can expose `warn`, `error` and `info` methods (for example native `console`object or winston)     |

## Clapp run

```js
const Clapp = require('koa-clapp');
const options = require('./options');
const app = new Clapp()

app.run(options)

```
options parameter is an optional object.

| key              | value                                        | Description                                 |
| ---------------- | -------------------------------------------- | ------------------------------------------- |
| `dependencies`   | `Array<AsyncFunction>` or `Array<Function>`  | Iterative execution of functions wrapped arround a try catch             |


## Controllers

Controllers are automatically mapped to expose methods, but there are somes exceptions:
- `constructor`
- `beforeAction`
- `afterAction`
- all methods started by `_` (naming convention for private methods)

Clapp will create a mapping based on filename (except `mainController.js`) and controller name so be careful.
Let's assume that you have :
```
└───controllers
│   │   ├── appController.js
│   │   └── otherFile.js
```
`otherFile.js` will not be mapped and exposed on router.
appController.js must have an exported class named `AppController`, it's will expose an `App` controllers object.

> Clapp will map controllers on folers too ex: `/controllers/user/userController.js`

### BeforeAction and AfterAction

If you declare a `beforeAction` method on your controller it will be executed before any route is called.
if you declare a `afterAction` method on your controller it will be executed after any route is called.

```js
// let's assume that index is called by the router
async beforeAction(method) {
    console.log('before', method)
    // code
}
async afterAction(method) {
    console.log('after', method)
    // code
}
async index() {
    console.log('method index')
    // code
}

```
will print
```bash
> before index
> method index
> after index
```

## Router

The basic usage of `router.js` is explained above.
If you need nested routes you can create a `routes` folder

```

├───controllers
│   ├── appController.js
│   └── mainController.js
├───routes
│    ├── document
│    │   ├── documentRoutesMiddleware.js
│    │   └── documentRoutes.js
│    ├── postRoutes
│    ├── userRoutes.js
├─── router.js
└─── main.js
```
router.js
```js
module.exports = app => {
    const { router, routes, controllers } = app;

    router.get('/', controllers.App.index);
    router.use(routes.document('/documents')); // '/documents' is the route prefix (see koa router)
    router.use(routes.user('/users')); // '/users' is the route prefix (see koa router)
    routre.use(routes.post('/posts'))// '/post' is the route prefix (see koa router)
};
```
routes/postRoutes.js
```js
module.exports = app => {
    const { router, controllers } = app;

    router.get('/', controllers.Post.index); // http://localhost:3000/posts
};
```
routes/userRoutes.js
```js
module.exports = app => {
    const { router, routes, controllers } = app;

    router.get('/', controllers.User.index); // http://localhost:3000/users
    router.use(routes.documentMiddleware('/:userId/documents')) // http://localhost:3000/users/0c16e9cd-76bd-562b-a978-1c9cef51f62e/documents
};
```
routes/document/documentRoutes.js
```js
module.exports = app => {
    const { router, controllers } = app;

    router.get('/', controllers.Document.index); // http://localhost:3000/documents
};
```
routes/document/documentRoutesMiddleware.js
```js
module.exports = app => {
    const { router, controllers } = app;

    router.get('/', controllers.DocumentMiddleware.index); // http://localhost:3000/users
    router.use(routes.documentMiddleware('/:userId/documents')) // http://localhost:3000/users/0c16e9cd-76bd-562b-a978-1c9cef51f62e/documents
};
```
routes object:
```js
routes: {
    user:[Function], // userRoutes.js
    post: [Function], // postRoutes.js
    document: [Function], // documentRoutes.js
    documentMiddleware: [Function] // documentRoutesMiddleware.js
}
```
!> file name is important
