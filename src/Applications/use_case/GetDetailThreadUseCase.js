class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload)

    const comments = await this._commentRepository.getCommentsByThreadId(
      useCasePayload
    )

    return { ...thread, comments }
  }
}

module.exports = GetDetailThreadUseCase
