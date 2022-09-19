const routes = (handler) => [
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: handler.postRepliesHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{repliesId}',
    handler: handler.deleteRepliesHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]

module.exports = routes
