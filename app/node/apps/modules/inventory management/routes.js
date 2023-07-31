

const { can_acces } = require("../../authentication");
const InventoryManagementCategoriesRouter = require("./categories/routes");
const InventoryManagementItemsRouter = require("./items/routes");
const InventoryManagementRacksRouter = require("./racks/routes");

const InventoryManagementRouter = require("express").Router();


InventoryManagementRouter.use('/', async (req, res, next) => {
    let acces = await can_acces({ roles: 'superUser,inventoryManager' }, req.user);
    // console.log('can access: ', can_acces);

    if (acces != true) {
        return res.status(401).send({ message: `you're not authorized to do this` });
    } else {
        return next()
    };
})
InventoryManagementRouter.use('/items', InventoryManagementItemsRouter)
InventoryManagementRouter.use('/categories', InventoryManagementCategoriesRouter)
InventoryManagementRouter.use('/racks', InventoryManagementRacksRouter)

module.exports = InventoryManagementRouter;