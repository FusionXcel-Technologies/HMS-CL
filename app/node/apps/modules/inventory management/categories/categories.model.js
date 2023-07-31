const { make_func_file } = require("../../../../modules/database/make_model");
const moduleAddr = './apps/modules/inventory management/categories/crud';


class CategoryModel {

    constructor() {
        // this.moduleAddr = moduleAddr;
        this.modelAddr = 'inventory/category'
        this.modelName = 'category';

        this.modelData = [
            { key: 'name', type: 'string', required: true },
            { key: 'category', type: 'string' }
        ];

        //this.initialize();
        this.funcs = require('./crud/inventory/category/category/func');
    }

    async initialize() {
        this.model = await make_func_file(`${moduleAddr}/${this.modelAddr}`, this.modelName, this.modelData).then((res) => {
        });
    }
}

exports.CategoryModel = new CategoryModel();
