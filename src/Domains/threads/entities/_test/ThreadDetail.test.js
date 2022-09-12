describe('ThreadDetail entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      id: 'thread-123',
      title: 'thread title',
      body: 'thread body',
      date: new Date(),
      comments: [],
    }
  })
})
