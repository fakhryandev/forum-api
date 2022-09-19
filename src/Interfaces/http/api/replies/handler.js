const AddRepliesUseCase = require('../../../../Applications/use_case/AddRepliesUseCase')
const DeleteRepliesUseCase = require('../../../../Applications/use_case/DeleteRepliesUseCase')

class RepliesHandler {
  constructor(container) {
    this._container = container

    this.postRepliesHandler = this.postRepliesHandler.bind(this)
    this.deleteRepliesHandler = this.deleteRepliesHandler.bind(this)
  }

  async postRepliesHandler(request, h) {
    const addRepliesUseCase = this._container.getInstance(
      AddRepliesUseCase.name
    )
    const { id: owner } = request.auth.credentials
    const threadId = request.params.threadId
    const commentId = request.params.commentId

    const addedReply = await addRepliesUseCase.execute({
      owner,
      threadId,
      commentId,
      ...request.payload,
    })

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    })
    response.code(201)

    return response
  }

  async deleteRepliesHandler(request, h) {
    const deleteRepliesUseCase = this._container.getInstance(
      DeleteRepliesUseCase.name
    )

    const { id: owner } = request.auth.credentials
    const { threadId, commentId, repliesId } = request.params

    await deleteRepliesUseCase.execute({
      threadId,
      commentId,
      owner,
      repliesId,
    })

    const response = h.response({
      status: 'success',
    })
    response.code(200)

    return response
  }
}

module.exports = RepliesHandler
