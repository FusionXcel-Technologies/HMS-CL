const { make_func_file } = require("../../../../modules/database/make_model");
const moduleAddr = './apps/modules/inventory management/fields/crud';



class FieldModel {

    constructor() {
        // this.moduleAddr = moduleAddr;
        this.modelAddr = 'inventory/field'
        this.modelName = 'Field';

        this.modelData = [
            { key: 'added_by', type: 'string' },
            { key: 'parent', type: 'string' },
            { key: 'index', type: 'string' },
            { key: 'name', type: 'string', required: true },
            { key: 'type', type: 'string' },
            { key: 'value', type: 'string' },
        ];

        this.initialize();
        // this.funcs = require('./crud/inventory/item/item/func');
    }

    async initialize() {
        this.model = await make_func_file(`${moduleAddr}/${this.modelAddr}`, this.modelName, this.modelData).then((res) => {
        });
    }
};

class FieldModelCache {

    constructor() {
        // this.moduleAddr = moduleAddr;
        this.modelAddr = 'inventory/field/cache'
        this.modelName = 'FieldCache';

        this.modelData = [
            { key: 'added_by', type: 'string' },
            { key: 'parent', type: 'string' },
            { key: 'index', type: 'string' },
            { key: 'name', type: 'string', required: true },
            { key: 'type', type: 'string' },
        ];

        this.initialize();
        // this.funcs = require('./crud/inventory/item/item/func');
    }

    async initialize() {
        this.model = await make_func_file(`${moduleAddr}/${this.modelAddr}`, this.modelName, this.modelData).then((res) => {
        });
    }
}


exports.FieldModel = new FieldModel();
exports.FieldModelCache = new FieldModelCache();
