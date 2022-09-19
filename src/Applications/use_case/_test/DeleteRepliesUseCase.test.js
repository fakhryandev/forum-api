const CommentRepository = require('../../../Domains/comments/CommentRepository')
const RepliesRepository = require('../../../Domains/replies/RepliesRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const DeleteRepliesUseCase = require('../DeleteRepliesUseCase')

describe('DeleteRepliesUseCase', () => {
  it('should orchestrating the delete replies action correctly', async () => {
    const useCasePayload = {
      repliesId: 'reply-23',
      content: 'content replies',
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    }

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockRepliesRepository = new RepliesRepository()

    mockThreadRepository.verifyAvailableThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    mockRepliesRepository.verifyRepliesOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockRepliesRepository.deleteRepliesById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    const deleteRepliesUseCase = new DeleteRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    })

    await deleteRepliesUseCase.execute(useCasePayload)

    expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(
      useCasePayload.threadId
    )
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId
    )
    expect(mockRepliesRepository.verifyRepliesOwner).toBeCalledWith(
      useCasePayload.repliesId,
      useCasePayload.owner
    )
    expect(mockRepliesRepository.deleteRepliesById).toBeCalledWith(
      useCasePayload.repliesId
    )
  })
})
