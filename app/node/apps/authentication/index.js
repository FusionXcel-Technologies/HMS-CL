const { AccountModel, RoleModel, ActionModel } = require("./model");
const AccountFuncs = AccountModel.funcs;
const { sign, verify } = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const RoleFuncs = RoleModel.funcs;
const ActionFuncs = ActionModel.funcs;


let createAuthToken = (data) => {
    // console.log(data);
    data = { id: data.id, name: data.name, contact_number: data.contact_number, role: data.role };
    return new Promise((resolve, reject) => {
        const token = sign(JSON.stringify(data), process.env.AUTH_KEY || 'default_key');
        resolve(token);
    });
};

let verifyAuthToken = async (token) => {
    return new Promise((resolve, reject) => {
        if (token) {

            verify(token, process.env.AUTH_KEY || 'default_key', (err, decoded) => {
                if (err) {
                    resolve(false);
                } else {
                    let user_id = parseInt(decoded.id);
                    resolve(user_id);
                }
            });
        } else {
            resolve(false);
        }
    });
};

exports.isAuthenticated = async (req) => {
    let auth_token = req.headers["authorization"];
    //   console.log(auth_token, req.headers);
    let user_id = await verifyAuthToken(auth_token);
    user_id = parseInt(user_id);
    if (isNaN(user_id)) {
        return false;
    };

    let account = await AccountFuncs.getById(user_id);
    console.log(!account.completed);
    if (!account.completed) {
        return false;
    } else {
        return account.data;
    }
};


exports.isAuthenticatedUser = async (req, res) => {
    let authenticated = await this.isAuthenticated(req);

    return res.status(200).send(authenticated);
}

exports.signUp = async (req, res) => {
    // console.log('req_user: ', req.user ? req.user.id : 'not authenticated');
    try {
        const data = {};

        for (let field of AccountModel.modelData) {
            data[field.key] = req.body[field.key] || null;
        }
        if (!data.password || !data.contact_number) {
            if (!data.password) {
                return res.status(401).send({ password: { message: "password shouldn't be empty" } });
            } else if (!data.contact_number) {
                return res.status(401).send({ contact_number: [{ message: "contact number shouldn't be empty" }] });
            }
        }
        // Find the account by contact_number
        const accountResult = await AccountFuncs.getByCondition({ contact_number: data.contact_number });
        //console.log(accountResult);
        if (accountResult.completed) {
            return res.status(401).send({ contact_number: { message: "contact number alredy exists" } });
        }
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(data.password || "default", 2);
        data.password = hashedPassword;

        const createdData = await AccountFuncs.create(data);
        createdData.data.auth_token = await createAuthToken(createdData.data);
        console.log(createdData.data.id);
        if (createdData.data.id == 1) {
            let superUser = await createSuperUser();
            console.log(superUser);
        }
        // console.log('super user data: +++++++++++++++++ ', process.env.SUPER_USER_CONTACT_NUMBER, process.env.SUPER_USER_PASSWORD);
        return res.status(200).send(createdData.data);
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).send({ common: [{ message: "Internal Server Error" }] });
    }
};

exports.signIn = async (req, res) => {
    //await AccountFuncs.deleteAll()
    try {
        const { contact_number, password } = req.body;
        // Find the account by contact_number
        // const condition = 'contact_number = ?'; // Condition to match the contact_number
        // const params = [contact_number]; // Parameter value for the contact_number
        const accountResult = await AccountFuncs.getByCondition({ contact_number: contact_number });

        if (!accountResult.completed || !accountResult.data) {
            console.log(`can't find account with contact number ${contact_number}`);
            return res.status(401).send({ common: [{ message: "Invalid credentials" }] });
        }

        const account = accountResult.data;

        // Compare the provided password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, account.password);
        console.log(password, account.password, isPasswordValid);
        if (!isPasswordValid) {
            return res.status(401).send({ common: [{ message: "Invalid credentials" }] });
        }

        // Create and send the authentication token
        const authToken = await createAuthToken(account);
        console.log('signin auth token: ', authToken);
        return res.status(200).send({ auth_token: authToken });
    } catch (error) {
        console.error("Sign in error:", error);
        return res.status(500).send({ common: [{ message: "Internal Server Error" }] });
    }
};


let makeSideBar = (exludeItems = '') => {
    //exludeItems = exludeItems ? exludeItems : '';
    let sideBarArr = Object.values(sideBar);
    exludeItems = exludeItems.split(',');
    for (let index = 0; index < exludeItems.length; index++) {
        const exludeItemKey = exludeItems[index];
        let exludeItem = sideBar[exludeItemKey];
        console.log('exe: ', exludeItem);
        sideBarArr = sideBarArr.filter(item => item !== exludeItem);
    }
    //console.log(sideBarArr);
    return sideBarArr;
};



exports.getSideBar = (req, res) => {
    let user = req.user;

    if (!user) {
        return res.status(401).send({ message: "You're not authenticated" });
    }

    let roles = user.roles ? user.roles.split(',') : [];

    let sideBar = [
        {
            name: 'Home',
            link: '/home',
            roles: ['_all_']
        },
        {
            name: 'Inventory Management',
            link: '/inventory-management',
            roles: ['superUser', 'inventoryManager'],

            childs: [
                { name: 'Inventory Overview', link: '/inventory-management/overview', roles: ['superUser', 'inventoryManager'] },
                { name: 'Racks', link: '/inventory-management/racks', roles: ['superUser', 'inventoryManager'] },
                { name: 'Categories', link: '/inventory-management/categories', roles: ['superUser', 'inventoryManager'] },
                { name: 'Items', link: '/inventory-management/items', roles: ['superUser', 'inventoryManager'] },
            ]
        },
        {
            name: 'Sales Management',
            link: '/sales-management',
            roles: ['superUser', 'salesManager'],
            childs: [
                { name: 'Sale Receipts', link: '/sales-management_sale-receipts', roles: ['superUser', 'salesManager'] },
                { name: 'Make', link: '/sales-management_make', roles: ['superUser', 'salesManager'] },
                { name: 'Manage Items', link: '/sales-management_manage-items', roles: ['superUser', 'salesManager'] },
                { name: 'Coupon Codes', link: '/sales-management_coupon-codes', roles: ['superUser', 'salesManager'] },
                { name: 'Payment', link: '/sales-management_payment', roles: ['superUser', 'salesManager'] },
                { name: 'Pay Now', link: '/sales-management_pay-now', roles: ['superUser', 'salesManager'] },
                { name: 'Cash', link: '/sales-management_cash', roles: ['superUser', 'salesManager'] },
                { name: 'Credit/Debit Card', link: '/sales-management_credit-debit-card', roles: ['superUser', 'salesManager'] },
                { name: 'Pay Later', link: '/sales-management_pay-later', roles: ['superUser', 'salesManager'] },
                { name: 'View', link: '/sales-management_view', roles: ['superUser', 'salesManager'] },
                { name: 'Update Payment or Return Balance', link: '/sales-management_update-payment-return-balance', roles: ['superUser', 'salesManager'] },
                { name: 'View Update History', link: '/sales-management_view-update-history', roles: ['superUser', 'salesManager'] },
                { name: 'Add Note', link: '/sales-management_add-note', roles: ['superUser', 'salesManager'] },
            ]
        },
        {
            name: 'Accounting and Financial Management',
            link: '/accounting-financial-management',
            roles: ['superUser', 'accountingManager'],
            childs: [
                { name: 'General Ledger Management', link: '/accounting-financial-management_general-ledger-management', roles: ['superUser', 'accountingManager'] },
            ]
        },
        {
            name: 'Human Resources (HR) Management',
            link: '/hr-management',
            roles: ['superUser', 'hrManager'],
            childs: [
                { name: 'Employee Information Management', link: '/hr-management_employee-information-management', roles: ['superUser', 'hrManager'] },
                { name: 'Recruitment and Applicant Tracking', link: '/hr-management_recruitment-applicant-tracking', roles: ['superUser', 'hrManager'] },
                { name: 'Onboarding and Offboarding', link: '/hr-management_onboarding-offboarding', roles: ['superUser', 'hrManager'] },
                { name: 'Time and Attendance Management', link: '/hr-management_time-attendance-management', roles: ['superUser', 'hrManager'] },
                { name: 'Payroll Management', link: '/hr-management_payroll-management', roles: ['superUser', 'hrManager'] },
                { name: 'Benefits Management', link: '/hr-management_benefits-management', roles: ['superUser', 'hrManager'] },
                { name: 'Performance Management', link: '/hr-management_performance-management', roles: ['superUser', 'hrManager'] },
                { name: 'Training and Development', link: '/hr-management_training-development', roles: ['superUser', 'hrManager'] },
                { name: 'Compliance Management', link: '/hr-management_compliance-management', roles: ['superUser', 'hrManager'] },
                { name: 'Analytics and Reporting', link: '/hr-management_analytics-reporting', roles: ['superUser', 'hrManager'] },
            ]
        },
        {
            name: 'Customer Relationship Management (CRM)',
            link: '/crm-management',
            roles: ['superUser', 'crmManager'],
        },
        {
            name: 'Reporting and Analytics',
            link: '/reporting-analytics',
            roles: ['superUser', 'analyticsManager'],
        },
        {
            name: 'Supply Chain Management',
            link: '/supply-chain-management',
            roles: ['superUser', 'supplyChainManager'],
            childs: [
                { name: 'Supplier Relationship Management', link: '/supply-chain-management_supplier-relationship-management', roles: ['superUser', 'supplyChainManager'] },
                { name: 'Transportation Management', link: '/supply-chain-management_transportation-management', roles: ['superUser', 'supplyChainManager'] },
                { name: 'Manufacturing Planning and Execution', link: '/supply-chain-management_manufacturing-planning-execution', roles: ['superUser', 'supplyChainManager'] },
                { name: 'Reporting and Analytics', link: '/supply-chain-management_reporting-analytics', roles: ['superUser', 'supplyChainManager'] },
            ]
        },
        {
            name: 'E-commerce and Online Sales',
            link: '/ecommerce-sales',
            roles: ['superUser', 'ecommerceManager'],
        },
        {
            name: 'Project Management',
            link: '/project-management',
            roles: ['superUser', 'projectManager'],
        },
        {
            name: 'Business Intelligence and Analytics',
            link: '/business-intelligence',
            roles: ['superUser', 'businessIntelligenceManager'],
        },
        {
            name: 'Marketing',
            link: '/marketing',
            roles: ['superUser', 'marketingManager'],
        },
        {
            name: 'Documents Management',
            link: '/documents-management',
            roles: ['superUser', 'documentsManager'],
        },
        {
            name: 'Customer Support',
            link: '/customer-support',
            roles: ['superUser', 'customerSupportAgent'],
        },
        {
            name: 'Settings',
            link: '/settings',
            roles: ['superUser', 'settingsManager'],
            childs: [
                { name: 'Configurations', link: '/settings_configurations', roles: ['superUser', 'settingsManager'] },
                { name: 'Users', link: '/settings/users', roles: ['superUser', 'settingsManager'] },
            ]
        },
    ];

    let outSideBarArr = makeSideBar(sideBar);

    function makeSideBar(sidebar) {
        let sidebarItems = [];
        for (let i = 0; i < sidebar.length; i++) {
            const sidebarItem = sidebar[i];

            if (sidebarItem.roles.some(role => role === '_all_' || roles.includes(role))) {
                let children;
                if (sidebarItem.childs) {
                    children = makeSideBar(sidebarItem.childs);
                }
                sidebarItems.push({ name: sidebarItem.name, link: sidebarItem.link, childs: children });
            }
        }
        return sidebarItems;
    }

    if (outSideBarArr.length === 0) {
        return res.status(403).send({ message: "You don't have access to any sidebar items" });
    }

    return res.status(200).send(outSideBarArr);
};
exports.can_acces = async (condition, user) => {
    if (!user) {
        return false;
    }

    if (condition.roles) {
        const requiredRoles = condition.roles.split(',');

        for (const role of requiredRoles) {
            const roleResult = await RoleFuncs.getByCondition({ code: role });

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


// exports.can_acces = async (condition, user) => {
//     let auth_by = Object.keys(condition)[0];
//     if (!user) {
//         //  console.log('user not found');
//         return false;
//     }
//     // let rolesList = await RoleFuncs.getAll();
//     // console.log(rolesList);
//     return new Promise((resolve, reject) => {
//         if (auth_by == 'roles') {
//             let can_access_roles = condition.roles ? condition.roles.split(',') : [''];
//             console.log('can access roles: ', can_access_roles);
//             for (let index = 0; index < can_access_roles.length; index++) {
//                 const role = can_access_roles[index];
//                 console.log('role: ', role);
//                 RoleFuncs.getByCondition({ code: role }).then((roleResult) => {
//                     // console.log(roleResult);
//                     if (!roleResult.completed) {
//                         console.log('role not found');
//                     } else {
//                         let user_roles = user.roles ? user.roles.split(',') : [];
//                         console.log(user_roles);
//                         console.log(user_roles.includes(roleResult.data.code));
//                         if (user_roles.includes(roleResult.data.code)) {
//                             console.log('done');
//                             resolve(true);

//                         } else {
//                             console.log("user don't have access");
//                             resolve(false);
//                         };
//                     }
//                 });
//             }
//         } else {
//             resolve(false);
//         };
//     });
// };



// exports.canAcces = async (actionCode, user) => {
//     let action =
// }


exports.createRole = async (req, res) => {
    //   console.log('req user: ', req.user);
    // return role;
    let can_acces = await this.can_acces({ roles: 'superUser' }, req.user);
    // console.log('can access: ', can_acces);
    if (can_acces != true) {
        return res.status(401).send({ message: `you're not authorized to do this` });
    };
    let data = req.body;
    if (!data.name || !data.code) {
        return res.status(401).send({ message: `role ${data.name ? 'code' : 'name'} shouldn't be empty` });
    };
    if (!data.sideBar) {
        return res.status(401).send({ message: 'sideBar', sideBar: sideBar });
    };
    const roleResult = await RoleFuncs.getByCondition({ code: data.code });
    if (roleResult.completed) {
        return res.status(401).send({ message: 'role alredy exists' });
    } else {
        let sideBarArr = await makeSideBar(data.sideBar);
        //console.log(sideBarArr);
        if (sideBarArr) {
            data.sideBar = sideBarArr.length == Object.keys(sideBar).length ? '' : data.sideBar;
            const createdData = await RoleFuncs.create(data);
            return res.status(200).send(createdData.data);
        } else {
            return res.status(401).send({ message: 'invalid sidebar' })
        }
    }
};


exports.hashingFunction = (number, salt) => {
    number = (number * 21) * (salt || 1);
    let result = "";

    while (number > 0) {
        const remainder = number % 36; // 26 letters + 10 numbers
        let charCode;

        if (remainder < 26) {
            charCode = 65 + remainder; // Capital letters (A-Z)
        } else {
            charCode = 48 + (remainder - 26); // Numbers (0-9)
        }

        const character = String.fromCharCode(charCode);
        result = character + result;
        number = Math.floor(number / 36);
    }

    // console.log(dehashingFunction(result));
    return result;
}

exports.dehashingFunction = (hashedCode, salt) => {
    let number = 0;

    for (let i = 0; i < hashedCode.length; i++) {
        const charCode = hashedCode.charCodeAt(i);
        let remainder;

        if (charCode >= 65 && charCode <= 90) {
            remainder = charCode - 65; // Capital letters (A-Z)
        } else {
            remainder = charCode - 48 + 26; // Numbers (0-9)
        }

        number = number * 36 + remainder;
    }

    number = (number / 21) / (salt || 1);
    return number;
}



exports.getUsersList = async (req, res) => {
    let can_acces = await this.can_acces({ roles: 'superUser' }, req.user);
    // console.log('can access: ', can_acces);
    if (can_acces != true) {
        return res.status(401).send({ message: `you're not authorized to do this` });
    };

    let users_list = await AccountFuncs.getAll();

    if (!users_list.completed) {
        return res.status(500).send({ message: `somethig went wrong` });
    }

    users_list = users_list.data;

    for (let index = 0; index < users_list.length; index++) {
        const user = users_list[index];
        users_list[index] = { id: this.hashingFunction(user.id, 54), name: user.name, contact_number: user.contact_number, age: user.age, roles: user.roles, created: user.createdAt, updated: user.updatedAt }
    }

    //users_list = [...users_list, ...users_list, ...users_list, ...users_list, ...users_list, ...users_list, ...users_list]

    return res.status(200).send(users_list)
}


let getRolesSelectList = async () => {
    let roles_list = await getAllRoles();
    //  console.log(roles_list);
    return new Promise((resolve, reject) => {
        let roles_list_codes = [];
        for (let index = 0; index < roles_list.length; index++) {
            const role = roles_list[index];
            roles_list_codes.push({ name: role.name, value: role.code });
        };
        resolve(roles_list_codes);
    });
}


exports.createUser = async (req, res) => {
    let can_acces = await this.can_acces({ roles: 'superUser' }, req.user);
    if (can_acces != true) {
        return res.status(401).send({ message: `you're not authorized to do this` });
    };
    // console.log(Object.keys(req.body).length < 1);

    if (Object.keys(req.body).length < 1) {
        let roles_list = await getRolesSelectList();
        console.log(roles_list);
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
        const accountResult = await AccountFuncs.getByCondition({ contact_number: data.contact_number });
        if (accountResult.completed) {
            return res.status(401).send({ contact_number: { message_type: 'error', message: "contact number alredy exists" } });
        }
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(data.password || "default", 2);
        data.password = hashedPassword;

        const createdData = await AccountFuncs.create(data);
        return res.status(200).send(createdData);
    }
}


exports.updateUser = async (req, res) => {
    let can_acces = await this.can_acces({ roles: 'superUser' }, req.user);
    if (can_acces != true) {
        return res.status(401).send({ message: `you're not authorized to do this` });
    };

    if (!req.params.id) {
        return res.status(401).send({ common: { message_type: 'error', message: "id Empty" } });
    }

    let id = this.dehashingFunction(req.params.id, 54);

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

        const accountResult = await AccountFuncs.getById(id);
        if (!accountResult.completed) {
            return res.status(401).send({ common: { message_type: 'error', message: "user not found" } });
        }
        const data = accountResult.data;

        for (let field of AccountModel.modelData) {
            if (req.body[field.key]) {
                if (field.key == 'contact_number' && req.body[field.key]) {
                    data[field.key] = req.body[field.key].replace(/\s/g, '') || undefined;
                    const contact_number_exis = await AccountFuncs.getByCondition({ contact_number: data.contact_number });
                    if (contact_number_exis.completed) {
                        return res.status(401).send({ contact_number: { message_type: 'error', message: "contact number alredy exists" } });
                    }
                } else if (field.key == 'password' && req.body[field.key]) {
                    data[field.key] = req.body[field.key]
                    const hashedPassword = await bcrypt.hash(data.password, 2);
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
        console.log(data);
        // Hash the password before saving


        const updatedData = await AccountFuncs.update(id, data);
        return res.status(200).send(updatedData.data);
    }
}

exports.viewUser = async (req, res) => {
    if (!req.params.id) {
        return res.status(401).send({ common: { message_type: 'error', message: "user id not found" } });
    };
    let id = this.dehashingFunction(req.params.id, 54);
    console.log('user_id: ', id);
    if ((typeof (id) != 'number') || (id % 1 != 0)) {
        return res.status(401).send({ common: { message_type: 'error', message: "invalid user id" } });
    };

    let user = await AccountFuncs.getById(id);
    if (!user.completed) {
        return res.status(401).send({ common: { message_type: 'error', message: "user not found" } });
    };
    user.data.password = undefined;
    return res.status(200).send(user.data);
}

exports.deleteUser = async (req, res) => {
    let can_acces = await this.can_acces({ roles: 'superUser' }, req.user);
    if (can_acces != true) {
        return res.status(401).send({ message: `you're not authorized to do this` });
    };
    if (!req.params.id) {
        return res.status(401).send({ common: { message_type: 'error', message: "user id not found" } });
    };

    let id = this.dehashingFunction(req.params.id, 54);
    console.log('user_id: ', id);
    if ((typeof (id) != 'number') || (id % 1 != 0)) {
        return res.status(401).send({ common: { message_type: 'error', message: "invalid user id" } });
    };

    let user = await AccountFuncs.delete(id);
    if (!user.completed) {
        return res.status(401).send({ common: { message_type: 'error', message: "user not found" } });
    };

    return res.status(200).send(user.completed);
}

let getSuperUserRole = async () => {
    const roleResult = await RoleFuncs.getByCondition({ code: 'superUser' });
    //console.log(accountResult);

    if (roleResult.completed) {
        return (roleResult.data);
    } else {
        let role = await RoleFuncs.create({ name: 'Super User', code: 'superUser', sideBar: '' });
        //  console.log(role);
        return (role.data);
    }
}

let createSuperUser = async () => {
    let superUserRole = await getSuperUserRole();
    let pw = process.env.SUPER_USER_PASSWORD ? process.env.SUPER_USER_PASSWORD : "superuser";
    console.log(pw);
    let data = {
        name: process.env.SUPER_USER_NAME || 'Super User',
        contact_number: process.env.SUPER_USER_CONTACT_NUMBER || '0123456789',
        password: await bcrypt.hash(pw, 2),
        roles: `${superUserRole.code}`
    };

    let superUser = await AccountFuncs.create(data);
    // console.log(superUser);
    return superUser;
};


let getAllRoles = async () => {
    let roles_list = await RoleFuncs.getAll();
    if (roles_list.data) {
        return roles_list.data;
    } else {
        return [];
    }
}


let addUserToRole = async (user_id, role_code) => {

    let role = await RoleFuncs.getByCondition({ code: role_code });
    let user = await AccountFuncs.getById(user_id);
    role = role.data;
    user = user.data;
    if (role && user.data) {
        let userRoles = user.roles ? user.roles.split(',') : [];
        let addRoleToUser = !userRoles.includes(role.code);
        if (addRoleToUser) {
            let updatedUser = await AccountFuncs.update(user.id, { roles: user.roles + ',' + role.code });
            console.log('user data updated: ' + updatedUser.completed);
            return updatedUser.completed;
        } else {
            return true;
        };
    } else {
        console.log(`${role ? 'role' : ''} ${user ? 'user' : ''} dosen't exist`);
        return `${role ? 'role' : ''} ${user ? 'user' : ''} dosen't exist`;
    };
};