const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper')
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('/likes endpoint', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable()
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await AuthenticationsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('when PUT /likes', () => {
    it('should response 200 and like comment correctly', async () => {
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
        method: 'PUT',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
    })

    it('should response 200 and unlike comment correctly when not liked', async () => {
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

      await server.inject({
        method: 'PUT',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/likes`,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}/likes`,
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
