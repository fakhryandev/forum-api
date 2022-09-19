const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('/replies endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /replies', () => {
    it('should response 201 and persisted replies', async () => {
      const server = await createServer(container)

      const registerPayload = {
        username: 'testuser',
        password: 'password',
        fullname: 'Test User',
      }

      const loginPayload = {
        username: 'testuser',
        password: 'password',
      }

      const newThreadPayload = {
        title: 'thread-title',
        body: 'thread-body',
      }

      const newCommentPayload = {
        content: 'new-comment',
      }

      const newRepliesPayload = {
        content: 'new-replies',
      }

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerPayload,
      })

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      })

      const responseAuth = JSON.parse(auth.payload)

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: newThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseThread = JSON.parse(thread.payload)

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: newCommentPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseComment = JSON.parse(comment.payload)

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
        payload: newRepliesPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedReply).toBeDefined()
    })
  })

  describe('when DELETE /replies', () => {
    it('should response 200 and replies deleted', async () => {
      const server = await createServer(container)

      const registerPayload = {
        username: 'testuser',
        password: 'password',
        fullname: 'Test User',
      }

      const loginPayload = {
        username: 'testuser',
        password: 'password',
      }

      const newThreadPayload = {
        title: 'thread-title',
        body: 'thread-body',
      }

      const newCommentPayload = {
        content: 'new-comment',
      }

      const newRepliesPayload = {
        content: 'new-replies',
      }

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: registerPayload,
      })

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      })

      const responseAuth = JSON.parse(auth.payload)

      const thread = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: newThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseThread = JSON.parse(thread.payload)

      const comment = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: newCommentPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseComment = JSON.parse(comment.payload)

      const replies = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies`,
        payload: newRepliesPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const repliesJson = JSON.parse(replies.payload)

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/replies/${repliesJson.data.addedReply.id}`,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })
  })
})
