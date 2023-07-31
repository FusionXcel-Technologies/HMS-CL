const { make_func_file } = require("../../../../modules/database/make_model");
const moduleAddr = './apps/modules/inventory management/items/crud';


class ItemModel {

    constructor() {
        // this.moduleAddr = moduleAddr;
        this.modelAddr = 'inventory/item'
        this.modelName = 'item';

        this.modelData = [
            { key: 'name', type: 'string', required: true },
            { key: 'category', type: 'string' },
            { key: 'price', type: 'string' },
            { key: 'location', type: 'string' },
            { key: 'fields', type: 'string' },
        ];

        this.initialize();
        this.funcs = require('./crud/inventory/item/item/func');
    }

    async initialize() {
        this.model = await make_func_file(`${moduleAddr}/${this.modelAddr}`, this.modelName, this.modelData).then((res) => {
        });
    }
}




exports.ItemModel = new ItemModel();
