import express from 'express'

import { setupMiddlewares } from './middlewares'

export const port = 5050

const app = express()

setupMiddlewares(app)

export { app }
