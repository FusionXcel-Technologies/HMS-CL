
const { createItem, getItemsList, updateItem, viewItem, deleteItem } = require("./item.index");

const InventoryManagementItemsRouter = require("express").Router();

InventoryManagementItemsRouter.post('/create', createItem)
// InventoryManagementItemsRouter.use('/', (req, res) => {
//     console.log('route');
// })

InventoryManagementItemsRouter.get('/list', getItemsList);
InventoryManagementItemsRouter.post('/create', createItem);
InventoryManagementItemsRouter.post('/update', updateItem);
InventoryManagementItemsRouter.get('/view/:id', viewItem);
InventoryManagementItemsRouter.delete('/delete/:id', deleteItem);

module.exports = InventoryManagementItemsRouter;