migrate(
  (app) => {
    const chapters = new Collection({
      name: 'chapters',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true, max: 120 },
        { name: 'description', type: 'text', max: 500 },
        { name: 'emoji', type: 'text', max: 8 },
        { name: 'order', type: 'number', required: true, min: 1, onlyInt: true },
        {
          name: 'cover',
          type: 'file',
          maxSelect: 1,
          maxSize: 5242880,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
          thumbs: ['480x320'],
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_chapters_order ON chapters (order)'],
    })
    app.save(chapters)

    const posters = new Collection({
      name: 'posters',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true, max: 120 },
        { name: 'kid_text', type: 'text', max: 400 },
        { name: 'dad_tip', type: 'text', max: 1000 },
        {
          name: 'image',
          type: 'file',
          maxSelect: 1,
          maxSize: 10485760,
          mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
          thumbs: ['480x0', '960x0'],
        },
        {
          name: 'chapter',
          type: 'relation',
          required: true,
          collectionId: chapters.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'order', type: 'number', required: true, min: 1, onlyInt: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE INDEX idx_posters_chapter ON posters (chapter)',
        'CREATE INDEX idx_posters_chapter_order ON posters (chapter, order)',
      ],
    })
    app.save(posters)

    const progress = new Collection({
      name: 'poster_progress',
      type: 'base',
      listRule: '@request.auth.id = user',
      viewRule: '@request.auth.id = user',
      createRule: '@request.auth.id = user && @request.body.user = @request.auth.id',
      updateRule: '@request.auth.id = user',
      deleteRule: '@request.auth.id = user',
      fields: [
        {
          name: 'poster',
          type: 'relation',
          required: true,
          collectionId: posters.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'learned', type: 'bool' },
        { name: 'stars', type: 'number', min: 0, max: 3, onlyInt: true },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_poster_progress_poster_user ON poster_progress (poster, user)',
        'CREATE INDEX idx_poster_progress_user ON poster_progress (user)',
      ],
    })
    app.save(progress)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('poster_progress'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('posters'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('chapters'))
    } catch (_) {}
  },
)
