class LikeRepository{
    async like(commentId, userId){
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async unlike(likeId){
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }

    async isLiked(commentId, userId){
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED')
    }
}

module.exports = LikeRepository