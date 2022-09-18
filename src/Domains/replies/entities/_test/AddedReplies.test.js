const AddedReply = require('../AddedReply')

describe('AddedReply entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      owner: 'user-123',
    }

    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload not meet data type', () => {
    const payload = {
      id: 'reply-123',
      content: ['replyreply'],
      owner: true,
    }

    expect(() => new AddedReply(payload)).toThrowError(
      'ADDED_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create addedReply object correctly', () => {
    const payload = {
      id: 'reply-123',
      content: 'reply reply',
      owner: 'user-123',
    }

    const addedReplies = new AddedReply(payload)

    expect(addedReplies.id).toEqual(payload.id)
    expect(addedReplies.content).toEqual(payload.content)
    expect(addedReplies.owner).toEqual(payload.owner)
  })
})
