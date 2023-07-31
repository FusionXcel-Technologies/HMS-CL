const fs = require('fs').promises;
const crypto = require('crypto');

exports.createOrUpdateFile = (folderAddress, fileAddress, data) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(folderAddress, { recursive: true }).then(() => {
            // console.log('write file');
            fs.writeFile(fileAddress, data, (err) => {
                if (err) {
                    //  console.error('Error writing file:', err);
                    resolve(false)
                } else {
                    resolve(true)
                }
            });
        })
    });
}


exports.getDateTimeStamp = () => {
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

    const formattedDate = `${dayOfWeek}-${day}-${month}-${year} at ${hour}:${minute}:${second}:${millisecond}`;

    return formattedDate;
};


exports.make_func_file = async (model_addr, model_name, model_data) => {

    model_data.push({ key: 'createdAt', type: 'string' });
    model_data.push({ key: 'updatedAt', type: 'string' });
    // console.log('make func: +++++++++++++++++++++++');

    function return_db_col(key, type) {
        return new Promise((resolve, reject) => {
            switch (type.toString()) {
                case 'string':
                    resolve(`${key} TEXT`);
                    break;
                case 'number':
                    resolve(`${key} INTEGER`);
                    break;
                case 'boolean':
                    resolve(`${key} INTEGER`); // SQLite does not have a dedicated BOOLEAN type, so we use INTEGER instead
                    break;
                case 'date':
                    resolve(`${key} TEXT`); // Store date as TEXT in SQLite
                    break;
                case 'float':
                    resolve(`${key} REAL`);
                    break;
                default:
                    resolve(false);
                    break;
            }
        });
    }

    let model = {};

    let sql_cols = '';
    let model_keys = '';
    for (let index = 0; index < model_data.length; index++) {
        let data = model_data[index];
        model_keys += index === 0 ? data.key : `, ${data.key}`;
        let col = await return_db_col(data.key, data.type);
        if (col) {
            sql_cols += `, ${col}`;
        }
        model[data.key] = { key: data.key, type: data.type, required: data.required || false, default: data.default_value || null }

    }

    let database_name = model_addr
        .replace(/^\.\//, '') // Remove leading "./"
        .replace(/_(\w)/g, (_, match) => match.toUpperCase()) // Convert '/<word>' to '<Word>'
        .replace(/\//g, '_')
        .replace(/_crud/g, '') // Remove '_crud'; // Replace slashes with underscores
        .replace(/apps_/g, '')
        .replace(model_name, '')
        .replace(/_/g, '/')


    const code = `
const sqlite3 = require('sqlite3').verbose();
let fs = require('fs')
fs.mkdir('./database/${database_name}/${model_name}', { recursive: true }, () => {
    const db = new sqlite3.Database('./database/${database_name}/${model_name}/${model_name}.db');

// Create the table with columns of different data types
db.serialize(() => {
    db.run(\`  
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY${sql_cols}
    )
  \`);
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

    const formattedDate = \`\${ dayOfWeek }-\${ day }-\${ month }-\${ year } at \${ hour }:\${ minute }:\${ second }:\${ millisecond }\`;

    return formattedDate;
};

let check_values = async (input_data) => {
    let model = JSON.parse(\`${JSON.stringify(model)}\`);
//let model = ${model};
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
                        resolve(\`\${ key } must not be empty\`);
                    } else if (model_field.default_value) {
                        value = model_field.default_value
                    }
                }
                const valueType = typeof value;
                const typeString = model_field.type.toString();

                if (valueType != typeString) {
                    resolve(\`\${ key } should be of type '\${typeString}'\`);
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
        const query = \`SELECT * FROM records WHERE \${ searchKey } = ?\`;
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
        const query = \`SELECT * FROM records WHERE \${ condition } = ?\`;
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
        const { ${model_keys} } = data;

        db.run(
            'INSERT INTO records (${model_keys}) VALUES (${model_keys.split(', ').map(() => '?').join(', ')})',
            ${model_keys.split(', ').map(key => `data.${key}`).join(', ')},
            function (err) {
                if (err) {
                    console.error('Error creating record:', err);
                    resolve({ completed: false, error: 'Internal Server Error' });
                } else {
                    resolve({ completed: true, data: { id: this.lastID, ${model_keys} } });
                }
            }
        );
    });
}

// Update a record
exports.update = (id, data) => {
  
    data.updatedAt = getDateTimeStamp();
    return new Promise((resolve, reject) => {
        const { ${model_keys} } = data;

        db.run(
            'UPDATE records SET ${model_keys.split(', ').map(key => `${key} = ?`).join(', ')} WHERE id = ?',
            [${model_keys.split(', ').map(key => `data.${key}`).join(', ')}, id],
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
`;
    const fileAddress = `${model_addr.toString()}/${model_name}/func.js`;
    const folderAddress = `${model_addr.toString()}/${model_name}`;

    const data = code;





    try {

        const fileData = await fs.readFile(fileAddress, 'utf8');

        const fileHash = crypto.createHash('sha256').update(fileData || '').digest('hex');
        const snippetHash = crypto.createHash('sha256').update(data).digest('hex');

        let code_change = fileHash == snippetHash;

        if (code_change) {

            return 'no need to change anything';

        } else {

            let o = await this.createOrUpdateFile(folderAddress, fileAddress, data);
            return 'file updated.'
        }
    } catch (err) {

        await this.createOrUpdateFile(folderAddress, fileAddress, data);
        return 'file created.'
    }
};

//exports.createOrUpdateFile = createOrUpdateFile