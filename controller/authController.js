const bcrypt = require("bcrypt");
const user = require("../db/models/user");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = catchAsync(async (req, res, next) => {
  const body = req.body;
  // if (!["0", "1", "2", "3"].includes(body.userType)) {
  //   throw new AppError("Invalid user Type", 404);
  // }

  try {
    const newUser = await user.create({
      // userType: body.userType,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
      confirmPassword: body.confirmPassword,
    });

    if (!newUser) {
      return next(new AppError("Failed to create the user", 404));
    }

    const result = newUser.toJSON();

    delete result.password;
    delete result.deletedAt;

    result.token = generateToken({
      id: result.id,
    });

    return res.status(201).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password"), 404);
  }

  try {
    // E-posta adresine sahip kullanıcıyı bul
    const existingUser = await user.findOne({ where: { email } });

    // Eğer kullanıcı bulunamazsa veya parola eşleşmezse hata döndür
    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // Kullanıcı bulundu ve parolalar eşleştiği için giriş başarılı, token oluştur ve gönder
    const token = generateToken({ id: existingUser.id });
    return res.json({
      status: "success",
      token,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = { signup, login };
