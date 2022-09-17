class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository
    this._threadRepository = threadRepository
  }

  async execute(useCasePayload) {
    const { thread, owner, comment } = useCasePayload
    await this._threadRepository.verifyAvailableThreadById(thread)
    await this._commentRepository.verifyCommentOwner(comment, owner)
    await this._commentRepository.deleteCommentById(comment)
  }
}

module.exports = DeleteCommentUseCase
