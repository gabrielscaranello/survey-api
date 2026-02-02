import request from 'supertest'

import { app } from '@/main/config'

describe('Body Parser Middleware', () => {
  it('should parse body as json', async () => {
    const uri = '/test_body_parser'
    app.post(uri, (req, res) => res.send(req.body))

    await request(app).post(uri).send({ name: 'Test' }).expect({ name: 'Test' })
  })
})
