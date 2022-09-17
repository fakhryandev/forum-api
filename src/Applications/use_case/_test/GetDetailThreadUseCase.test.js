const CommentRepository = require('../../../Domains/comments/CommentRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase')

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    }

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: 'thread-123' }))

    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([{ id: 'comment-123' }]))

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    })

    const thread = await getDetailThreadUseCase.execute(useCasePayload)

    expect(mockThreadRepository.getThreadById).toBeCalledWith(
      useCasePayload.threadId
    )

    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload.threadId
    )

    expect(thread.id).toEqual(useCasePayload.threadId)
    expect(thread.comments).toHaveLength(1)
    expect(thread.comments[0].id).toEqual('comment-123')
  })
})
