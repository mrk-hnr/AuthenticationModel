const express = require("express")
const app = express()
const PORT = 5500
require("dotenv").config()
const connectDB = require("./db")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const {adminAuth, userAuth} = require("./middleware/auth")

connectDB()

app.use(express.json())
app.use(cookieParser())

app.get("/admin", adminAuth, (request, respond) => (respond.send("Admin routes")))
app.get("/basic", userAuth, (request, respond) => (respond.send("User routes")))

app.use("/api/auth", require("./auth/route"))

const server = app.listen(PORT, () => console.log(`Successfully connected to Port ${PORT}!`))

process.on("unhandleRejection", error => {
    console.log(`Error Occured: ${error.message}!`)
    server.close(() => process.exit(1))
})


