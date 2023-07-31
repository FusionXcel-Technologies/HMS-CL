
const sqlite3 = require('sqlite3').verbose();
let fs = require('fs')
fs.mkdir('./database/authentication/users/accounts', { recursive: true }, () => {
    const db = new sqlite3.Database('./database/authentication/users/accounts/accounts.db');

// Create the table with columns of different data types
db.serialize(() => {
    db.run(`  
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY, name TEXT, contact_number TEXT, password TEXT, age INTEGER, roles TEXT, createdAt TEXT, updatedAt TEXT
    )
  `);
});

let getDateTimeStamp = () => {
    const currentDate = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const day = currentDate.getDate();
    const month = monthsOfYear[currentDate.getMonth()];
    const year = currentDate.getFullYear();
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const second = currentDate.getSeconds();
    const millisecond = currentDate.getMilliseconds();

    const formattedDate = `${ dayOfWeek }-${ day }-${ month }-${ year } at ${ hour }:${ minute }:${ second }:${ millisecond }`;

    return formattedDate;
};

let check_values = async (input_data) => {
    let model = JSON.parse(`{"name":{"key":"name","type":"string","required":true,"default":null},"contact_number":{"key":"contact_number","type":"string","required":true,"default":null},"password":{"key":"password","type":"string","required":true,"default":null},"age":{"key":"age","type":"number","required":false,"default":null},"roles":{"key":"roles","type":"string","required":false,"default":null},"createdAt":{"key":"createdAt","type":"string","required":false,"default":null},"updatedAt":{"key":"updatedAt","type":"string","required":false,"default":null}}`);
//let model = [object Object];
 return new Promise((resolve, reject) => {
        let input_data_keys = Object.keys(input_data);
        let input_data_out = {};

        for (let index = 0; index < input_data_keys.length; index++) {
            const key = input_data_keys[index];
            const value = input_data[key];

            let model_field = model[key];
            if (model_field) {
                if (!value) {
                    if (model_field.required && !model_field.default_value) {
                        resolve(`${ key } must not be empty`);
                    } else if (model_field.default_value) {
                        value = model_field.default_value
                    }
                }
                const valueType = typeof value;
                const typeString = model_field.type.toString();

                if (valueType != typeString) {
                    resolve(`${ key } should be of type '${typeString}'`);
                } else {
                    input_data_out[key] = value;
                }
            }
            }
            resolve(input_data_out)
        

    });
}


// Get all records
exports.getAll = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM records', (err, rows) => {
            if (err) {
                console.error('Error retrieving records:', err);
                resolve({ completed: false, error: 'Error retrieving data' });
            } else {
                resolve({ completed: true, data: rows });
            }
        });
    });
}

// Get a single record by ID
exports.getById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM records WHERE id = ?', id, (err, row) => {
            if (err) {
                console.error('Error retrieving record:', err);
                resolve({ completed: false, error: 'Error retrieving data' });
            } else if (!row) {
                resolve({ completed: false, error: 'Data not found' });
            } else {
                resolve({ completed: true, data: row });
            }
        });
    });
}

// Get a single record by condition
exports.getByCondition = (condition) => {
    let searchKey = Object.keys(condition)[0];
    let params = condition[searchKey];
    params = typeof(params) == 'string'?params.split(','):params;
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM records WHERE ${ searchKey } = ?`;
        db.get(query, params, (err, row) => {
            if (err) {
                console.error('Error retrieving record:', err);
                resolve({ completed: false, error: 'Error retrieving data' });
            } else if (!row) {
                resolve({ completed: false, error: 'Data not found' });
            } else {
                resolve({ completed: true, data: row });
            }
        });
    });
}
 
// Get records by condition
exports.getAllByCondition = (condition) => {
    let searchKey = Object.keys(condition)[0];
    let params = condition[searchKey];
    params = typeof(params) == 'string'?params.split(','):params;

    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM records WHERE ${ condition } = ?`;
        db.all(query, params, (err, rows) => {
            if (err) {
                console.error('Error retrieving records:', err);
                resolve({ completed: false, error: 'Error retrieving data' });
            } else {
                resolve({ completed: true, data: rows });
            }
        });
    });
};


// Create a new record
exports.create = async (data) => {
    data.createdAt = getDateTimeStamp();
    data.updatedAt = getDateTimeStamp();
   // console.log(data)
      let is_valid_inputs = await check_values(data);
    if (!typeof (is_valid_inputs) == 'object') {
        return is_valid_inputs;
    }
    return new Promise((resolve, reject) => {
        const { name, contact_number, password, age, roles, createdAt, updatedAt } = data;

        db.run(
            'INSERT INTO records (name, contact_number, password, age, roles, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
            data.name, data.contact_number, data.password, data.age, data.roles, data.createdAt, data.updatedAt,
            function (err) {
                if (err) {
                    console.error('Error creating record:', err);
                    resolve({ completed: false, error: 'Internal Server Error' });
                } else {
                    resolve({ completed: true, data: { id: this.lastID, name, contact_number, password, age, roles, createdAt, updatedAt } });
                }
            }
        );
    });
}

// Update a record
exports.update = (id, data) => {
  
    data.updatedAt = getDateTimeStamp();
    return new Promise((resolve, reject) => {
        const { name, contact_number, password, age, roles, createdAt, updatedAt } = data;

        db.run(
            'UPDATE records SET name = ?, contact_number = ?, password = ?, age = ?, roles = ?, createdAt = ?, updatedAt = ? WHERE id = ?',
            [data.name, data.contact_number, data.password, data.age, data.roles, data.createdAt, data.updatedAt, id],
            (err) => {
                if (err) {
                    console.error('Error updating record:', err);
                    resolve({ completed: false, error: 'Internal Server Error' });
                } else {
                    resolve({ completed: true });
                }
            }
        );
    });
}

// Delete a record
exports.delete = (id) => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM records WHERE id = ?', id, (err) => {
            if (err) {
                console.error('Error deleting record:', err);
                resolve({ completed: false, error: 'Internal Server Error' });
            } else {
                resolve({ completed: true });
            }
        });
    });
}


// Delete all records
exports.deleteAll = () => {
    return new Promise((resolve, reject) => {
        db.run('DELETE FROM records', (err) => {
            if (err) {
                console.error('Error deleting all records:', err);
                resolve({ completed: false, error: 'Internal Server Error' });
            } else {
                resolve({ completed: true });
            }
        });
    });
}
 })
