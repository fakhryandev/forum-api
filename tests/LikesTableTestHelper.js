/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool')

const LikesTableTestHelper = {
  async addLike({
    id = 'like-234',
    commentId = 'comment-123',
    userId = 'user-123',
  }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3) RETURNING id',
      values: [id, commentId, userId],
    }

    const result = await pool.query(query)

    return result.rows[0].id
  },

  async findLikeById(id) {
    const query = {
      text: 'SELECT * FROM likes WHERE id = $1',
      values: [id],
    }

    const result = await pool.query(query)
    return result.rows
  },

  async cleanTable() {
    await pool.query('TRUNCATE TABLE likes CASCADE')
  },
}

module.exports = LikesTableTestHelper
