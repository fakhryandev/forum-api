const DetailThread = require('../DetailThread')

describe('DetailThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      comments: [],
    }

    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'thread-123',
      title: 'new-thread',
      body: true,
      date: '2021-08-08T07:19:09.775Z',
      username: 'testuser',
    }

    expect(() => new DetailThread(payload)).toThrowError(
      'DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create detailThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'new-thread',
      body: 'new body thread',
      date: '2021-08-08T07:19:09.775Z',
      username: 'testuser',
    }

    const detailThread = new DetailThread(payload)

    expect(detailThread.id).toEqual(payload.id)
    expect(detailThread.title).toEqual(payload.title)
    expect(detailThread.body).toEqual(payload.body)
    expect(detailThread.date).toEqual(payload.date)
    expect(detailThread.username).toEqual(payload.username)
  })
})
