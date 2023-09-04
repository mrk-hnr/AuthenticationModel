const express = require("express")
const router = express.Router()
const {register, login, update, deleteUser} = require("./auth") // VSCode detect error with ., but can still connect to DB.
const {adminAuth} = require("../middleware/auth") // imports adminAuth from middleware to avoid error with routes update and deleteUser below
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/update").put(adminAuth, update)
router.route("/deleteUser").delete(adminAuth, deleteUser)

module.exports = router
