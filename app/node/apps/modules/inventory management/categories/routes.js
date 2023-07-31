const { createCategory, getCategoriesList, updateCategory, viewCategory, deleteCategory } = require("./category.index");

const InventoryManagementCategoriesRouter = require("express").Router();

InventoryManagementCategoriesRouter.post('/create', createCategory);
InventoryManagementCategoriesRouter.get('/list', getCategoriesList);
InventoryManagementCategoriesRouter.put('/update/:id', updateCategory);
InventoryManagementCategoriesRouter.get('/view/:id', viewCategory);
InventoryManagementCategoriesRouter.delete('/delete/:id', deleteCategory);

module.exports = InventoryManagementCategoriesRouter;
