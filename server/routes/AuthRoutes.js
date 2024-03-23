const { register, login} = require("../Controllers/AuthControllers")
const {checkUser} = require("../Middleware/AuthMiddleWare");
const router = require("express").Router();

router.post("/register", register)

//example of using the jwt token for auth
router.get("/account",checkUser);

router.post("/login", login)

module.exports = {router};