const { register, login, account, update_user, getUserEvents, getUserFinancials, getUsers} = require("../Controllers/AuthControllers")
const {checkUser} = require("../Middleware/AuthMiddleWare");
const router = require("express").Router();

router.post("/register", register)

//example of using the jwt token for auth
router.get("/account",checkUser, account);
router.post("/update_user", checkUser, update_user)
router.get("/user-gigs", checkUser, getUserEvents)
router.get("/user-financials", checkUser, getUserFinancials)
router.get("/all-users", checkUser, getUsers)

router.post("/login", login)

module.exports = {router};