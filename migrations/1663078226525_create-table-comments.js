exports.up = (pgm) => {
  pgm.createTable('comments', {
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
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
      default: pgm.func('current_timestamp')
    },
    is_delete: {
      type: 'BOOLEAN',
      default: false,
    },
  })

  pgm.createConstraint(
    'comments',
    'fk_comments.owner_id_users.id',
    'FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE'
  )

  pgm.createConstraint(
    'comments',
    'fk_comments.thread_id_threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments.owner_id_users.id')
  pgm.dropConstraint('comments', 'fk_comments.thread_id_threads.id')
  pgm.dropTable('comments')
}
