module.exports = class CoreController {
    constructor(args) {
        Object.entries(args).forEach(([name, func]) => {
            this[name] = func;
        });
    }
};
