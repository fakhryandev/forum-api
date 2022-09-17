const ThreadRepository = require('../../Domains/threads/ThreadRepository')
const AddedThread = require('../../Domains/threads/entities/AddedThread')
const NotFoundError = require('../../Commons/exceptions/NotFoundError')

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super()
    this._pool = pool
    this._idGenerator = idGenerator
  }

  async addThread(newThread) {
    const { title, body, owner } = newThread

    const id = `thread-${this._idGenerator()}`
    const date = new Date().toISOString()

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, date, owner],
    }

    const { rows } = await this._pool.query(query)

    return new AddedThread({ ...rows[0] })
  }

  async verifyAvailableThreadById(id) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }
  }

  async getThreadById(id) {
    const query = {
      text: 'SELECT threads.id, title, body, date, username FROM threads JOIN users ON threads.owner = users.id WHERE threads.id = $1',
      values: [id],
    }

    const result = await this._pool.query(query)

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan')
    }

    return result.rows[0]
  }
}

module.exports = ThreadRepositoryPostgres
