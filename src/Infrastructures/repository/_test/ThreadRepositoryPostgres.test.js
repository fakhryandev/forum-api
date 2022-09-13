const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const pool = require('../../database/postgres/pool')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addThread method', () => {
    it('should presist new thread', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'testuser',
      })

      const payload = {
        title: 'new thread',
        body: 'body thread',
        owner: ownerId,
      }

      const newThread = new NewThread(payload)

      const fakeIdGenerator = () => '123'
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      await threadRepositoryPostgres.addThread(newThread)

      const thread = await ThreadsTableTestHelper.findThreadById(
        `thread-${fakeIdGenerator()}`
      )
      expect(thread).toHaveLength(1)
    })

    it('should return new thread correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'testuser',
      })

      const payload = {
        title: 'new thread',
        body: 'body thread',
        owner: ownerId,
      }

      const newThread = new NewThread(payload)
      const fakeIdGenerator = () => '123'

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      const addedThread = await threadRepositoryPostgres.addThread(newThread)

      expect(addedThread).toStrictEqual(
        new AddedThread({
          id: `thread-${fakeIdGenerator()}`,
          title: payload.title,
          owner: ownerId,
        })
      )
    })
  })

  // describe('getThreadById', () => {
  //   it('should throw NotFound error when thread not found', async () => {
  //     const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

  //     await expect(
  //       threadRepositoryPostgres.getThreadById('thread-000')
  //     ).rejects.toThrow(NotFoundError)
  //   })

  //   it('should return correct thread', async () => {
  //     const ownerId = await UsersTableTestHelper.addUser({
  //       username: 'testuser',
  //     })
  //     const threadId = await ThreadsTableTestHelper.adddThread({
  //       owner: ownerId,
  //     })

  //     const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {})

  //     const thread = await threadRepositoryPostgres.getThreadById(threadId)

  //     expect(thread.id).toEqual(threadId)
  //     expect(thread.username).toEqual('testuser')
  //   })
  // })
})
