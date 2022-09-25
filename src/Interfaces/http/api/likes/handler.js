const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase')

class LikesHandler {
  constructor(container) {
    this._container = container

    this.likeCommentHandler = this.likeCommentHandler.bind(this)
  }

  async likeCommentHandler(request, h) {
    const likeCommentUseCase = this._container.getInstance(
      LikeCommentUseCase.name
    )
    const { id: userId } = request.auth.credentials
    const threadId = request.params.threadId
    const commentId = request.params.commentId

    await likeCommentUseCase.execute({
      threadId,
      commentId,
      userId,
    })

    return {
      status: 'success',
    }
  }
}

module.exports = LikesHandler
