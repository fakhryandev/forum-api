exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  })

  pgm.createConstraint(
    'likes',
    'fk_likes.comment_id.comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE'
  )

  pgm.createConstraint(
    'likes',
    'fk_likes.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => {
  pgm.dropConstraint('likes', 'fk_likes.comment_id.comments.id')
  pgm.dropConstraint('likes', 'fk_likes.user_id_users.id')
  pgm.dropTable('likes')
}
