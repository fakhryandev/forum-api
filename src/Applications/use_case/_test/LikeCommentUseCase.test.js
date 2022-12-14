const CommentRepository = require('../../../Domains/comments/CommentRepository')
const LikeRepository = require('../../../Domains/likes/LikeRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const LikeCommentUseCase = require('../LikeCommentUseCase')

describe('LikeCommentUseCase', () => {
  it('should handle like correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-234',
      userId: 'user-234',
    }

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockLikeRepository = new LikeRepository()

    mockThreadRepository.verifyAvailableThreadById = jest.fn(() =>
      Promise.resolve()
    )
    mockCommentRepository.verifyAvailableComment = jest.fn(() =>
      Promise.resolve()
    )
    mockLikeRepository.isLiked = jest.fn(() => Promise.resolve(null))
    mockLikeRepository.like = jest.fn(() => Promise.resolve())

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    })

    await likeCommentUseCase.execute(useCasePayload)

    expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(
      useCasePayload.threadId
    )

    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId
    )
    expect(mockLikeRepository.isLiked).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId
    )
    expect(mockLikeRepository.like).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId
    )
  })

  it('should handle unlike correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-234',
      commentId: 'comment-234',
      userId: 'user-234',
    }

    const mockCommentRepository = new CommentRepository()
    const mockLikeRepository = new LikeRepository()
    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.verifyAvailableThreadById = jest.fn(() =>
      Promise.resolve()
    )
    mockCommentRepository.verifyAvailableComment = jest.fn(() =>
      Promise.resolve()
    )
    mockLikeRepository.isLiked = jest.fn(() => Promise.resolve('like-123'))
    mockLikeRepository.unlike = jest.fn(() => Promise.resolve())
    mockLikeRepository.like = jest.fn(() => Promise.resolve())

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    })

    await likeCommentUseCase.execute(useCasePayload)

    expect(mockThreadRepository.verifyAvailableThreadById).toHaveBeenCalledWith(
      useCasePayload.threadId
    )
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId
    )
    expect(mockLikeRepository.isLiked).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.userId
    )
    expect(mockLikeRepository.unlike).toBeCalledWith('like-123')
    expect(mockLikeRepository.like).not.toBeCalled()
  })
})
