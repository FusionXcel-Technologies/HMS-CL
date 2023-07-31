// Importing the verifyAuthToken function from the jwt.js file
const { verifyAuthToken } = require("./jwt");
// Importing the AccountModel from the specified file (model.js)
const { AccountModel } = require("./model");

// Function to check if a user is authenticated based on the JWT in the request header
exports.isAuthenticated = async (req) => {
    // Extract the authorization token from the request's headers
    let auth_token = req.headers["authorization"];

    // Verify the JWT and get the user_id from it
    let user_id = await verifyAuthToken(auth_token);

    // Parse the user_id to an integer (if it is a valid number)
    user_id = parseInt(user_id);

    // Check if the user_id is not a valid number (NaN), indicating an invalid token or authentication failure
    if (isNaN(user_id)) {
        return false; // Return false to indicate authentication failure
    }

    // Fetch the user account from the database using the user_id
    let account = await AccountModel.funcs.getById(user_id);

    // Check if the account fetching was successful (completed is a flag indicating success)
    console.log(!account.completed);
    if (!account.completed) {
        return false; // Return false if the account retrieval was unsuccessful
    } else {
        return account.data; // Return the account data if the user is authenticated
    }
};

// Route handler to check if a user is authenticated and return the result
exports.isAuthenticatedUser = async (req, res) => {
    // Call the isAuthenticated function to check if the user is authenticated
    let authenticated = await this.isAuthenticated(req);

    // Send the authentication result in the response with an HTTP status code 200 (OK)
    return res.status(200).send(authenticated);
};
