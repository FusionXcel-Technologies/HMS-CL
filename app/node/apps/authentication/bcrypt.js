const bcrypt = require("bcrypt");
const saltRounds = 3;

exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw new Error("Password hashing failed");
    }
}

exports.comparePassword = async (password, hash) => {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        throw new Error("Password comparison failed");
    }
}
exports.hashingFunction = (number, salt, onlyNumbers = false) => {
    number = (number * (((salt || 1) / (salt || 1) * 11))) * (salt || 1);
    let result = "";

    while (number > 0) {
        const remainder = number % (onlyNumbers ? 10 : 36); // Use 10 for only numbers or 36 for letters + numbers
        let charCode;

        if (onlyNumbers) {
            charCode = 48 + remainder; // Numbers (0-9)
        } else {
            if (remainder < 26) {
                charCode = 65 + remainder; // Capital letters (A-Z)
            } else {
                charCode = 48 + (remainder - 26); // Numbers (0-9)
            }
        }

        const character = String.fromCharCode(charCode);
        result = character + result;
        number = Math.floor(number / (onlyNumbers ? 10 : 36));
    }

    return result;
}

exports.dehashingFunction = (hashedCode, salt, onlyNumbers = false) => {
    let number = 0;

    for (let i = 0; i < hashedCode.length; i++) {
        const charCode = hashedCode.charCodeAt(i);
        let remainder;

        if (onlyNumbers) {
            remainder = charCode - 48; // Numbers (0-9)
        } else {
            if (charCode >= 65 && charCode <= 90) {
                remainder = charCode - 65; // Capital letters (A-Z)
            } else {
                remainder = charCode - 48 + 26; // Numbers (0-9)
            }
        }

        number = number * (onlyNumbers ? 10 : 36) + remainder;
    }

    number = (number / (((salt || 1) / (salt || 1) * 11))) / (salt || 1);
    return number;
}