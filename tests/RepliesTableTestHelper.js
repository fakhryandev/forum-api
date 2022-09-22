/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool')

const RepliesTableTestHelper = {
  async addReplies({
    id = 'reply-123',
    content = 'replyreply',
    owner_id = 'user-123',
    comment_id = 'comment-123',
    date = new Date(),
    is_delete = false,
  }) {
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, content, owner_id, comment_id, date, is_delete],
    }

    const { rows } = await pool.query(query)
    return rows[0].id
  },

  async findRepliesById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    }

    const { rows } = await pool.query(query)
    return rows
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1')
  },
}

module.exports = RepliesTableTestHelper
