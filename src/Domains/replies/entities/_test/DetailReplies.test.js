const DetailReplies = require('../DetailReplies')

describe('DetailReplies entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'reply-123',
      date: new Date('2021-08-08T07:22:33.555Z'),
      is_delete: false,
    }

    expect(() => new DetailReplies(payload)).toThrowError(
      'DETAIL_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: '2021-08-08T07:22:33.555Z',
      content: 12356,
      is_delete: 'false',
    }

    expect(() => new DetailReplies(payload)).toThrowError(
      'DETAIL_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should change content to deleted if is_delete', () => {
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: new Date('2021-08-08T07:22:33.555Z'),
      content: 'content comment',
      is_delete: true,
    }

    const detailReplies = new DetailReplies(payload)

    expect(detailReplies.content).toBe('**balasan telah dihapus**')
  })

  it('should create detailReplies object correctly', () => {
    const payload = {
      id: 'reply-123',
      username: 'user-123',
      date: new Date('2021-08-08T07:22:33.555Z'),
      content: 'content comment',
      is_delete: false,
    }

    const detailReplies = new DetailReplies(payload)

    expect(detailReplies.id).toEqual(payload.id)
    expect(detailReplies.username).toEqual(payload.username)
    expect(detailReplies.date).toEqual(payload.date)
    expect(detailReplies.content).toEqual(payload.content)
  })
})
