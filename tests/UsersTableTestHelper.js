/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool')

const UsersTableTestHelper = {
  async addUser({
    id = 'user-123',
    username = 'user-test',
    password = 'password-test',
    fullname = 'User Test',
  }) {
    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, password, fullname],
    }

    const result = await pool.query(query)
    return result.rows[0].id
  },

  async findUsersById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE users CASCADE')
  },
}

module.exports = UsersTableTestHelper
