require("dotenv").config()
const User = require("../model/user")
const bcrypt = require("bcryptjs")

const jwt = require("jsonwebtoken")

// let jwtSecret = process.env.jwtSecrets
let jwtSecret = "INSERT TOKEN HERE"

  
exports.register = async (request, respond, next) => {
    const {username, password} = request.body
    if (password.length < 6) {
        return respond.status(400).json({message: "Password should be more than 6 characters"})
    }
        bcrypt.hash(password, 10).then(async (hash) => {
            await User.create({
              username,
              password: hash,
            })
              .then((user) => {
                const maxAge = 3 * 60 * 60;
                const token = jwt.sign(
                  { id: user._id, username, role: user.role },
                  jwtSecret,
                  {
                    expiresIn: maxAge, // 3hrs
                  }
                )
                respond.cookie("jwt", token, {
                  httpOnly: true,
                  maxAge: maxAge * 1000,
                })
                respond.status(201).json({
                  message: "User successfully created",
                  user: user._id,
                  role: user.role,
                })
              })
              .catch((error) =>
                respond.status(400).json({
                  message: "User not successfully created",
                  error: error.message,
                })
              )
          })
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
            respond.status(400).json({
                message: "Login Unsuccessful",
                error: "User Not Found!",
            })
        } else {
            bcrypt.compare(password, user.password)
                .then(function(result){
                    if (result) {
                        const maxAge = 3 * 60 * 60;
                        const token = jwt.sign(
                            { id: user._id, username, role: user.role },
                            jwtSecret,
                            {
                                expiresIn: maxAge,
                            })
                        respond.cookie("jwt", token, {
                            httpOnly: true,
                            maxAge: maxAge * 1000,
                        })
                        respond.status(201).json({
                            message: "Log In Successful!",
                            user: user._id,
                            role: user.role,
                        })
                    } else {
                        respond.status(400).json({
                            message: "Log In Failed!"
                        })
                    }
                // result ? respond.status(200).json({
                //     message: "Login Successful!",
                //     user,
                // })
                // : respond.status(400).json({
                //     message: "Invalid Password"
                })
            }
        
    } catch(error) {
        respond.status(401).json({
            message: "An error occured somewhere...?",
            error: error.message
        })
    }
}


// Update/Change existing user's role

exports.update = async (request, respond, next) => {
    const {role, id} = request.body
    if (role && id) {
        if (role === "admin") {
            await User.findById(id)
                .then((user) => {
                    if (user.role !== "admin") {
                        user.role = role
                        user.save((err) => {
                            if (err) {
                                respond.status("401").json({
                                    message: "Change Role Error!",
                                    error: err.message
                                })
                                process.exit(1)
                            }
                            respond.status(201).json({
                                message: "Role Update Success!", user
                            })
                        })
                    } else {
                        respond.status(400).json({
                            message: "User already an Admin role!"
                        })
                    }
                })
                .catch((error) => {
                    respond.status(400).json({
                        message: "Error! Task Failed!",
                        error: error.message
                    })
                })
        } else {
            respond.status(401).json({
            message: "Missing Role/ID",
            error: error.message
            })
        }
    }
}

// Delete user

exports.deleteUser = async(request, respond, next) => {
    const {id} = request.body
    await User.findById(id)
        .then(user => user.remove())
        .respond(user => 
            respond.status(201).json({
                message: "User Deleted", user
            })
            .catch(error =>
                respond.status(400).json({
                    message: "An Error Occured!",
                    error: error.message
                })))
}

// Retrieve users

exports.getUsers = async (request, respond, next) => {
    await User.find({})
        .then(users => {
            const userFunction = users.map(user => {
                const container = {}
                container.username = user.username
                container.role = user.role
                container.id = user._id
                return container
            })
            respond.status(200).json({
                user: userFunction
            })
        })
        .catch(error => {
            respond.status(401).json({
                message: "Retrieval Failed!",
                error: error.message
            })
        })
}