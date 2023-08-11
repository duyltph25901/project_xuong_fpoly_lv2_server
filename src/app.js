import express from 'express'
import configViewEngine from "./config/configViewEngine"
import initAPIRoutes from './routes/API'
import initWebRoutes from './routes/Web'

const hostName = '127.0.0.1'
const port = 8080
const app = express()

app.use(express.urlencoded({ extends: true }))
app.use(express.json())

configViewEngine(app)
initAPIRoutes(app)
initWebRoutes(app)

app.listen(port, () => {
    console.log(`Your app is running at http://${hostName}:${port}/`)
})