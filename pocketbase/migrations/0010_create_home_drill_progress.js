migrate(
  (app) => {
    // Criação da coleção home_drill_progress para registrar o progresso dos 30 dias de treino em casa
    const homeDrillProgress = new Collection({
      name: 'home_drill_progress',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        {
          name: 'day_number',
          type: 'number',
          required: true,
          min: 1,
          max: 30,
          onlyInt: true,
        },
        {
          name: 'done',
          type: 'bool',
        },
        {
          name: 'done_at',
          type: 'date',
        },
        {
          name: 'nota',
          type: 'number',
          min: 1,
          max: 5,
          onlyInt: true,
        },
        {
          name: 'calm_checked',
          type: 'bool',
        },
        {
          name: 'painless_checked',
          type: 'bool',
        },
        {
          name: 'fun_checked',
          type: 'bool',
        },
        {
          name: 'notes',
          type: 'text',
          max: 500,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_home_drill_user_day ON home_drill_progress (user, day_number)',
        'CREATE INDEX idx_home_drill_user ON home_drill_progress (user)',
      ],
    })
    app.save(homeDrillProgress)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('home_drill_progress'))
    } catch (_) {}
  },
)
