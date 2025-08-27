require("dotenv").config()
const express = require("express")
const { MongoClient } = require("mongodb")
const sgMail = require('@sendgrid/mail')
const bcrypt = require("bcrypt")
const app = express()

const client = new MongoClient(process.env.MONGO_URI)
let db

sgMail.setApiKey(process.env.SENDGRID_KEY)

app.use("/src", express.static(__dirname + "/src"))
app.use("/img", express.static(__dirname + "/img"))
app.use("/icons", express.static(__dirname + "/icons"))
app.use(express.json())

function random(length) {
    let final = ""
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    let counter = 0

    while (counter < length) {
        final += characters.charAt(Math.floor(Math.random() * charactersLength))
        counter += 1
    }

    return final
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return email.toLowerCase().match(emailRegex)
}

async function sendEmail(to, subject, text) {
    const message = {
        to: to,
        from: 'michael@complexitytech.com',
        subject: subject,
        text: text,
        html: text
    }

    sgMail
        .send(message)
        .then(() => {
            return { message: "Successfully sent email" }
        })
        .catch((error) => {
            throw new Error(error.message)
        })
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
})

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html")
})

app.get("/home", (req, res) => {
    res.sendFile(__dirname + "/public/home.html")
})

app.get("/messages", (req, res) => {
    res.sendFile(__dirname + "/public/messages.html")
})

app.get("/vision-board", (req, res) => {
    res.sendFile(__dirname + "/public/vision-board.html")
})

app.get("/mind-map", (req, res) => {
    res.sendFile(__dirname + "/public/mind-map.html")
})

app.get("/journal-notes", (req, res) => {
    res.sendFile(__dirname + "/public/journal-notes.html")
})

app.get("/profile", (req, res) => {
    res.sendFile(__dirname + "/public/profile.html")
})

app.listen(8000, async () => {
    try {
        await client.connect()
        db = client.db("main")
        console.log(`Listening : http://localhost:8000`)
    } catch (error) {
        console.error("Could not connect to db:", error)
        process.exit(1)
    }
})