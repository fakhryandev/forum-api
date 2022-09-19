class RepliesRepository {
  async addReplies(newReplies) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async getRepliesByCommentId(commentId) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async verifyRepliesOwner(repliesId, owner) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }

  async deleteRepliesById(id) {
    throw new Error('REPLIES_REPOSITORY.METHOD_NOT_IMPLEMENTED')
  }
}

module.exports = RepliesRepository
