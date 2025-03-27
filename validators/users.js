const { check } = require("express-validator");
const validateResult = require("../utils/handleValidator.js");

const validatorCreateItem = [
    check("email").exists().notEmpty().isEmail(), //Definir validador para que sea un email válido.
    check("password").exists().notEmpty().isLength({ min: 8 }), //Definir validador para que la password contenga al menos 8 caracteres.
    check("role").exists().notEmpty(),
    validateResult
]

const validatorGetItem = [
    check("id").exists().notEmpty().isMongoId(),
    validateResult
]


module.exports = { validatorCreateItem, validatorGetItem };