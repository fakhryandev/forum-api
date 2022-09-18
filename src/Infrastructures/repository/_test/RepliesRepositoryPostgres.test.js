const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const pool = require('../../database/postgres/pool')
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres')
const NewReplies = require('../../../Domains/replies/entities/NewReplies')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')

describe('RepliesRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addReplies method', () => {
    it('should presist new replies', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'testuser',
      })
      const threadId = await ThreadsTableTestHelper.addThread({
        owner: ownerId,
      })
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: threadId,
        owner_id: ownerId,
      })
      const fakeIdGenerator = () => '123456'
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        fakeIdGenerator
      )
      const newReplies = new NewReplies({
        content: 'reply content',
        owner: ownerId,
        commentId,
        threadId,
      })
      await repliesRepositoryPostgres.addReplies(newReplies)
      // const expectedAddedReplies = new AddedReply({
      //   id: `reply-${fakeIdGenerator()}`,
      //   content: newReplies.content,
      //   ownerId: newReplies.owner
      // })
      const replies = await RepliesTableTestHelper.findRepliesById(
        `reply-${fakeIdGenerator()}`
      )
      expect(replies).toHaveLength(1)
    })

    it('should return new replies correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'testuser',
      })
      const threadId = await ThreadsTableTestHelper.addThread({
        owner: ownerId,
      })
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: threadId,
        owner_id: ownerId,
      })
      const fakeIdGenerator = () => '123456'
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      const payload = {
        content: 'reply content',
        owner: ownerId,
        commentId,
        threadId,
      }

      const newReplies = new NewReplies(payload)

      const addedReplies = await repliesRepositoryPostgres.addReplies(
        newReplies
      )

      expect(addedReplies).toStrictEqual(
        new AddedReply({
          id: `reply-${fakeIdGenerator()}`,
          content: payload.content,
          owner_id: ownerId,
        })
      )
    })
  })
})
