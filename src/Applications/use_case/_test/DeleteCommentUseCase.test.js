const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DeleteCommentUseCase = require('../DeleteCommentUseCase')

describe('DeleteCommentUseCase', () => {
  it('should orchestratiing the delete comment action correctly', async () => {
    const useCasePayload = {
      thread: 'thread-123',
      owner: 'user-123',
      comment: 'comment-123',
    }

    const mockCommentRepository = new CommentRepository()
    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.verifyAvailableThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteCommentById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    })

    await deleteCommentUseCase.execute(useCasePayload)

    expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(
      useCasePayload.thread
    )
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.comment,
      useCasePayload.owner
    )
    expect(mockCommentRepository.deleteCommentById).toBeCalledWith(
      useCasePayload.comment
    )
  })
})
