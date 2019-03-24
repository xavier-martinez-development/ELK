/*
    Load environment variables from .env
    Variables in use:
        NODE_ENV
        PORT
*/
require('dotenv').config()

import autocannon from 'autocannon'
import express from 'express'
import fs from 'fs'
import morgan from 'morgan'
import path from 'path'

const app = express()
const port = process.env.PORT
const logStream = fs.createWriteStream(path.join(__dirname, 'access.log'))

// Setup logging
app.use(morgan('common', { stream: logStream }))
// Setup routes
app.all('/', (req, res) => res.status([200, 201][Math.floor(Math.random() * 2)]).send('OK'))
app.all('/error', (req, res) => res.status([400, 401, 403, 404, 500][Math.floor(Math.random() * 5)]).send('ERROR'))
// Run server
app.listen(port, () => console.log(`Listening on port ${port}!`))
// Setup network traffic simulation
autocannon({
    url: `http://localhost:${port}`,
    connections: 1,
    amount: 60,
    requests: [{
        method: 'POST',
        path: '/'
    }, {
        method: 'GET',
        path: '/'
    }, {
        method: 'GET',
        path: '/error'
    }, {
        method: 'POST',
        path: '/error'
    }, {
        method: 'PUT',
        path: '/'
    }, {
        method: 'DELETE',
        path: '/'
    }, {
        method: 'PUT',
        path: '/error'
    }, {
        method: 'DELETE',
        path: '/error'
    }],
    connectionRate: 1
}, (err, results) => console.log(JSON.stringify(err == null ? { status: 'Successful', ...results } : { status: 'Error', ...error }, null, 2)))