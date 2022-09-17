const AddedComment = require('../AddedComment')

describe('AddedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      owner: 'user-123',
    }

    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type', () => {
    const payload = {
      id: 'comment-123',
      content: 123,
      owner_id: ['user-123'],
    }

    expect(() => new AddedComment(payload)).toThrowError(
      'ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should create newComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      content: 'new comment',
      owner_id: 'user-234',
    }

    const newComment = new AddedComment(payload)

    expect(newComment.id).toEqual(payload.id)
    expect(newComment.content).toEqual(payload.content)
    expect(newComment.owner).toEqual(payload.owner_id)
  })
})
