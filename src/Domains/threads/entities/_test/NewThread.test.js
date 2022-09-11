const NewThread = require('../NewThread')

describe('NewThread entities', () => {
  it('should throw error when payload did not contain needed proeprty', () => {
    const payload = {
      title: 'new thread',
    }

    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload not meet data type', () => {
    const payload = {
      title: 123,
      body: ['body'],
      owner: true,
    }

    expect(() => new NewThread(payload)).toThrowError(
      'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create newThread object correctly', () => {
    const payload = {
      title: 'new thread',
      body: 'body thread',
      owner: 'user-123',
    }

    const newThread = new NewThread(payload)

    expect(newThread.title).toEqual(payload.title)
    expect(newThread.body).toEqual(payload.body)
    expect(newThread.owner).toEqual(payload.owner)
  })
})
