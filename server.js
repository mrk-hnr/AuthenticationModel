const express = require("express")
const app = express()
const PORT = 5500
const connectDB = require("./db")

connectDB()

app.use(express.json())

app.use("/api/auth", require("./auth/route"))

const server = app.listen(PORT, () => console.log(`Successfully connected to Port ${PORT}!`))

process.on("unhandleRejection", error => {
    console.log(`Error Occured: ${error.message}!`)
    server.close(() => process.exit(1))
})


