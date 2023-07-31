const { dehashingFunction, hashingFunction } = require("../../../authentication/bcrypt");
const { CategoryModel } = require("./categories.model");
const CategoryFuncs = CategoryModel.funcs;

exports.getCategoriesListArr = async () => {
    let categories = await CategoryFuncs.getAll();
    categories = categories.completed ? categories.data : [];
    // for (let index = 0; index < categories.length; index++) {
    //     const category = categories[index];
    //     let c = await CategoryFuncs.getById(category.category);
    //     categories[index].name = `${c.data?.name} > ${category.name}`.toLowerCase()
    // }
    return categories;
}

exports.createCategory = async (req, res) => {
    if (Object.keys(req.body).length < 1) {
        let categories = await this.getCategoriesListArr();
        let input_data = [
            { key: 'name', type: 'text', placeHolder: 'Name' },
            { key: 'category', type: 'select', multiple: false, placeHolder: 'Category', list: categories }
        ];
        return res.status(200).send({ input_data: input_data });
    } else {
        const data = {};

        for (let field of CategoryModel.modelData) {
            data[field.key] = req.body[field.key] || null;
            if (field.key == 'name' && req.body['category']) {
                let ct = await CategoryFuncs.getById(req.body['category']);
                data[field.key] = ct.data ? ct.data.name + ' > ' + req.body['name'] : req.body['name'];
            }
            if (field.required && !data[field.key]) {
                let err = {};
                err[field.key] = { message_type: 'error', message: `${field.key} shouldn't be empty` };
                return res.status(401).send(err);
            }
        }

        const createdData = await CategoryFuncs.create(data);
        return res.status(200).send(createdData);
    }
};

exports.getCategoriesList = async (req, res) => {
    let categorys_list = await CategoryFuncs.getAll();

    if (!categorys_list.completed) {
        return res.status(500).send({ message: `somethig went wrong` });
    }

    categorys_list = categorys_list.data;

    for (let index = 0; index < categorys_list.length; index++) {
        const category = categorys_list[index];
        category.id = hashingFunction(category.id, 338);
        let category_category_out_arr = '';
        let category_category_arr = category.category?.split(',') || [];
        for (let i = 0; i < category_category_arr.length; i++) {
            let cat = await CategoryModel.funcs.getById(category_category_arr[i]);
            if (cat.completed) {
                category_category_out_arr += category_category_out_arr == '' ? cat.data.name : ', ' + cat.data.name;
            }
        }
        category.category = category_category_out_arr;

        categorys_list[index] = category;
    };
    return res.status(200).send(categorys_list)
};

exports.viewCategory = async (req, res) => {
    if (!req.params.id) {
        return res.status(401).send({ common: { message_type: 'error', message: "id not found" } });
    }

    let id = dehashingFunction(req.params.id, 338);

    if (typeof (id) !== 'number' || id % 1 !== 0) {
        return res.status(401).send({ common: { message_type: 'error', message: "invalid id" } });
    }

    let category = await CategoryFuncs.getById(id);
    if (!category.completed) {
        return res.status(401).send({ common: { message_type: 'error', message: "not found" } });
    }

    return res.status(200).send(category.data);
};

exports.updateCategory = async (req, res) => {
    if (!req.params.id) {
        return res.status(401).send({ common: { message_type: 'error', message: "id not found" } });
    }
    let id = dehashingFunction(req.params.id, 338);
    if (typeof (id) != "number" && (id % 1 == 0)) {
        return res.status(401).send({ common: { message_type: 'error', message: "invalid id" } });
    }
    if (Object.keys(req.body).length < 1) {
        let categories = await this.getCategoriesListArr();
        let updateing_category = await CategoryFuncs.getById(id);
        let out_cat = [];
        categories = categories.map((val) =>
            val.id == updateing_category.data.id ? undefined : out_cat.push(val)
        );
        console.log('categories: ', categories);
        if (!updateing_category.completed) {
            return res.status(401).send({ common: { message_type: 'error', message: "invalid id" } });
        }

        let upt_category = async (id) => {
            let o = await CategoryFuncs.getById(id);
            return o.completed ? o.data.name : undefined;
        }



        let input_data = [
            { key: 'name', type: 'text', placeHolder: 'Name', value: updateing_category.data.name },
            { key: 'category', type: 'select', multiple: false, placeHolder: 'Category', list: out_cat, value: await upt_category(updateing_category.data.category) || 'Add Category' }
        ];
        return res.status(200).send({ input_data: input_data });
    } else {
        const categoryResult = await CategoryFuncs.getById(id);
        if (!categoryResult.completed) {
            return res.status(401).send({ common: { message_type: 'error', message: "Category not found" } });
        }
        const data = categoryResult.data;
        for (let field of CategoryModel.modelData) {
            if (req.body[field.key]) {
                data[field.key] = req.body[field.key] || undefined;
            }
            if (field.required && !data[field.key]) {
                let err = {};
                err[field.key] = { message_type: 'error', message: `${field.key} shouldn't be empty` };
                return res.status(401).send(err);
            }
        }
        const updatedData = await CategoryFuncs.update(id, data);
        return res.status(200).send(updatedData.data);
    }
};

exports.deleteCategory = async (req, res) => {
    if (!req.params.id) {
        return res.status(401).send({ common: { message_type: 'error', message: "id not found" } });
    }

    let id = dehashingFunction(req.params.id, 338);

    if (typeof (id) !== 'number' || id % 1 !== 0) {
        return res.status(401).send({ common: { message_type: 'error', message: "invalid id" } });
    }

    let category = await CategoryFuncs.delete(id);
    if (!category.completed) {
        return res.status(401).send({ common: { message_type: 'error', message: "not found" } });
    }

    return res.status(200).send(category.completed);
};
