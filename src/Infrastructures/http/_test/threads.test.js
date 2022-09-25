const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper')
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper')
const container = require('../../container')
const pool = require('../../database/postgres/pool')
const createServer = require('../createServer')

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end()
  })

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable()
    await UsersTableTestHelper.cleanTable()
  })

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
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

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: newThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(201)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.addedThread.title).toBeDefined()
      expect(responseJson.data.addedThread.title).toEqual(
        newThreadPayload.title
      )
    })

    it('should response 401 if request not contain access token', async () => {
      const server = await createServer(container)

      const newThreadPayload = {
        title: 'thread-title',
        body: 'thread-body',
      }

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { newThreadPayload },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(401)
      expect(responseJson.error).toEqual('Unauthorized')
      expect(responseJson.message).toEqual('Missing authentication')
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
        url: '/threads',
        payload: newThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
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
        body: ['new thread', 'thread baru'],
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
        url: '/threads',
        payload: newThreadPayload,
        headers: {
          Authorization: `Bearer ${responseAuth.data.accessToken}`,
        },
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(400)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      )
    })
  })

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread detail correctly', async () => {
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
        method: 'GET',
        url: `/threads/${responseThread.data.addedThread.id}`,
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(200)
      expect(responseJson.status).toEqual('success')
      expect(responseJson.data.thread).toBeDefined()
    })

    it('should return 404 if thread not found', async () => {
      const server = await createServer(container)
      const threadId = 'thread-unknown'

      const response = await server.inject({
        method: 'GET',
        url: `/threads/${threadId}`,
      })

      const responseJson = JSON.parse(response.payload)
      expect(response.statusCode).toEqual(404)
      expect(responseJson.status).toEqual('fail')
      expect(responseJson.message).toEqual('thread tidak ditemukan')
    })
  })
})
