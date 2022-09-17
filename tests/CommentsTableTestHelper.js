/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool')

const CommentsTableTestHelper = {
  async addComment({
    id = 'comment-123',
    content = 'new comment',
    owner_id = 'user-123',
    thread_id,
    date = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, content, owner_id, thread_id, date],
    }

    const { rows } = await pool.query(query)
    return rows[0].id
  },

  async findCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    }

    const { rows } = await pool.query(query)
    return rows
  },

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    }

    await pool.query(query)
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE comments')
  },
}

module.exports = CommentsTableTestHelper
