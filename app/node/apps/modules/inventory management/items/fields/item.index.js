const { hashingFunction, dehashingFunction } = require("../../../../authentication");

const ItemFuncs = ItemFc;


exports.createItem = async (req, res) => {


    if (Object.keys(req.body).length < 1) {

        let input_data = [
            { key: 'name', type: 'text', placeHolder: 'Name' },
            { key: 'category', type: 'select_multiple', placeHolder: 'Category', list: [] },
            { key: 'price', type: 'text', placeHolder: 'Price' },
            { key: 'location', type: 'select', placeHolder: 'Select Location', list: [] }
        ];
        return res.status(200).send({ input_data: input_data });
    } else {
        const data = {};

        for (let field of ItemModel.modelData) {

            data[field.key] = req.body[field.key] || null;
            if (field.required && !(data[field.key])) {
                let err = {};
                err[field.key] = { message_type: 'error', message: `${field.key} shoudn't be empty` }
                return res.status(401).send(err)
            }
        };

        const createdData = await ItemFuncs.create(data);
        return res.status(200).send(createdData);
    }
};


exports.getItemsList = async (req, res) => {
    let items_list = await ItemFuncs.getAll();

    if (!items_list.completed) {
        return res.status(500).send({ message: `somethig went wrong` });
    }

    items_list = items_list.data;

    for (let index = 0; index < items_list.length; index++) {
        const item = items_list[index];
        item.id = hashingFunction(item.id);
        items_list[index] = item;
    };
    return res.status(200).send(items_list)
};

exports.viewItem = async (req, res) => {
    if (!req.params.id) {
        return res.status(401).send({ common: { message_type: 'error', message: "id not found" } });
    };
    let id = dehashingFunction(req.params.id);

    if ((typeof (id) != 'number') || (id % 1 != 0)) {
        return res.status(401).send({ common: { message_type: 'error', message: "invalid id" } });
    };

    let item = await ItemFuncs.getById(id);
    if (!item.completed) {
        return res.status(401).send({ common: { message_type: 'error', message: "not found" } });
    };
    item.data.password = undefined;
    return res.status(200).send(item.data);
};


exports.updateItem = async (req, res) => {

    if (Object.keys(req.body).length < 1) {
        let input_data = [
            { key: 'name', type: 'text', placeHolder: 'Name' },
            { key: 'category', type: 'select_multiple', placeHolder: 'Category', list: [] },
            { key: 'price', type: 'text', placeHolder: 'Price' },
            { key: 'location', type: 'select', placeHolder: 'Select Location', list: [] }
        ];
        return res.status(200).send({ input_data: input_data });
    } else {
        if (!req.body.item_id) {
            return res.status(401).send({ common: { message_type: 'error', message: "id Empty" } });
        }
        let id = dehashingFunction(req.body.item_id);

        const itemResult = await ItemFuncs.getById(id);
        if (!itemResult.completed) {
            return res.status(401).send({ common: { message_type: 'error', message: "Item not found" } });
        }
        const data = itemResult.data;

        for (let field of ItemModel.modelData) {
            if (req.body[field.key]) {
                data[field.key] = req.body[field.key] || undefined;
            };
            if (field.required && !(data[field.key])) {
                let err = {};
                err[field.key] = { message_type: 'error', message: `${field.key} shoudn't be empty` }
                return res.status(401).send(err)
            }
        }
        const updatedData = await ItemFuncs.update(id, data);
        return res.status(200).send(updatedData.data);
    }
};

exports.deleteItem = async (req, res) => {
    if (!req.params.id) {
        return res.status(401).send({ common: { message_type: 'error', message: "id not found" } });
    };
    let id = dehashingFunction(req.params.id);

    if ((typeof (id) != 'number') || (id % 1 != 0)) {
        return res.status(401).send({ common: { message_type: 'error', message: "invalid id" } });
    };

    let item = await ItemFuncs.delete(id);
    if (!item.completed) {
        return res.status(401).send({ common: { message_type: 'error', message: "not found" } });
    };

    return res.status(200).send(item.completed);
}