const User = require("../model/user")

exports.register = async (request, respond, next) => {
    const {username, password} = request.body
    if (password.length < 6) {
        return respond.status(400).json({message: "Password should be more than 6 characters"})
    }
    try {
        await User.create({
            username,
            password,
        }).then(user =>
            respond.status(200).json({
                message: "User Successfully Created!",
                user,
            })
        )
    } catch(error) {
        respond.status(401).json({
            message: "Failed to create user!",
            error: error.message,
        })
    }
}

// Validates credentials of existing users

exports.login = async (request, respond, next) => {
    const {username, password} = request.body

    if (!username || !password) {
        return respond.status(400).json({
            message: "Username/Password is empty",
        })
    }
    try {
        const user = await User.findOne({username, password})
        if (!user) {
            respond.status(401).json({
                message: "Login Unsuccessful",
                error: "User Not Found!",
            })
        }   else {
            respond.status(200).json({
                message: "Login Successful!",
                user,
            })
        } 
    } catch(error) {
        respond.status(401).json({
            message: "An error occured somewhere...?",
            error: error.message
        })
    }
}