const { matchedData } = require("express-validator");
const User = require("../models/user.js");
const { encrypt } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJWT");
const { handleHttpError } = require("../utils/handleHttpError");
const { MAX_VERIFICATION_ATTEMPTS } = require("../config/config.js");


//Funcion simple para la creación del código de verificación de 6 digitos.
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000); // Genera un número entre 100000 y 999999
};

const registerUser = async (req, res) => {
    try {
        const body = matchedData(req); // Filtra los datos validados del request
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return handleHttpError(res, "El email ya está registrado", 409); //Error 409 requerido
        }
        // Encriptar la contraseña antes de guardarla
        body.password = await encrypt(body.password);
        //le damos el codigo y los intentos.
        body.codigo = generateVerificationCode();
        body.attemps = MAX_VERIFICATION_ATTEMPTS; //variable en config.js , creí correcto que estuviese definida de manera global , en caso de cambiarla no se debe buscar en el codigo.
        // Crear usuario en la base de datos
        const data = await User.create(body);
        // Generar token JWT
        const token = tokenSign(data);

        //devolver el OK + datos y token
        res.status(201).json({             
            email: data.email,
            status: data.status, // Representa si el email ha sido verificado
            role: data.role,
            token
         });
    } catch (err) {
        console.error(err);
        handleHttpError(res, "ERROR_REGISTER_USER");
    }
};

module.exports = { registerUser };
