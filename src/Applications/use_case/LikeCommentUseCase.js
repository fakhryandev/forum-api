class LikeCommentUseCase {
  constructor({ commentRepository, likeRepository }) {
    this._commentRepository = commentRepository
    this._likeRepository = likeRepository
  }

  async execute(useCasePayload) {
    const { commentId, userId } = useCasePayload

    await this._commentRepository.verifyAvailableComment(commentId)
    const likeId = await this._likeRepository.isLiked(commentId, userId)

    if (!likeId) {
      await this._likeRepository.like(commentId, userId)
    } else {
      await this._likeRepository.unlike(likeId)
    }
  }
}

module.exports = LikeCommentUseCase
