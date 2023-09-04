const express = require("express")
const app = express()
const PORT = 5500
require("dotenv").config()
const connectDB = require("./db")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const {adminAuth, userAuth} = require("./middleware/auth")


app.set("view engine", "ejs")

connectDB()

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", require("./auth/route"))

app.get("/", (request, respond) => respond.render("home"))
app.get("/register", (request, respond) => respond.render("register"))
app.get("/login", (request, respond) => respond.render("login"))
app.get("/admin", adminAuth, (request, respond) => (respond.render("admin")))
app.get("/basic", userAuth, (request, respond) => (respond.render("user")))



const server = app.listen(PORT, () => console.log(`Successfully connected to Port ${PORT}!`))

process.on("unhandleRejection", error => {
    console.log(`Error Occured: ${error.message}!`)
    server.close(() => process.exit(1))
})


