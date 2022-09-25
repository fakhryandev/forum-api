const LikeRepository = require('../../Domains/likes/LikeRepository')

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async like(commentId, userId) {
    const id = `like-${this._idGenerator()}`
    const query = {
      text: 'INSERT INTO likes VALUES ($1, $2, $3)',
      values: [id, commentId, userId],
    }

    await this._pool.query(query)
  }

  async unlike(likeId) {
    const query = {
      text: 'DELETE FROM likes WHERE id = $1',
      values: [likeId],
    }

    await this._pool.query(query)
  }

  async isLiked(commentId, userId) {
    const query = {
      text: 'SELECT * FROM likes where comment_id = $1 AND user_id = $2',
      values: [commentId, userId],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      return null
    }

    return result.rows[0].id
  }
}

module.exports = LikeRepositoryPostgres
