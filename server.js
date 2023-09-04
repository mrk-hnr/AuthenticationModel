const express = require("express")
const app = express()
const PORT = 5500
require("dotenv").config()
const connectDB = require("./db")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

connectDB()

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", require("./auth/route"))

const server = app.listen(PORT, () => console.log(`Successfully connected to Port ${PORT}!`))

process.on("unhandleRejection", error => {
    console.log(`Error Occured: ${error.message}!`)
    server.close(() => process.exit(1))
})


