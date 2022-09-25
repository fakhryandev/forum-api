const DetailComment = require('../DetailComment')

describe('DetailComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'comment-123',
      date: new Date('2021-08-08T07:22:33.555Z'),
      is_delete: false,
    }

    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    )
  })

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '2021-08-08T07:22:33.555Z',
      content: 12356,
      is_delete: 'false',
      like: 0,
    }

    expect(() => new DetailComment(payload)).toThrowError(
      'DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    )
  })

  it('should change content to deleted if is_delete', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: new Date('2021-08-08T07:22:33.555Z'),
      content: 'content comment',
      is_delete: true,
      like: 0,
    }

    const detailComment = new DetailComment(payload)

    expect(detailComment.content).toBe('**komentar telah dihapus**')
  })

  it('should create detailComment object correctly', () => {
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: new Date('2021-08-08T07:22:33.555Z'),
      content: 'content comment',
      is_delete: false,
      like: 1,
    }

    const detailComment = new DetailComment(payload)

    expect(detailComment.id).toEqual(payload.id)
    expect(detailComment.username).toEqual(payload.username)
    expect(detailComment.date).toEqual(payload.date)
    expect(detailComment.content).toEqual(payload.content)
  })
})
