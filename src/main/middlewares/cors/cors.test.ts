import request from 'supertest'

import { app } from '@/main/config'

describe('CORS Middleware', () => {
  it('should enable CORS', async () => {
    const uri = '/test_cors'
    app.get(uri, (req, res) => res.send(req.body))

    await request(app)
      .get(uri)
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
