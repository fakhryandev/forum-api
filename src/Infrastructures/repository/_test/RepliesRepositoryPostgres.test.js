const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const pool = require('../../database/postgres/pool')
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres')
const NewReplies = require('../../../Domains/replies/entities/NewReplies')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

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

  describe('getRepliesByComment method', () => {
    it('should return replies by comment id correctly', async () => {
      const currentDate = new Date()

      const ownerId = await UsersTableTestHelper.addUser({
        username: 'testuser',
      })
      const userReplyId = await UsersTableTestHelper.addUser({
        username: 'replyuser',
        id: 'test-235',
      })
      const threadId = await ThreadsTableTestHelper.addThread({
        owner: ownerId,
      })
      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: threadId,
        owner_id: ownerId,
      })

      const payload = {
        owner_id: userReplyId,
        commentId,
        threadId,
        content: 'newnew',
        date: currentDate,
      }

      const addedReplies = await RepliesTableTestHelper.addReplies(payload)

      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      const replies = await repliesRepositoryPostgres.getRepliesByCommentId([
        commentId,
      ])

      expect(replies).toHaveLength(1)
      expect(replies[0].id).toEqual(addedReplies)
      expect(replies[0].username).toEqual('replyuser')
      expect(replies[0].content).toEqual('newnew')
      expect(replies[0].owner_id).toEqual(userReplyId)
      expect(replies[0].comment_id).toEqual(commentId)
      expect(replies[0].date).toEqual(currentDate)
      expect(replies[0].is_delete).toBeFalsy()
    })
  })

  describe('deleteRepliesById method', () => {
    it('should throw NotFoundError when id not found', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      await expect(
        repliesRepositoryPostgres.deleteRepliesById('replies-123')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should update is_delete column', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

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

      const repliesId = await RepliesTableTestHelper.addReplies({
        content: 'reply content',
        owner: ownerId,
        commentId,
        threadId,
      })

      await repliesRepositoryPostgres.deleteRepliesById(repliesId)

      const deletedReplies = await RepliesTableTestHelper.findRepliesById(
        repliesId
      )
      expect(deletedReplies[0].is_delete).toBeTruthy()
    })
  })

  describe('verifyReplyOwner method', () => {
    it('should throw NotFoundError when id not found', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      await expect(
        repliesRepositoryPostgres.verifyRepliesOwner('reply-123', 'user-456')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should throw AuthorizationError when owner unauthorized', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'testuser',
      })

      const threadId = await ThreadsTableTestHelper.addThread({
        owner: ownerId,
      })

      const commentId = await CommentsTableTestHelper.addComment({
        thread_id: threadId,
        id: 'comment-123',
      })

      await RepliesTableTestHelper.addReplies({
        content: 'reply content',
        owner_id: 'user-123',
        commentId,
      })

      await expect(
        repliesRepositoryPostgres.verifyRepliesOwner('reply-123', 'user-666')
      ).rejects.toThrowError(AuthorizationError)
    })

    it('should not throw AuthorizationError when owner authorized', async () => {
      const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {})

      const ownerId = await UsersTableTestHelper.addUser({
        username: 'testuser',
      })

      const threadId = await ThreadsTableTestHelper.addThread({
        owner: ownerId,
      })

      const commentId = await CommentsTableTestHelper.addComment({
        thread_id: threadId,
        id: 'comment-123',
      })

      const repliesId = await RepliesTableTestHelper.addReplies({
        content: 'reply content',
        owner_id: 'user-123',
        commentId,
      })

      await expect(
        repliesRepositoryPostgres.verifyRepliesOwner(repliesId, 'user-123')
      ).resolves.not.toThrowError(AuthorizationError)
    })
  })
})
