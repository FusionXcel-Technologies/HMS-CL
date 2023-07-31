const { RoleModel } = require("./model");


exports.can_acces = async (condition, user) => {
    if (!user) {
        return false;
    }

    if (condition.roles) {
        const requiredRoles = condition.roles.split(',');

        for (const role of requiredRoles) {
            const roleResult = await RoleModel.funcs.getByCondition({ code: role });

            if (roleResult.completed) {
                const userRoles = user.roles ? user.roles.split(',') : [];

                if (userRoles.includes(roleResult.data.code)) {
                    return true;
                }
            } else {
                console.log('Role not found');
            }
        }
    }

    return false;
};
