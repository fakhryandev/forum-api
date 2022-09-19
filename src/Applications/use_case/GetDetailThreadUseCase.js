const DetailReplies = require('../../Domains/replies/entities/DetailReplies')

class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, repliesRepository }) {
    this._threadRepository = threadRepository
    this._commentRepository = commentRepository
    this._repliesRepository = repliesRepository
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getThreadById(useCasePayload)
    const comments = await this._commentRepository.getCommentsByThreadId(
      useCasePayload
    )

    const commentId = comments.map((comment) => comment.id)

    const replies = await this._repliesRepository.getRepliesByCommentId(
      commentId
    )

    const commentsWithReplies = []
    for (const comment of comments) {
      const commentReplies = replies
        .filter((reply) => reply.comment_id === comment.id)
        .map((reply) => new DetailReplies({ ...reply }))
        .sort((a, b) => a.date - b.date)
      commentsWithReplies.push({
        ...comment,
        replies: commentReplies,
      })
    }

    return { ...thread, comments: commentsWithReplies }
  }
}

module.exports = GetDetailThreadUseCase
