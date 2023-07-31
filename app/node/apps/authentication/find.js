const { can_acces } = require("./access");
const { dehashingFunction, hashingFunction } = require("./bcrypt");
const { AccountModel, RoleModel, ActionModel } = require("./model");

exports.viewUser = async (req, res) => {
    if (!req.params.id) {
        return res.status(401).send({ common: { message_type: 'error', message: "user id not found" } });
    };
    let id = dehashingFunction(req.params.id, 54);
    console.log('user_id: ', id);
    if ((typeof (id) != 'number') || (id % 1 != 0)) {
        return res.status(401).send({ common: { message_type: 'error', message: "invalid user id" } });
    };

    let user = await AccountModel.funcs.getById(id);
    if (!user.completed) {
        return res.status(401).send({ common: { message_type: 'error', message: "user not found" } });
    };
    user.data.password = undefined;
    return res.status(200).send(user.data);
}


exports.getUsersList = async (req, res) => {
    let can_access = await can_acces({ roles: 'superUser' }, req.user);

    if (can_access != true) {
        return res.status(401).send({ message: `you're not authorized to do this` });
    };

    let users_list = await AccountModel.funcs.getAll();

    if (!users_list.completed) {
        return res.status(500).send({ message: `somethig went wrong` });
    }

    users_list = users_list.data;

    for (let index = 0; index < users_list.length; index++) {
        const user = users_list[index];

        users_list[index] = { id: hashingFunction(user.id, 11), name: user.name, contact_number: user.contact_number, age: user.age, roles: user.roles, created: user.createdAt, updated: user.updatedAt }
    }


    return res.status(200).send(users_list)
}
