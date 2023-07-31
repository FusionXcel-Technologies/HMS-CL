const { make_func_file } = require("../../modules/database/make_model");
const moduleAddr = './apps/authentication/crud';


class AccountModel {

    constructor() {
        // this.moduleAddr = moduleAddr;
        this.modelAddr = 'users'
        this.modelName = 'accounts';

        this.modelData = [
            { key: 'name', type: 'string', required: true },
            { key: 'contact_number', type: 'string', required: true },
            { key: 'password', type: 'string', required: true },
            { key: 'age', type: 'number' },
            { key: 'roles', type: 'string' }
        ];

        this.initialize();
        this.funcs = require('./crud/users/accounts/func');
    }

    async initialize() {
        this.model = await make_func_file(`${moduleAddr}/${this.modelAddr}`, this.modelName, this.modelData).then((res) => {
        });
    }
}

class RoleModel {

    constructor() {
        // this.moduleAddr = moduleAddr;
        this.modelAddr = 'users/accounts'
        this.modelName = 'roles';

        this.modelData = [
            { key: 'name', type: 'string' },
            { key: 'code', type: 'string' },
            { key: 'sideBar', type: 'string', default_value: 'home' }
        ];
        this.initialize();
        this.funcs = require('./crud/users/accounts/roles/func');
    }

    async initialize() {
        this.model = await make_func_file(`${moduleAddr}/${this.modelAddr}`, this.modelName, this.modelData).then((res) => {
        });
    }
}


class ActionModel {

    constructor() {
        // this.moduleAddr = moduleAddr;
        this.modelAddr = 'users/auth'
        this.modelName = 'action';

        this.modelData = [
            { key: 'name', type: 'string' },
            { key: 'code', type: 'string' },
            { key: 'users', type: 'string' },
            { key: 'roles', type: 'string' },
            { key: 'groups', type: 'string' },
            { key: 'link', type: 'string' },
            { key: 'parent', type: 'string' }
        ];
        this.initialize();
        this.funcs = require('./crud/users/auth/action/func');

    }

    async initialize() {
        this.model = await make_func_file(`${moduleAddr}/${this.modelAddr}`, this.modelName, this.modelData).then((res) => {
        });
    }
};


class GroupModel {

    constructor() {
        // this.moduleAddr = moduleAddr;
        this.modelAddr = 'users/auth'
        this.modelName = 'group';

        this.modelData = [
            { key: 'name', type: 'string' },
            { key: 'code', type: 'string' },
            { key: 'users', type: 'string' },
            { key: 'roles', type: 'string' },
            { key: 'groups', type: 'string' }
        ];
        this.initialize();

    }

    async initialize() {
        this.model = await make_func_file(`${moduleAddr}/${this.modelAddr}`, this.modelName, this.modelData).then((res) => {
        });
    }
}


exports.AccountModel = new AccountModel();
exports.RoleModel = new RoleModel();
exports.ActionModel = new ActionModel();
exports.GroupModel = new GroupModel();