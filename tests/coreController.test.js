const { CoreController } = require('../lib/clapp.js');

describe('CoreController', () => {
    it('should instanciate CoreController with params', () => {
        const params = {
            param1: 'value1',
            param2: 'value2',
        };
        const controller = new CoreController(params);
        expect(controller).toEqual(params);
    });
});
