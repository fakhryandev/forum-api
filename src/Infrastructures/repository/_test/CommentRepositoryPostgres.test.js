const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const pool = require('../../database/postgres/pool')
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')

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
})
