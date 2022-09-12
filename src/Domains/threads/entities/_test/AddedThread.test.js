const AddedThread = require('../AddedThread')

describe('AddedThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'new thread',
    }

    expect(() => new AddedThread(payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      title: 'new thread',
      owner: true,
    }

    expect(() => new AddedThread(payload)).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create newThread object correctly', () => {
    const payload = {
      id: 'thread-123',
      title: 'new thread',
      owner: 'user-123',
    }

    const newThread = new AddedThread(payload)

    expect(newThread.id).toEqual(payload.id)
    expect(newThread.title).toEqual(payload.title)
    expect(newThread.owner).toEqual(payload.owner)
  })
})
