import express from 'express'
import Web from '../controller/Web'

let route = express.Router()

const initWebRoutes = (app) => {
    app.get('/', Web.genderMainView)

    return app.use('/', route)
}

export default initWebRoutes