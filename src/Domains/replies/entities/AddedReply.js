class AddedReply {
  constructor(payload) {
    this._verifyPayload(payload)
    const { id, content, owner_id: owner } = payload

    this.id = id
    this.content = content
    this.owner = owner
  }

  _verifyPayload(payload) {
    const { id, content, owner_id: owner } = payload

    if (!id || !content || !owner) {
      throw new Error('ADDED_REPLIES.NOT_CONTAIN_NEEDED_PROPERTY')
    }

    if (
      typeof id !== 'string' ||
      typeof content !== 'string' ||
      typeof owner !== 'string'
    ) {
      throw new Error('ADDED_REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION')
    }
  }
}

module.exports = AddedReply
