const CommentRepository = require('../../Domains/comments/CommentRepository')
const AddedComment = require('../../Domains/comments/entities/AddedComment')

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addComment(newComment) {
    const { content, threadId, owner } = newComment
    const id = `comment-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner_id',
      values: [id, content, owner, threadId, date],
    }

    const { rows } = await this._pool.query(query)

    return new AddedComment({ ...rows[0] })
  }
}

module.exports = CommentRepositoryPostgres
