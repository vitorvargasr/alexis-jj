migrate(
  (app) => {
    // 1. belt_achievements
    const beltAchievements = new Collection({
      name: 'belt_achievements',
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
          name: 'belt_order',
          type: 'number',
          required: true,
          min: 1,
          max: 7,
          onlyInt: true,
        },
        {
          name: 'achieved_at',
          type: 'date',
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_belt_achievements_user_order ON belt_achievements (user, belt_order)',
        'CREATE INDEX idx_belt_achievements_user ON belt_achievements (user)',
      ],
    })
    app.save(beltAchievements)

    // 2. training_days
    const trainingDays = new Collection({
      name: 'training_days',
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
          name: 'day',
          type: 'date',
          required: true,
        },
        {
          name: 'trained',
          type: 'bool',
        },
        {
          name: 'stars',
          type: 'number',
          min: 0,
          max: 3,
          onlyInt: true,
        },
        {
          name: 'note',
          type: 'text',
          max: 200,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_training_days_user_day ON training_days (user, day)',
        'CREATE INDEX idx_training_days_user ON training_days (user)',
      ],
    })
    app.save(trainingDays)

    // 3. weekly_goals
    const weeklyGoals = new Collection({
      name: 'weekly_goals',
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
          name: 'week_start',
          type: 'date',
          required: true,
        },
        {
          name: 'goal',
          type: 'text',
          max: 200,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: [
        'CREATE UNIQUE INDEX idx_weekly_goals_user_week ON weekly_goals (user, week_start)',
        'CREATE INDEX idx_weekly_goals_user ON weekly_goals (user)',
      ],
    })
    app.save(weeklyGoals)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('weekly_goals'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('training_days'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('belt_achievements'))
    } catch (_) {}
  },
)
