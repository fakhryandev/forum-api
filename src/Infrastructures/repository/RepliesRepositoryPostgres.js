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
}

module.exports = RepliesRepositoryPostgres
