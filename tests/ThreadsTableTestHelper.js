/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool')

const ThreadsTableTestHelper = {
  async adddThread({
    id = 'thread-123',
    title = 'new thread',
    body = 'new thread body',
    date = new Date(),
    owner = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING *',
      values: [id, title, body, date, owner],
    }

    const { rows } = await pool.query(query)
    return rows[0].id
  },

  async findThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    }

    const { rows } = await pool.query(query)
    return rows
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE threads')
  },
}

module.exports = ThreadsTableTestHelper
