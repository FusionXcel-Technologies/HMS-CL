
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

exports.makeSideBar = (exludeItems = '') => {
    //exludeItems = exludeItems ? exludeItems : '';
    let sideBarArr = Object.values(sideBar);
    exludeItems = exludeItems.split(',');
    for (let index = 0; index < exludeItems.length; index++) {
        const exludeItemKey = exludeItems[index];
        let exludeItem = sideBar[exludeItemKey];
        console.log('exe: ', exludeItem);
        sideBarArr = sideBarArr.filter(item => item !== exludeItem);
    }
    return sideBarArr;
};
