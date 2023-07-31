const { AccountModel } = require("./model");
const { sidebarConfig } = require("./sidebar");
const { createSuperUser, getRolesSelectList } = require("./role");
const { hashPassword, comparePassword, dehashingFunction, hashingFunction } = require("./bcrypt");
const { can_acces } = require("./access");
const { createAuthToken } = require("./jwt");

exports.signUp = async (req, res) => {
    try {
        const data = {};

        for (let field of AccountModel.modelData) {
            if (field.key == 'contact_number') {
                data[field.key] = req.body[field.key]?.replace(/\s/g, '') || null;
            } else {
                data[field.key] = req.body[field.key] || null;
            };
        }
        if (!data.password || !data.contact_number) {
            if (!data.password) {
                return res.status(401).send({ password: { message: "password shouldn't be empty" } });
            } else if (!data.contact_number) {
                return res.status(401).send({ contact_number: [{ message: "contact number shouldn't be empty" }] });
            }
        }

        const accountResult = await AccountModel.funcs.getByCondition({ contact_number: data.contact_number });
        console.log(accountResult);
        //console.log(accountResult);
        if (accountResult.completed) {
            return res.status(401).send({ contact_number: { message: "contact number alredy exists" } });
        }
        // Hash the password before saving
        const hashedPassword = await hashPassword(data.password || "default");
        data.password = hashedPassword;

        const createdData = await AccountModel.funcs.create(data);
        createdData.data.auth_token = await createAuthToken(createdData.data);

        if (createdData.data.id == 1) {
            let superUser = await createSuperUser();
            console.log(superUser);
        }
        return res.status(200).send(createdData.data);
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).send({ common: [{ message: "Internal Server Error" }] });
    }
};

exports.signIn = async (req, res) => {
    try {
        var { contact_number, password } = req.body;

        contact_number = contact_number?.replace(/\s/g, '') || null;

        const accountResult = await AccountModel.funcs.getByCondition({ contact_number: contact_number });

        if (!accountResult.completed || !accountResult.data) {
            console.log(`can't find account with contact number ${contact_number}`);
            return res.status(401).send({ common: [{ message: "Invalid credentials" }] });
        }

        const account = accountResult.data;
        const isPasswordValid = await comparePassword(password, account.password);

        if (!isPasswordValid) {
            return res.status(401).send({ common: [{ message: "Invalid credentials" }] });
        }
        const authToken = await createAuthToken(account);
        console.log('signin auth token: ', authToken);
        return res.status(200).send({ auth_token: authToken });
    } catch (error) {
        console.error("Sign in error:", error);
        return res.status(500).send({ common: [{ message: "Internal Server Error" }] });
    }
};

exports.createUser = async (req, res) => {
    let can_access = await can_acces({ roles: 'superUser' }, req.user);
    if (can_access != true) {
        return res.status(401).send({ message: `you're not authorized to do this` });
    };

    if (Object.keys(req.body).length < 1) {
        let roles_list = await getRolesSelectList();

        let input_data = [
            { key: 'name', type: 'text', placeHolder: 'Name' },
            { key: 'contact_number', type: 'tel', placeHolder: 'Contact Number' },
            { key: 'password', type: 'password', placeHolder: 'Password' },
            { key: 'age', type: 'number', placeHolder: 'Age' },
            { key: 'roles', type: 'select_multiple', placeHolder: 'Select Roles', list: roles_list }
        ];
        return res.status(200).send({ input_data: input_data });
    } else {
        const data = {};

        for (let field of AccountModel.modelData) {
            if (field.key == 'contact_number') {
                data[field.key] = req.body[field.key]?.replace(/\s/g, '') || null;
            } else {
                data[field.key] = req.body[field.key] || null;
            };

            if (field.required && !(data[field.key])) {
                let err = {};
                err[field.key] = { message_type: 'error', message: `${field.key} shoudn't be empty` }
                return res.status(401).send(err)
            };
        }
        if (!data.password || !data.contact_number) {
            if (!data.password) {
                return res.status(401).send({ password: { message_type: 'error', message: "password shouldn't be empty" } });
            } else if (!data.contact_number) {
                return res.status(401).send({ contact_number: [{ message_type: 'error', message: "contact number shouldn't be empty" }] });
            }
        }
        const accountResult = await AccountModel.funcs.getByCondition({ contact_number: data.contact_number });
        if (accountResult.completed) {
            return res.status(401).send({ contact_number: { message_type: 'error', message: "contact number alredy exists" } });
        }
        // Hash the password before saving
        const hashedPassword = await hashPassword(data.password || "default");
        data.password = hashedPassword;

        const createdData = await AccountModel.funcs.create(data);
        return res.status(200).send(createdData);
    }
}

exports.updateUser = async (req, res) => {
    let can_access = await can_acces({ roles: 'superUser' }, req.user);
    if (can_access != true) {
        return res.status(401).send({ message: `you're not authorized to do this` });
    };
    // console.log(Object.keys(req.body).length < 1);

    if (Object.keys(req.body).length < 1) {
        let roles_list = await getRolesSelectList();
        // console.log(roles_list);
        let input_data = [
            { key: 'name', type: 'text', placeHolder: 'Name' },
            { key: 'contact_number', type: 'tel', placeHolder: 'Contact Number' },
            { key: 'password', type: 'password', placeHolder: 'Password' },
            { key: 'age', type: 'number', placeHolder: 'Age' },
            { key: 'roles', type: 'select_multiple', placeHolder: 'Select Roles', list: roles_list }
        ];
        return res.status(200).send({ input_data: input_data });
    } else {


        if (!req.body.item_id) {
            return res.status(401).send({ common: { message_type: 'error', message: "id Empty" } });
        }
        let id = dehashingFunction(req.body.item_id, 11);
        console.log('update user id: ', id);

        const accountResult = await AccountModel.funcs.getById(id);
        if (!accountResult.completed) {
            return res.status(401).send({ common: { message_type: 'error', message: "user not found" } });
        }
        const data = accountResult.data;

        for (let field of AccountModel.modelData) {
            if (req.body[field.key]) {
                if (field.key == 'contact_number' && req.body[field.key]) {
                    data[field.key] = req.body[field.key].replace(/\s/g, '') || undefined;
                    const contact_number_exis = await AccountModel.funcs.getByCondition({ contact_number: data.contact_number });
                    if (contact_number_exis.completed) {
                        return res.status(401).send({ contact_number: { message_type: 'error', message: "contact number alredy exists" } });
                    }
                } else if (field.key == 'password' && req.body[field.key]) {
                    data[field.key] = req.body[field.key]
                    const hashedPassword = await hashPassword(data.password);
                    data.password = hashedPassword;
                } else {
                    data[field.key] = req.body[field.key] || undefined;
                }
                if (field.required && !(data[field.key])) {
                    let err = {};
                    err[field.key] = { message_type: 'error', message: `${field.key} shoudn't be empty` }
                    return res.status(401).send(err)
                }
            }
        }

        const updatedData = await AccountModel.funcs.update(id, data);
        return res.status(200).send(updatedData.data);
    }
}

exports.deleteUser = async (req, res) => {
    let can_access = await can_acces({ roles: 'superUser' }, req.user);
    if (can_access != true) {
        return res.status(401).send({ message: `you're not authorized to do this` });
    };
    if (!req.params.id) {
        return res.status(401).send({ common: { message_type: 'error', message: "user id not found" } });
    };

    let id = dehashingFunction(req.params.id, 11);
    console.log('user_id: ', id);
    if ((typeof (id) != 'number') || (id % 1 != 0)) {
        return res.status(401).send({ common: { message_type: 'error', message: "invalid user id" } });
    };

    let user = await AccountModel.funcs.delete(id);
    if (!user.completed) {
        return res.status(401).send({ common: { message_type: 'error', message: "user not found" } });
    };

    return res.status(200).send(user.completed);
}
