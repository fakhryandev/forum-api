const CommentRepository = require('../../../Domains/comments/CommentRepository')
const DetailComment = require('../../../Domains/comments/entities/DetailComment')
const RepliesRepository = require('../../../Domains/replies/RepliesRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase')

describe('GetDetailThreadUseCase', () => {
  it('should orchestrating the detail thread action correctly', async () => {
    const currentDate = new Date()
    const nextHour = new Date(currentDate.setHours(currentDate.getHours + 1))

    const useCasePayload = {
      threadId: 'thread-123',
    }

    const mockRepliesRepository = new RepliesRepository()
    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockThreadRepository.getThreadById = jest.fn().mockImplementation(() =>
      Promise.resolve({
        id: 'thread-123',
        title: 'new thread',
        body: 'new thread body',
        date: currentDate,
        username: 'testuser',
      })
    )

    mockCommentRepository.getCommentsByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          new DetailComment({
            id: 'comment-123',
            username: 'test-user-comment',
            date: currentDate,
            content: 'new comment content',
            is_delete: false,
            like: 1,
          }),
        ])
      )
    mockRepliesRepository.getRepliesByCommentId = jest.fn(() =>
      Promise.resolve([
        {
          id: 'reply-123',
          username: 'test-user',
          date: currentDate,
          content: 'new replies',
          is_delete: false,
          comment_id: 'comment-123',
        },
        {
          id: 'reply-456',
          username: 'test-user2',
          date: nextHour,
          content: 'another replies content',
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

    expect(thread.id).toStrictEqual(useCasePayload.threadId)
    expect(thread.title).toStrictEqual('new thread')
    expect(thread.body).toStrictEqual('new thread body')
    expect(thread.username).toStrictEqual('testuser')
    expect(thread.date).toStrictEqual(currentDate)

    expect(thread.comments).toHaveLength(1)
    expect(thread.comments[0].id).toStrictEqual('comment-123')
    expect(thread.comments[0].username).toStrictEqual('test-user-comment')
    expect(thread.comments[0].content).toStrictEqual('new comment content')
    expect(thread.comments[0].date).toStrictEqual(currentDate)

    expect(thread.comments[0].replies).toHaveLength(2)
    expect(thread.comments[0].replies[0].id).toStrictEqual('reply-123')
    expect(thread.comments[0].replies[0].username).toStrictEqual('test-user')
    expect(thread.comments[0].replies[0].content).toStrictEqual('new replies')
    expect(thread.comments[0].replies[0].date).toStrictEqual(currentDate)

    expect(thread.comments[0].replies[1].id).toStrictEqual('reply-456')
    expect(thread.comments[0].replies[1].username).toStrictEqual('test-user2')
    expect(thread.comments[0].replies[1].content).toStrictEqual(
      'another replies content'
    )
    expect(thread.comments[0].replies[1].date).toStrictEqual(nextHour)
  })
})
