const { isAuthenticatedUser } = require("./authentication");
const { getUsersList, viewUser } = require("./find");
const { createRole } = require("./role");
const { getSideBar } = require("./sidebar");
const { signUp, signIn, createUser, updateUser, deleteUser } = require("./user");

const AuthRouter = require("express").Router();

AuthRouter.post('/signup', signUp);
AuthRouter.post('/signin', signIn);
AuthRouter.get('/authenticated', isAuthenticatedUser);
AuthRouter.post('/createRole', createRole);
AuthRouter.get('/getSidebar', getSideBar);
AuthRouter.get('/users/list', getUsersList);
AuthRouter.post('/users/create', createUser);
AuthRouter.put('/users/update/:id', updateUser);
AuthRouter.get('/users/view/:id', viewUser);
AuthRouter.delete('/users/delete/:id', deleteUser);

module.exports = AuthRouter;