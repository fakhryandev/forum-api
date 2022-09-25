const LikeRepository = require("../LikeRepository");

describe('LikeRepository interface', () => {
    it('should throw error when invoke unimplemented method', async () => {
        const likeRepository = new LikeRepository() 

        await expect(likeRepository.like('', '')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(likeRepository.unlike('')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
        await expect(likeRepository.isLiked('', '')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    });
});