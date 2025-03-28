const { matchedData } = require("express-validator");
const User = require("../models/user.js");
const { encrypt, compare } = require("../utils/handlePassword");
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

const validateEmail = async (req, res) => {
    try {
        const user = req.user; // Usuario autenticado extraído del token (authMiddleware)
        const { codigo } = matchedData(req);

        // Verificar si el usuario ya está validado
        if (user.status) {
            return handleHttpError(res, "El email ya ha sido validado", 400);
        }
        // Comprobar intentos restantes
        if (user.attempts <= 0) {
            return handleHttpError(res, "Número máximo de intentos alcanzado", 403);
        }
        // Comparar el código ingresado con el código en la base de datos
        if (user.codigo !== codigo) {
            user.attemps -= 1;
            user.markModified("attempts");
            await user.save();
            return handleHttpError(res, "Código incorrecto", 401);
        }

        // Si el código es correcto, actualizar el estado del usuario
        user.status = true;
        user.attemps = 3; // Resetear intentos por si hayq ue volver a verificar en algun momento.
        await user.save();

        return res.json({ message: "Email validado correctamente" });
    } catch (error) {
        console.log(error);
        handleHttpError(res, "Error validando el email");
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return handleHttpError(res, "Usuario no encontrado", 404);
        }

        // Comparar contraseña con bcrypt
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            return handleHttpError(res, "Credenciales incorrectas", 401);
        }

        // Generar token JWT
        const token = tokenSign(user);

        return res.json({
            message: "Login exitoso",
            user: {
                _id: user._id,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.log(error);
        return handleHttpError(res, "Error en el login", 500);
    }
};


module.exports = { registerUser, validateEmail, loginUser };
