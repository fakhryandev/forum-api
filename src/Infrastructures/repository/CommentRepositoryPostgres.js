const AuthorizationError = require('../../Commons/exceptions/AuthorizationError')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')
const CommentRepository = require('../../Domains/comments/CommentRepository')
const AddedComment = require('../../Domains/comments/entities/AddedComment')
const DetailComment = require('../../Domains/comments/entities/DetailComment')

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

    return new AddedComment(rows[0])
  }

  async verifyAvailableComment(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id=$1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan')
    }
  }

  async verifyCommentOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan')
    }

    const comment = result.rows[0]

    if (comment.owner_id !== owner) {
      throw new AuthorizationError('anda tidak memiliki akses')
    }
  }

  async deleteCommentById(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id=$1 RETURNING id',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan')
    }
  }

  async getCommentsByThreadId(id) {
    const query = {
      text: 'SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete, (SELECT COUNT(likes.id)::int FROM likes WHERE likes.comment_id = comments.id) AS like FROM comments INNER JOIN users ON comments.owner_id = users.id WHERE thread_id = $1 ORDER BY comments.date ASC',
      values: [id],
    }

    const result = await this._pool.query(query)

    return result.rows.map((row) => new DetailComment(row))
  }
}

module.exports = CommentRepositoryPostgres
