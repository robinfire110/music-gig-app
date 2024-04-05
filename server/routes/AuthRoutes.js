const { register, login, account, update_user, getUserEvents, getUserFinancials} = require("../Controllers/AuthControllers")
const {checkUser} = require("../Middleware/AuthMiddleWare");
const router = require("express").Router();

router.post("/api/register", register)

//example of using the jwt token for auth
router.get("/api/account",checkUser, account);
router.post("/api/update_user", checkUser, update_user)
router.get("/api/user-gigs", checkUser, getUserEvents)
router.get("/api/user-financials", checkUser, getUserFinancials)

router.post("/api/login", login)

module.exports = {router};