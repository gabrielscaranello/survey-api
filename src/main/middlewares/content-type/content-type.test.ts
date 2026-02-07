import request from 'supertest'

import { app } from '@/main/config/app'

describe('Content-Type Middleware', () => {
  it('should return default Content-Type as JSON', async () => {
    const uri = '/test_content_type'
    app.get(uri, (req, res) => res.send(req.body))

    await request(app).get(uri).expect('Content-Type', /json/)
  })

  it('should return Content-Type forced', async () => {
    const uri = '/test_content_type_xml'
    app.get(uri, (req, res) => {
      res.type('xml')
      return res.send(req.body)
    })

    await request(app).get(uri).expect('Content-Type', /xml/)
  })
})
