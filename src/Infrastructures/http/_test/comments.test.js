const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper')
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('/comments endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable()
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /comments', () => {
    it('should response 401 if request not contain access token', async () => {
      const server = await createServer(container)

      const newCommentPayload = {
        content: 'new-comment',
      }

      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: {
          newCommentPayload,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
    })

    it('should response 404 if thread not valid', async () => {
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

      const response = await server.inject({
        method: 'POST',
        url: '/threads/xxx/comments',
        payload: {
          newCommentPayload,
        },
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })

    it('should response 400 if payload not contain needed property', async () => {
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

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: {},
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      )
    })

    it('should response 400 if payload not meet data type specification', async () => {
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
        content: true,
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

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: newCommentPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai'
      )
    })

    it('should response 201 and persisted comment', async () => {
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

      const response = await server.inject({
        method: 'POST',
        url: `/threads/${responseThread.data.addedThread.id}/comments`,
        payload: newCommentPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)

      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedComment.content).toBeDefined()
      expect(responseJson.data.addedComment.content).toEqual(
        newCommentPayload.content
      )
    })
  })

  describe('when DELETE /comments', () => {
    it('should return 404 when comment not found', async () => {
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

      const commentId = 'comment-unknowncomment'

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('comment tidak ditemukan')
    })

    it('should response 403 when comment delete by another user', async () => {
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

      const otherRegisterPayload = {
        username: 'othertestuser',
        password: 'password',
        fullname: 'Test User',
      }

      const otherLoginPayload = {
        username: 'othertestuser',
        password: 'password',
      }

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: otherRegisterPayload,
      })

      const otherAuth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: otherLoginPayload,
      })

      const responseOtherAuth = JSON.parse(otherAuth.payload)

      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}`,
        headers: {
          Authorization: `Bearer ${responseOtherAuth.data.accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(403)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('anda tidak memiliki akses')
    })

    it('should response 200 and comment deleted', async () => {
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
        method: 'DELETE',
        url: `/threads/${responseThread.data.addedThread.id}/comments/${responseComment.data.addedComment.id}`,
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
