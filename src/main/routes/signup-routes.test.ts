import request from 'supertest'

import { app } from '@/main/config/app'
import { HTTPStatusCode } from '@/presentation/protocols'

describe('Signup Routes', () => {
  const uri = '/api/signup'

  it('should return an account on success', async () => {
    await request(app)
      .post(uri)
      .send({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      })
      .expect(HTTPStatusCode.OK)
  })
})
