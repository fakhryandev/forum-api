const JwtTokenManager = require('../JwtTokenManager')
const Jwt = require('@hapi/jwt')
const InvariantError = require('../../../Commons/exceptions/InvariantError')

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create accessToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'testuser',
      }
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      }
      const jwtTokenManager = new JwtTokenManager(mockJwtToken)

      // Action
      const accessToken = await jwtTokenManager.createAccessToken(payload)

      // Assert
      expect(mockJwtToken.generate).toBeCalledWith(
        payload,
        process.env.ACCESS_TOKEN_KEY
      )
      expect(accessToken).toEqual('mock_token')
    })
  })

  describe('createRefreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // Arrange
      const payload = {
        username: 'testuser',
      }
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token'),
      }
      const jwtTokenManager = new JwtTokenManager(mockJwtToken)

      const refreshToken = await jwtTokenManager.createRefreshToken(payload)

      expect(mockJwtToken.generate).toBeCalledWith(
        payload,
        process.env.REFRESH_TOKEN_KEY
      )
      expect(refreshToken).toEqual('mock_token')
    })
  })

  describe('verifyRefreshToken function', () => {
    it('should throw InvariantError when verification failed', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({
        username: 'test-user',
      })

      await expect(
        jwtTokenManager.verifyRefreshToken(accessToken)
      ).rejects.toThrow(InvariantError)
    })

    it('should not throw InvariantError when refresh token verified', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const refreshToken = await jwtTokenManager.createRefreshToken({
        username: 'test-user',
      })

      await expect(
        jwtTokenManager.verifyRefreshToken(refreshToken)
      ).resolves.not.toThrow(InvariantError)
    })
  })

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({
        username: 'test-user',
      })

      const { username: expectedUsername } =
        await jwtTokenManager.decodePayload(accessToken)

      expect(expectedUsername).toEqual('test-user')
    })
  })
})
