const UserRepository = require('../../../Domains/users/UserRepository')
const NewAuthentication = require('../../../Domains/authentications/entities/NewAuth')
const PasswordHash = require('../../security/PasswordHash')
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository')
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager')
const LoginUserUseCase = require('../LoginUserUseCase')

describe('GetAuthenticationUseCase', () => {
  it('should orchestrating the get authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'testuser',
      password: 'secret',
    }
    const expectedAuthentication = new NewAuthentication({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    })

    const mockUserRepository = new UserRepository()
    const mockAuthenticationRepository = new AuthenticationRepository()
    const mockAuthenticationTokenManager = new AuthenticationTokenManager()
    const mockPasswordHash = new PasswordHash()

    mockUserRepository.getPasswordByUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'))
    mockPasswordHash.comparePassword = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.createAccessToken = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedAuthentication.accessToken)
      )
    mockAuthenticationTokenManager.createRefreshToken = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(expectedAuthentication.refreshToken)
      )
    mockUserRepository.getIdByUsername = jest
      .fn()
      .mockImplementation(() => Promise.resolve('user-123'))
    mockAuthenticationRepository.addToken = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    })

    // action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload)

    // assert
    expect(actualAuthentication).toEqual(expectedAuthentication)
    expect(mockUserRepository.getPasswordByUsername).toBeCalledWith('testuser')
    expect(mockPasswordHash.comparePassword).toBeCalledWith(
      'secret',
      'encrypted_password'
    )
    expect(mockUserRepository.getIdByUsername).toBeCalledWith('testuser')
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({
      username: 'testuser',
      id: 'user-123',
    })
    expect(mockAuthenticationTokenManager.createRefreshToken).toBeCalledWith({
      username: 'testuser',
      id: 'user-123',
    })
    expect(mockAuthenticationRepository.addToken).toBeCalledWith(
      expectedAuthentication.refreshToken
    )
  })
})
