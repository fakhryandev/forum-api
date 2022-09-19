const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddedReply = require('../../../Domains/replies/entities/AddedReply')
const NewReplies = require('../../../Domains/replies/entities/NewReplies')
const RepliesRepository = require('../../../Domains/replies/RepliesRepository')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddRepliesUseCase = require('../AddRepliesUseCase')

describe('AddRepliesUseCase', () => {
  it('should orchestrating the add replies action correctly', async () => {
    const useCasePayload = {
      content: 'content replies',
      owner: 'user-123',
      commentId: 'comment-123',
      threadId: 'thread-123',
    }

    const expectedAddedReplies = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner_id: useCasePayload.owner,
    })

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()
    const mockRepliesRepository = new RepliesRepository()

    mockThreadRepository.verifyAvailableThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    mockCommentRepository.verifyAvailableComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve())

    mockRepliesRepository.addReplies = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedReplies))

    const addRepliesUseCase = new AddRepliesUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      repliesRepository: mockRepliesRepository,
    })

    const addedReplies = await addRepliesUseCase.execute(useCasePayload)

    expect(addedReplies).toStrictEqual(expectedAddedReplies)
    expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(
      useCasePayload.threadId
    )
    expect(mockCommentRepository.verifyAvailableComment).toBeCalledWith(
      useCasePayload.commentId
    )
    expect(mockRepliesRepository.addReplies).toBeCalledWith(
      new NewReplies(useCasePayload)
    )
  })
})
