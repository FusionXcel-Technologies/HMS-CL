const { make_func_file } = require("../../../../modules/database/make_model");
const moduleAddr = './apps/modules/inventory management/racks/crud';

class RackModel {
    constructor() {
        this.modelAddr = 'inventory/rack'; // The address where the Rack model data is stored in the database
        this.modelName = 'rack'; // The name of the Rack model

        this.modelData = [
            { key: 'name', type: 'string' }, // Rack address (optional)
            { key: 'adress', type: 'string' }, // Rack address (optional)
            { key: 'capacity', type: 'number' }, // Rack capacity (required)
            { key: 'isAvailable', type: 'boolean' }, // Availability status (required)
            { key: 'weight', type: 'number' }, // Rack weight (optional)
            { key: 'width', type: 'number' }, // Rack width (optional)
            { key: 'height', type: 'number' }, // Rack height (optional)
            { key: 'length', type: 'number' }, // Rack length (optional)
            { key: 'manufacturer', type: 'string' }, // Manufacturer name (optional)
            { key: 'serialNumber', type: 'string' }, // Rack serial number (optional)
            { key: 'purchaseDate', type: 'date' }, // Date of rack purchase (optional)
            { key: 'purchasePrice', type: 'number' }, // Purchase price (optional)
            { key: 'powerPorts', type: 'number' }, // Number of power ports (optional)
            { key: 'dataPorts', type: 'number' }, // Number of data ports (optional)
            { key: 'fans', type: 'number' }, // Number of fans (optional)
            { key: 'hasCooling', type: 'boolean' }, // Cooling status (optional)
            { key: 'rackType', type: 'string' }, // Type of rack (optional)
            { key: 'manufacturerContact', type: 'string' }, // Manufacturer's website (optional)
            { key: 'notes', type: 'string' }, // Additional notes (optional)
            { key: 'warrantyExpires', type: 'date' }, // Warranty expiration date (optional)
            { key: 'lastServiceDate', type: 'date' }, // Date of last service (optional)
            { key: 'nextServiceDate', type: 'date' }, // Date of next service (optional)
            { key: 'serviceContact', type: 'date' }, // Date of next service (optional)
            { key: 'barcode', type: 'string' }, // Rack barcode (optional)
            { key: 'assetTag', type: 'string' }, // Rack asset tag (optional)
            // Add even more properties as needed for your Rack model
        ];
        this.initialize();
        this.funcs = require('./crud/inventory/rack/rack/func'); // The functions to perform CRUD operations on the Rack model
    }

    async initialize() {
        this.model = await make_func_file(`${moduleAddr}/${this.modelAddr}`, this.modelName, this.modelData).then((res) => {
            // Additional initialization logic can be added here if needed
        });
    }
}

exports.RackModel = new RackModel();
