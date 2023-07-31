const { dehashingFunction, hashingFunction } = require("../../../authentication/bcrypt");
const { RackModel } = require("./rack.model");
const RackFuncs = RackModel.funcs;

exports.getRacksListArr = async () => {
    let racks = await RackFuncs.getAll();
    racks = racks.completed ? racks.data : [];
    return racks;
};

exports.createRack = async (req, res) => {
    console.log('body: ', req.body);
    if (Object.keys(req.body).length < 1) {
        let racks = await this.getRacksListArr();
        let input_data = [
            { key: 'name', type: 'text', placeHolder: 'Name' },
            { key: 'adress', type: 'select', multiple: false, placeHolder: 'Address', list: racks },
            { key: 'capacity', type: 'number', placeHolder: 'Capacity' }, // Rack capacity (required)
            { key: 'isAvailable', type: 'radio', placeHolder: 'Is Available' }, // Availability status (required)
            { key: 'weight', type: 'number', placeHolder: 'Weight' }, // Rack weight (optional)
            { key: 'width', type: 'number', placeHolder: 'Width' }, // Rack width (optional)
            { key: 'height', type: 'number', placeHolder: 'Height' }, // Rack height (optional)
            { key: 'length', type: 'number', placeHolder: 'Length' }, // Rack length (optional)
            { key: 'manufacturer', type: 'text', placeHolder: 'Manufacturer' }, // Manufacturer name (optional)
            { key: 'serialNumber', type: 'text', placeHolder: 'Serial Number' }, // Rack serial number (optional)
            { key: 'purchaseDate', type: 'date', placeHolder: 'Purchase Date' }, // Date of rack purchase (optional)
            { key: 'purchasePrice', type: 'number', placeHolder: 'Purchase Price' }, // Purchase price (optional)
            { key: 'powerPorts', type: 'number', placeHolder: 'Power Ports' }, // Number of power ports (optional)
            { key: 'dataPorts', type: 'number', placeHolder: 'Data Ports' }, // Number of data ports (optional)
            { key: 'fans', type: 'number', placeHolder: 'Fans' }, // Number of fans (optional)
            { key: 'hasCooling', type: 'radio', placeHolder: 'Has Cooling' }, // Cooling status (optional)
            { key: 'rackType', type: 'text', placeHolder: 'Rack Type' }, // Type of rack (optional)
            { key: 'manufacturerContact', type: 'text', placeHolder: 'Manufacturer Contact' }, // Manufacturer's website (optional)
            { key: 'notes', type: 'text', placeHolder: 'Notes' }, // Additional notes (optional)
            { key: 'warrantyExpires', type: 'date', placeHolder: 'Warranty Expiration Date' }, // Warranty expiration date (optional)
            { key: 'lastServiceDate', type: 'date', placeHolder: 'Last Service Date' }, // Date of last service (optional)
            { key: 'nextServiceDate', type: 'date', placeHolder: 'Next Service Date' }, // Date of next service (optional)
            { key: 'serviceContact', type: 'date', placeHolder: 'Service Contact' }, // Date of next service (optional)
            { key: 'barcode', type: 'text', placeHolder: 'Barcode' }, // Rack barcode (optional)
            { key: 'assetTag', type: 'text', placeHolder: 'Asset Tag' }, // Rack asset tag (optional)
        ];

        return res.status(200).send({ input_data });
    } else {
        const data = {};

        for (let field of RackModel.modelData) {
            data[field.key] = req.body[field.key] || null;
            // Add any additional data processing or validation logic here
        }

        const createdData = await RackFuncs.create(data);
        console.log('created data: ', data);
        return res.status(200).send(createdData);
    }
};

exports.getRacksList = async (req, res) => {
    let racks_list = await RackFuncs.getAll();

    if (!racks_list.completed) {
        return res.status(500).send({ message: `somethig went wrong` });
    }

    racks_list = racks_list.data;

    for (let index = 0; index < racks_list.length; index++) {
        const rack = racks_list[index];
        rack.id = hashingFunction(rack.id, 113, true);
        let rack_rack_out_arr = '';
        let rack_rack_arr = rack.rack?.split(',') || [];
        for (let i = 0; i < rack_rack_arr.length; i++) {
            let cat = await RackFuncs.getById(rack_rack_arr[i]);
            if (cat.completed) {

                rack_rack_out_arr += rack_rack_out_arr == '' ? cat.data.name : ', ' + cat.data.name;
            }
        }

        rack.racks = rack_rack_out_arr;

        racks_list[index] = rack;
    };
    return res.status(200).send(racks_list)
};

exports.viewRack = async (req, res) => {
    if (!req.params.id) {
        return res.status(401).send({ common: { message_type: 'error', message: "id not found" } });
    }

    let id = dehashingFunction(req.params.id, 113);

    if (typeof (id) !== 'number' || id % 1 !== 0) {
        return res.status(401).send({ common: { message_type: 'error', message: "invalid id" } });
    }

    let rack = await RackFuncs.getById(id);
    if (!rack.completed) {
        return res.status(401).send({ common: { message_type: 'error', message: "not found" } });
    }

    return res.status(200).send(rack.data);
};

exports.updateRack = async (req, res) => {
    if (!req.params.id) {
        return res.status(401).send({ common: { message_type: 'error', message: "id not found" } });
    }

    let id = dehashingFunction(req.params.id, 113);
    if (typeof (id) !== "number" || id % 1 !== 0) {
        return res.status(401).send({ common: { message_type: 'error', message: "invalid id" } });
    }

    if (Object.keys(req.body).length < 1) {
        let racks = await this.getRacksListArr();
        // Add other properties here based on the Rack model
        let input_data = RackModel.modelData.map(({ key, type }) => ({
            key,
            type,
            placeHolder: key.charAt(0).toUpperCase() + key.slice(1), // Placeholder is set as the capitalized key name
            value: rack.data[key],
        }));
        return res.status(200).send({ input_data });
    } else {
        const rackResult = await RackFuncs.getById(id);
        if (!rackResult.completed) {
            return res.status(401).send({ common: { message_type: 'error', message: "Rack not found" } });
        }
        const data = rackResult.data;
        for (let field of RackModel.modelData) {
            if (req.body[field.key]) {
                data[field.key] = req.body[field.key] || undefined;
            }
            // Add any additional data processing or validation logic here
        }
        const updatedData = await RackFuncs.update(id, data);
        return res.status(200).send(updatedData.data);
    }
};

exports.deleteRack = async (req, res) => {
    if (!req.params.id) {
        return res.status(401).send({ common: { message_type: 'error', message: "id not found" } });
    }

    let id = dehashingFunction(req.params.id, 113);

    if (typeof (id) !== 'number' || id % 1 !== 0) {
        return res.status(401).send({ common: { message_type: 'error', message: "invalid id" } });
    }

    let rack = await RackFuncs.delete(id);
    if (!rack.completed) {
        return res.status(401).send({ common: { message_type: 'error', message: "not found" } });
    }

    return res.status(200).send(rack.completed);
};
