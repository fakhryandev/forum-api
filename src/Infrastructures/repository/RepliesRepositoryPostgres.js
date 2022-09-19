const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const AddedReply = require('../../Domains/replies/entities/AddedReply')
const RepliesRepository = require('../../Domains/replies/RepliesRepository')

class RepliesRepositoryPostgres extends RepliesRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addReplies(newReplies) {
    const { content, owner, commentId } = newReplies
    const id = `reply-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner_id',
      values: [id, content, owner, commentId, date],
    }

    const { rows } = await this._pool.query(query)

    return new AddedReply({ ...rows[0] })
  }

  async verifyRepliesOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('replies tidak ditemukan')
    }

    const replies = result.rows[0]

    if (replies.owner_id !== owner) {
      throw new AuthorizationError('anda tidak memiliki akses')
    }
  }

  async getRepliesByCommentId(id) {
    const query = {
      text: 'SELECT replies.*, users.username from replies LEFT JOIN users ON replies.owner_id = users.id WHERE comment_id = ANY($1::text[])',
      values: [id],
    }

    const { rows } = await this._pool.query(query)
    return rows
  }

  async deleteRepliesById(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id=$1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('replies tidak ditemukan')
    }
  }
}

module.exports = RepliesRepositoryPostgres
