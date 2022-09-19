const NewReplies = require('../../Domains/replies/entities/NewReplies')

class AddRepliesUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._repliesRepository = repliesRepository
  }

  async execute(useCasePayload) {
    const newReplies = new NewReplies(useCasePayload)

    await this._threadRepository.verifyAvailableThreadById(newReplies.threadId)
    await this._commentRepository.verifyAvailableComment(newReplies.commentId)

    const addedReplies = await this._repliesRepository.addReplies(newReplies)

    return addedReplies
  }
}

module.exports = AddRepliesUseCase
