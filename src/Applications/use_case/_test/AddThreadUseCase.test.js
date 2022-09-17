const AddThreadUseCase = require('../AddThreadUseCase')
const ThreadRepository = require('../../../Domains/threads/ThreadRepository')
const NewThread = require('../../../Domains/threads/entities/NewThread')
const AddedThread = require('../../../Domains/threads/entities/AddedThread')

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'new thread title',
      body: 'new thread body',
      owner: 'user-123',
    }

    const expectedAddedThread = new AddedThread({
      id: 'thread-123',
      title: useCasePayload.title,
      owner: useCasePayload.owner,
    })

    const mockThreadRepository = new ThreadRepository()

    mockThreadRepository.addThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedAddedThread))

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    })

    const addedThread = await addThreadUseCase.execute(useCasePayload)

    expect(addedThread).toStrictEqual(expectedAddedThread)
    expect(mockThreadRepository.addThread).toBeCalledWith(
      new NewThread(useCasePayload)
    )
  })
})
