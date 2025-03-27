const User = require("../models/users");
const { encrypt } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJWT");
const { handleHttpError } = require("../utils/handleHttpError");

const registerUser = async (req, res) => {
    try {
        //extraer de la req los datos del usuario
        const { email, password, role } = req.body;

        // Verificar si el usuario ya existe , no puede haber 2 emails iguales.
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            //devolver el 409 si ya esta 
            return handleHttpError(res, "El email ya está registrado", 409);
        }
        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await encrypt(password);
        // Crear el usuario en la base de datos
        const newUser = new User({
            email,
            password: hashedPassword,
            role
        });
        await newUser.save();
        // Generar token JWT para el nuevo usuario
        const token = tokenSign(newUser);
        res.status(201).json({
            message: "Usuario registrado con éxito",
            user: { id: newUser._id, email: newUser.email, role: newUser.role },
            token
        });
    } catch (error) {
        console.error("Error en registerUser:", error);
        handleHttpError(res, "Error en el servidor", 500);
    }
};

module.exports = { registerUser };