class PasswordHash {
  async hash(password) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED')
  }

  async comparePassword(plain, encrpyted) {
    throw new Error('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = PasswordHash
