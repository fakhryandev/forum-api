const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const NotFoundError = require('../../../Commons/exceptions/NotFoundError')
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError')

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('addComment method', () => {
    it('should presist new comment', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'testuser',
      })

      const threadId = await ThreadsTableTestHelper.addThread({
        owner: ownerId,
      })

      const payload = {
        content: 'new comment',
        owner: ownerId,
        threadId,
      }

      const newComment = new NewComment(payload)

      const fakeIdGenerator = () => '1231455'
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      await commentRepositoryPostgres.addComment(newComment)

      const comment = await CommentsTableTestHelper.findCommentById(
        `comment-${fakeIdGenerator()}`
      )
      expect(comment).toHaveLength(1)
    })

    it('should return new comment correctly', async () => {
      const ownerId = await UsersTableTestHelper.addUser({
        username: 'testuser',
      })

      const threadId = await ThreadsTableTestHelper.addThread({
        owner: ownerId,
      })

      const payload = {
        content: 'new comment',
        owner: ownerId,
        threadId,
      }

      const newComment = new NewComment(payload)

      const fakeIdGenerator = () => '1231455'
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      )

      const addedComment = await commentRepositoryPostgres.addComment(
        newComment
      )

      expect(addedComment).toStrictEqual(
        new AddedComment({
          id: `comment-${fakeIdGenerator()}`,
          content: payload.content,
          owner_id: ownerId,
        })
      )
    })
  })

  describe('verifyAvailableComment method', () => {
    it('should throw NotFoundError when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await expect(
        commentRepositoryPostgres.verifyAvailableComment('comment-123')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should not throw NotFoundError when comment is exists', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      const ownerId = await UsersTableTestHelper.addUser({
        id: 'user-123',
      })

      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-234',
        owner: ownerId,
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: threadId,
        owner_id: ownerId,
      })

      await expect(
        commentRepositoryPostgres.verifyAvailableComment('comment-123')
      ).resolves.not.toThrowError(NotFoundError)
    })
  })

  describe('verifyCommentOwner method', () => {
    it('should throw NotFoundError when id not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')
      ).rejects.toThrowError(NotFoundError)
    })
    it('should throw AuthorizationError when owner unauthorized', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await CommentsTableTestHelper.addComment({
        owner_id: 'user-531',
        thread_id: 'thread-123',
      })

      await expect(
        commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-666')
      ).rejects.toThrowError(AuthorizationError)
    })

    it('should not throw AuthorizationError when owner authorized', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      const comment = await CommentsTableTestHelper.addComment({
        owner_id: 'user-531',
        thread_id: 'thread-123',
      })

      await expect(
        commentRepositoryPostgres.verifyCommentOwner(comment, 'user-531')
      ).resolves.not.toThrowError(AuthorizationError)
    })
  })

  describe('deleteCommentById method', () => {
    it('should throw NotFoundError when id not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      await expect(
        commentRepositoryPostgres.deleteCommentById('comment-123')
      ).rejects.toThrowError(NotFoundError)
    })

    it('should update is_delete column', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      const ownerId = await UsersTableTestHelper.addUser({
        id: 'user-123',
      })

      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-234',
        owner: ownerId,
      })

      const commentId = await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: threadId,
        owner_id: ownerId,
      })

      await commentRepositoryPostgres.deleteCommentById(commentId)

      const deletedComment = await CommentsTableTestHelper.findCommentById(
        commentId
      )
      expect(deletedComment[0].is_delete).toBeTruthy()
    })
  })

  describe('getCommentsByThreadId', () => {
    it('should return comments by thread id', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {})

      const ownerId = await UsersTableTestHelper.addUser({
        id: 'user-123',
      })

      const threadId = await ThreadsTableTestHelper.addThread({
        id: 'thread-234',
        owner: ownerId,
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        thread_id: threadId,
        owner_id: ownerId,
        content: 'comment 1',
      })

      await CommentsTableTestHelper.addComment({
        id: 'comment-789',
        thread_id: threadId,
        owner_id: ownerId,
      })

      await CommentsTableTestHelper.deleteCommentById('comment-789')

      const comments = await commentRepositoryPostgres.getCommentsByThreadId(
        'thread-234'
      )
      const [comment1, comment2] = comments

      expect(comments).toHaveLength(2)
      expect(comment1.username).toEqual('user-test')
      expect(comment1.content).toEqual('comment 1')
      expect(comment2.content).toEqual('**komentar telah dihapus**')
    })
  })
})
