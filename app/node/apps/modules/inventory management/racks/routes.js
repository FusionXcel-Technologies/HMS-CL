const { createRack, getRacksList, updateRack, viewRack, deleteRack } = require("./rack.index");

const InventoryManagementRacksRouter = require("express").Router();

InventoryManagementRacksRouter.post('/create', createRack);
InventoryManagementRacksRouter.get('/list', getRacksList);
InventoryManagementRacksRouter.put('/update/:id', updateRack);
InventoryManagementRacksRouter.get('/view/:id', viewRack);
InventoryManagementRacksRouter.delete('/delete/:id', deleteRack);

module.exports = InventoryManagementRacksRouter;
