const createServer = require('../createServer')

describe('HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    const server = await createServer({})

    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    })

    expect(response.statusCode).toEqual(404)
  })

  describe('when GET /', () => {
    it('should return 200 and hello world', async () => {
      // Arrange
      const server = await createServer({});
      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/test',
      });
      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.value).toEqual('Hello world!');
    });
  });

  it('should handle server error correctly', async () => {
    // Arrange
    const requestPayload = {
      username: 'testuser',
      password: 'super_secret',
      fullname: 'Test User',
    }
    const server = await createServer({})

    // Action
    const response = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    })

    // Assert
    const responseJson = JSON.parse(response.payload)
    expect(response.statusCode).toEqual(500)
    expect(responseJson.status).toEqual('error')
    expect(responseJson.message).toEqual('terjadi kegagalan pada server kami')
  })
})
