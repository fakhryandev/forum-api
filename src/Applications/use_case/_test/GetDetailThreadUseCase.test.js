const CommentRepository = require('../../../Domains/comments/CommentRepository')
const RepliesRepository = require('../../../Domains/replies/RepliesRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase')

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
    }

    const mockRepliesRepository = new RepliesRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockThreadRepository.getThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ id: 'thread-123' }))

    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() => Promise.resolve([{ id: 'comment-123' }]))
    mockRepliesRepository.getRepliesByCommentId = jest.fn(() =>
      Promise.resolve([
        {
          id: 'reply-123',
          username: 'test-user',
          date: new Date(),
          content: 'new replies',
          is_delete: false,
          comment_id: 'comment-123',
        },
      ])
    )

    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    })

    const thread = await getDetailThreadUseCase.execute(useCasePayload)

    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload)

    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(
      useCasePayload
    )

    expect(mockRepliesRepository.getRepliesByCommentId).toBeCalledWith([
      'comment-123',
    ])

    expect(thread.id).toEqual(useCasePayload.threadId)
    expect(thread.comments).toHaveLength(1)
    expect(thread.comments[0].id).toEqual('comment-123')
    expect(thread.comments[0].replies).toHaveLength(1)
    expect(thread.comments[0].replies[0].id).toEqual('reply-123')
  })
})
