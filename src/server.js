const path = require("path")
const moment = require('moment')

const http = require('http')
const express = require('express')
const app = express()

// Access Origin
app.use(function(req, res, next) {

    // const allowedOrigins = ['http://localhost:4200', 'http://192.168.178.40:4200'];
    // const origin = req.headers.origin;
    // if (allowedOrigins.includes(origin)) {
    //     res.setHeader('Access-Control-Allow-Origin', origin);
    // }
    // res.header("Access-Control-Allow-Origin", "http://localhost:4200", "http://192.168.178.40:4200")
    res.setHeader("Access-Control-Allow-Origin", '*')
    res.setHeader("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS")    
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
    next()
})
app.disable('x-powered-by')

// Public Static File Folder
let public_folder = path.join(__dirname, '..', '/public/')
app.use(express.static(public_folder))

const server = http.createServer(app)

// Enviroment Data
const dotenv = require('dotenv')
dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT || 4400

/**
 * ------------------------------
 * API Routes
 * ------------------------------
 */

// Dasboard HTML Page
app.get("/", async (req, res) => {    
    res.setHeader('Content-Type', 'text/html')
    res.status(200).sendFile(`index.html`)
})

// Return some data
app.get("/someData", async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    
    let dummyFoodStores = [ 
            { 
                id: 1,
                foodStore: "Casino",
                location: {
                    lon: "123.123",
                    lat: "456.456"
                },
                favorite: true,
                lastVisite: "2022-30-03"     
            },
            { 
                id: 2,
                foodStore: "Dori, Dori",
                location: {
                    lon: "123.123",
                    lat: "456.456"
                },
                favorite: true,
                lastVisite: "2022-29-03"     
            },
            { 
                id: 3,
                foodStore: "Chipo",
                location: {
                    lon: "123.123",
                    lat: "456.456"
                },
                favorite: false,
                lastVisite: "2022-28-03"     
            },
        ]

    console.log("RESULT BACK TO..:", req.headers.host);

    res.status(200).send(JSON.stringify(dummyFoodStores))
})

/**
 * ------------------------------
 * Server Settings
 * ------------------------------
 */
 server.listen(SERVER_PORT, () => {
    console.log("-------------------------------")
    console.log("  API started")
    console.log("----------------+--------------")
    console.log(`| SERVER PORT...:`, SERVER_PORT)
    console.log("----------------+--------------\n")
})