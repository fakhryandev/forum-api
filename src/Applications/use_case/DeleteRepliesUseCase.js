class DeleteRepliesUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._repliesRepository = repliesRepository
  }

  async execute(useCasePayload) {
    const { threadId, owner, commentId, repliesId } = useCasePayload

    await this._threadRepository.verifyAvailableThreadById(threadId)
    await this._commentRepository.verifyAvailableComment(commentId)
    await this._repliesRepository.verifyRepliesOwner(repliesId, owner)
    await this._repliesRepository.deleteRepliesById(repliesId)
  }
}

module.exports = DeleteRepliesUseCase
