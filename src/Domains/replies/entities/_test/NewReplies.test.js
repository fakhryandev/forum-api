const NewReplies = require('../NewReplies')

describe('NewReplies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
    }

    expect(() => new NewReplies(payload)).toThrowError(
      'NEW_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload not meet data type', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: true,
      owner: 'user-123',
    }
    expect(() => new NewReplies(payload)).toThrowError(
      'NEW_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create newReplies object correctly', () => {
    const payload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      content: 'new-replies',
      owner: 'user-123',
    }

    const newReplies = new NewReplies(payload)

    expect(newReplies.threadId).toEqual(payload.threadId)
    expect(newReplies.commentId).toEqual(payload.commentId)
    expect(newReplies.content).toEqual(payload.content)
    expect(newReplies.owner).toEqual(payload.owner)
  })
})
