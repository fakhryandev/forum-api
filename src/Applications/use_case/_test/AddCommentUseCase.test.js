const { payload } = require('@hapi/hapi/lib/validation')
const CommentRepository = require('../../../Domains/comments/CommentRepository')
const AddedComment = require('../../../Domains/comments/entities/AddedComment')
const NewComment = require('../../../Domains/comments/entities/NewComment')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const AddCommentUseCase = require('../AddCommentUseCase')

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      threadId: 'thread-123',
      content: 'new content',
      owner: 'user-123',
    }

    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner_id: useCasePayload.owner,
    })

    const mockThreadRepository = new ThreadRepository()
    const mockCommentRepository = new CommentRepository()

    mockThreadRepository.verifyAvailableThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment))

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    })

    const addedComment = await addCommentUseCase.execute(useCasePayload)

    expect(addedComment).toStrictEqual(expectedAddedComment)
    expect(mockThreadRepository.verifyAvailableThreadById).toBeCalledWith(
      useCasePayload.threadId
    )
    expect(mockCommentRepository.addComment).toBeCalledWith(
      new NewComment(useCasePayload)
    )
  })
})
