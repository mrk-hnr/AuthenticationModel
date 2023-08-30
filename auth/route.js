const express = require("express")
const router = express.Router()
const {register, login} = require("./auth") // VSCode detect error with ., but can still connect to DB.
router.route("/register").post(register)
router.route("/login").post(login)

module.exports = router
