// This is for token verification


// Admin user authentication
// require("dotenv").config()
const jwt = require("jsonwebtoken")

// let jwtSecret = process.env.jwtSecrets

exports.adminAuth = (request, respond, next) => {
    const token = request.cookies.jwt

    if (token) {
        jwt.verify(token, jwtSecret, (error, decodedToken) => {
            if (error) {
                return respond.status(401).json({
                    message: "Not Authorized!"
                })
            } else {
                if (decodedToken.role !== "admin") {
                    return respond.status(401).json({
                        message: "Not Authorized!"
                    })
                } else {
                    next()
                }
            }
        })
    } else {
        return respond.status(401).json({
            message: "Token Unavailable! Not Authorized!"
        })
    }
}


// Regular user authentication


exports.userAuth = (request, respond, next) => {
    const token = request.cookies.jwt

    if (token) {
        jwt.verify(token, jwtSecret, (error, decodedToken) => {
            if (error) {
                return respond.status(401).json({
                    message: "Not Authorized!"
                })
            } else {
                if (decodedToken.role !== "Basic") {
                    return respond.status(401).json({
                        message: "Not Authorized!"
                    })
                } else {
                    next()
                }
            }
        })
    } else {
        return respond.status(401).json({
            message: "Token Unavailable! Not Authorized!"
        })
    }
}