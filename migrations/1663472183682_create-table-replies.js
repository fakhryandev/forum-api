/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    owner_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
    },
    is_delete: {
      type: 'BOOLEAN',
      default: false,
    },
  })

  pgm.createConstraint(
    'replies',
    'fk_replies.owner_id_users.id',
    'FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE'
  )

  pgm.createConstraint(
    'replies',
    'fk_replies.comment_id_commets.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => {
  pgm.dropConstraint('replies', 'fk_replies.comment_id_commets.id')
  pgm.dropConstraint('replies', 'fk_replies.owner_id_users.id')
  pgm.dropTable('replies')
}
