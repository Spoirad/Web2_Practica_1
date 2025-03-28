const { check } = require("express-validator");
const validateResult = require("../utils/handleValidator.js");

const validatorCreateItem = [
    check("email").exists().notEmpty().isEmail(), //Definir validador para que sea un email válido.
    check("password").exists().notEmpty().isLength({ min: 8 }), //Definir validador para que la password contenga al menos 8 caracteres.
    //check("role").exists().notEmpty(), //al tener default esto lo rompe si no pones nada
    validateResult
]

const validatorVerificate = [
    check("codigo").exists().isNumeric().isLength({ min: 6, max: 6 }).withMessage("El código debe ser un numero de 6 cifras."),
    validateResult
]

module.exports = { validatorCreateItem, validatorVerificate };