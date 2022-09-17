class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload)
    this._handlerDeletedContent(payload)
    const { id, username, date } = payload

    this.id = id
    this.username = username
    this.date = date
  }

  _handlerDeletedContent(payload) {
    const { content, is_delete } = payload
    this.content = content

    if (is_delete) {
      this.content = '**komentar telah dihapus**'
    }
  }

  _verifyPayload(payload) {
    const { id, username, date, content, is_delete } = payload

    if (!id || !username || !date || !content || is_delete === undefined) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof date !== 'object' ||
      typeof content !== 'string' ||
      typeof is_delete !== 'boolean'
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = DetailComment
