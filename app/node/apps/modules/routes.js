const InventoryManagementRouter = require("./inventory management/routes");

const ModulesRouter = require("express").Router();

ModulesRouter.use('/inventory-management', InventoryManagementRouter);

module.exports = ModulesRouter;