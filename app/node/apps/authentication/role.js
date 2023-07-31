const { can_acces } = require("./access");
const { hashPassword } = require("./bcrypt");
const { AccountModel, RoleModel } = require("./model");
const { makeSideBar } = require("./sidebar");

exports.createRole = async (req, res) => {

    let can_access = await can_acces({ roles: 'superUser' }, req.user);

    if (can_access != true) {
        return res.status(401).send({ message: `you're not authorized to do this` });
    };
    let data = req.body;
    if (!data.name || !data.code) {
        return res.status(401).send({ message: `role ${data.name ? 'code' : 'name'} shouldn't be empty` });
    };
    if (!data.sideBar) {
        return res.status(401).send({ message: 'sideBar', sideBar: sideBar });
    };
    const roleResult = await RoleModel.funcs.getByCondition({ code: data.code });
    if (roleResult.completed) {
        return res.status(401).send({ message: 'role alredy exists' });
    } else {
        // let sideBarArr = await makeSideBar(data.sideBar);
        // //console.log(sideBarArr);
        // if (sideBarArr) {
        //     data.sideBar = sideBarArr.length == Object.keys(sideBar).length ? '' : data.sideBar;
        //     const createdData = await RoleModel.funcs.create(data);
        //     return res.status(200).send(createdData.data);
        // } else {
        //     return res.status(401).send({ message: 'invalid sidebar' })
        // }
    }
};


exports.createSuperUser = async () => {
    let superUserRole = await getSuperUserRole();
    let pw = process.env.SUPER_USER_PASSWORD ? process.env.SUPER_USER_PASSWORD : "superuser";

    let data = {
        name: process.env.SUPER_USER_NAME || 'Super User',
        contact_number: process.env.SUPER_USER_CONTACT_NUMBER || '0123456789',
        password: await hashPassword(pw, 2),
        roles: `${superUserRole.code}`
    };

    let superUser = await AccountModel.funcs.create(data);
    return superUser;
};

let getSuperUserRole = async () => {
    const roleResult = await RoleModel.funcs.getByCondition({ code: 'superUser' });

    if (roleResult.completed) {
        return (roleResult.data);
    } else {
        let role = await RoleModel.funcs.create({ name: 'Super User', code: 'superUser', sideBar: '' });
        return (role.data);
    }
}

let getAllRoles = async () => {
    let roles_list = await RoleModel.funcs.getAll();
    if (roles_list.data) {
        return roles_list.data;
    } else {
        return [];
    }
}

exports.getRolesSelectList = async () => {
    let roles_list = await getAllRoles();

    return new Promise((resolve, reject) => {
        let roles_list_codes = [];
        for (let index = 0; index < roles_list.length; index++) {
            const role = roles_list[index];
            roles_list_codes.push({ name: role.name, value: role.code });
        };
        resolve(roles_list_codes);
    });
}


exports.addUserToRole = async (user_id, role_code) => {

    let role = await RoleModel.funcs.getByCondition({ code: role_code });
    let user = await AccountModel.funcs.getById(user_id);
    role = role.data;
    user = user.data;
    if (role && user.data) {
        let userRoles = user.roles ? user.roles.split(',') : [];
        let addRoleToUser = !userRoles.includes(role.code);
        if (addRoleToUser) {
            let updatedUser = await AccountModel.funcs.update(user.id, { roles: user.roles + ',' + role.code });
            // console.log('user data updated: ' + updatedUser.completed);
            return updatedUser.completed;
        } else {
            return true;
        };
    } else {
        //  console.log(`${role ? 'role' : ''} ${user ? 'user' : ''} dosen't exist`);
        return `${role ? 'role' : ''} ${user ? 'user' : ''} dosen't exist`;
    };
};