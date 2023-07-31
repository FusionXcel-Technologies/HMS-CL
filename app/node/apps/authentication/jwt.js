const { sign, verify } = require("jsonwebtoken");

exports.createAuthToken = (data) => {
    data = { id: data.id, name: data.name, contact_number: data.contact_number, role: data.role };
    return new Promise((resolve, reject) => {
        const token = sign(JSON.stringify(data), process.env.AUTH_KEY || 'default_key');
        resolve(token);
    });
};

exports.verifyAuthToken = async (token) => {
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
