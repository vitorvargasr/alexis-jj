migrate(
  (app) => {
    // 1. Atualizar a coleção 'posters' adicionando caption e kind (estilo gibi)
    const postersCol = app.findCollectionByNameOrId('posters')
    if (!postersCol.fields.getByName('caption')) {
      postersCol.fields.add(
        new TextField({
          name: 'caption',
          type: 'text',
          max: 400,
        }),
      )
    }
    if (!postersCol.fields.getByName('kind')) {
      postersCol.fields.add(
        new SelectField({
          name: 'kind',
          type: 'select',
          values: ['historia', 'posicao'],
          maxSelect: 1,
        }),
      )
    }
    app.save(postersCol)

    // 2. Garantir que as histórias / edições do gibi existam com nomes amigáveis
    const chaptersCol = app.findCollectionByNameOrId('chapters')

    // Edição 1 — O Grande Dia no Tatame (História principal com Álexis, pai e amigo Léo)
    let ed1
    try {
      ed1 = app.findFirstRecordByData('chapters', 'order', 1)
      ed1.set('title', 'Edição 1 — O Dia a Dia no Tatame')
      ed1.set(
        'description',
        'Álexis acorda animado, encontra seu amigo de treino Léo e com o papai aprende as primeiras grandes posições!',
      )
      ed1.set('emoji', '🥋')
      app.save(ed1)
    } catch (_) {
      ed1 = new Record(chaptersCol)
      ed1.set('title', 'Edição 1 — O Dia a Dia no Tatame')
      ed1.set(
        'description',
        'Álexis acorda animado, encontra seu amigo de treino Léo e com o papai aprende as primeiras grandes posições!',
      )
      ed1.set('emoji', '🥋')
      ed1.set('order', 1)
      app.save(ed1)
    }

    // Atualizar títulos dos demais capítulos para estilo Edição do Gibi
    try {
      const ed2 = app.findFirstRecordByData('chapters', 'order', 2)
      ed2.set('title', 'Edição 2 — Passagens e Estabilização')
      ed2.set('description', 'Passar a guarda e segurar a posição com calma e equilíbrio.')
      ed2.set('emoji', '🤸')
      app.save(ed2)
    } catch (_) {}

    try {
      const ed3 = app.findFirstRecordByData('chapters', 'order', 3)
      ed3.set('title', 'Edição 3 — Controle das Costas')
      ed3.set('description', 'Acompanhar o amigo com o cinto de segurança e os ganchos.')
      ed3.set('emoji', '🧲')
      app.save(ed3)
    } catch (_) {}

    try {
      const ed4 = app.findFirstRecordByData('chapters', 'order', 4)
      ed4.set('title', 'Edição 4 — Montada e Defesas')
      ed4.set('description', 'Reconhecer posições, proteger os braços e recuperar a guarda.')
      ed4.set('emoji', '⭐')
      app.save(ed4)
    } catch (_) {}

    // 3. Re-semear os quadros da História 1 usando as 6 ilustrações na ordem narrativa ideal:
    // Quadro 1: "O Chamado para o Tatame" (historia)
    // Quadro 2: "O Cumprimento com o Amigo Léo" (historia)
    // Quadro 3: "Montada Alta" (posicao)
    // Quadro 4: "Da Montada para as Costas" (posicao)
    // Quadro 5: "Estabilizar os Cem-Quilos" (posicao)
    // Quadro 6: "A Celebração e a Conquista da Faixa" (historia)

    const story1Panels = [
      {
        title: 'O Chamado para o Tatame',
        chapter: ed1.id,
        order: 1,
        kind: 'historia',
        caption:
          'Sábado de manhã! Álexis acorda animado, amarra a faixa e chama o papai para o treino.',
        kid_text:
          'Coloque o kimono, ajuste a faixa e respire fundo: hoje é dia de aventura no tatame!',
        dad_tip:
          'Incentive o hábito com leveza e alegria. Ajude o Álexis a colocar o kimono e valorize o entusiasmo dele antes de qualquer técnica.',
      },
      {
        title: 'Cumprimento com o Amigo Léo',
        chapter: ed1.id,
        order: 2,
        kind: 'historia',
        caption:
          'No tatame, o amigo de treino Léo já está esperando. Antes de rolar: "OSS!" e um toque de punhos com respeito.',
        kid_text:
          'No Jiu-Jitsu, o respeito vem em primeiro lugar! Cumprimente seu parceiro com um "OSS" bem firme.',
        dad_tip:
          'Ensine que no tatame não há adversários perigosos, mas parceiros de aprendizado mútuo. Reforce o cumprimento e o cuidado com o amigo.',
      },
      {
        title: 'Montada Alta',
        chapter: ed1.id,
        order: 3,
        kind: 'posicao',
        caption:
          'Hora da prática! O papai orienta: "Se estiver por baixo, feche os cotovelos e faça espaço com o quadril!".',
        kid_text: 'Proteja os braços, mexa o quadril e crie espaço para voltar a defender!',
        dad_tip:
          'Ajude o Álexis a reconhecer a montada alta. Reforce cotovelos fechados, mãos no quadril e o movimento de camarão, sem empurrar o rosto ou o pescoço do colega.',
      },
      {
        title: 'Da Montada para as Costas',
        chapter: ed1.id,
        order: 4,
        kind: 'posicao',
        caption:
          'O amigo virou de costas! Álexis acompanha pertinho, coloca o cinto de segurança e organiza os ganchos.',
        kid_text:
          'Quando o colega girar, acompanhe pertinho e organize seus ganchos com segurança.',
        dad_tip:
          'Ensine a acompanhar o giro mantendo conexão no tronco. O cinto de segurança vem antes dos ganchos, sempre sem puxar a cabeça ou o pescoço.',
      },
      {
        title: 'Estabilizar os Cem-Quilos',
        chapter: ed1.id,
        order: 5,
        kind: 'posicao',
        caption:
          'Depois da passagem de guarda: peito no peito com base firme, respirando com calma nos cem-quilos.',
        kid_text: 'Passou? Encoste o peito, faça uma base firme e segure a posição com calma.',
        dad_tip:
          'Explique que ultrapassar as pernas não encerra o movimento. O Álexis deve distribuir o peso, controlar cabeça e ombro e bloquear o quadril sem machucar.',
      },
      {
        title: 'Celebração e Abraço no Tatame',
        chapter: ed1.id,
        order: 6,
        kind: 'historia',
        caption:
          'Fim do treino! O papai reúne Álexis e Léo num abraço cheio de orgulho: "Vocês deram um show de Jiu-Jitsu!".',
        kid_text:
          'Parabéns, campeão! Mais um treino concluído, amizade fortalecida e você está mais perto da próxima faixa!',
        dad_tip:
          'Celebre cada pequeno progresso. Elogie a dedicação, a atitude respeitosa e a coragem de tentar posições novas.',
      },
    ]

    for (let i = 0; i < story1Panels.length; i++) {
      const panel = story1Panels[i]
      let rec
      try {
        rec = app.findFirstRecordByData('posters', 'title', panel.title)
      } catch (_) {
        rec = new Record(postersCol)
      }
      rec.set('title', panel.title)
      rec.set('chapter', panel.chapter)
      rec.set('order', panel.order)
      rec.set('kind', panel.kind)
      rec.set('caption', panel.caption)
      rec.set('kid_text', panel.kid_text)
      rec.set('dad_tip', panel.dad_tip)
      app.save(rec)
    }

    // Se houver resquício do registro antigo "Saída da Montada com Camarão" na História 1,
    // reatribuir para a Edição 4 (Montada e Defesas) onde se encaixa perfeitamente
    try {
      const oldSaida = app.findFirstRecordByData('posters', 'title', 'Saída da Montada com Camarão')
      const ed4Rec = app.findFirstRecordByData('chapters', 'order', 4)
      if (oldSaida && ed4Rec) {
        oldSaida.set('chapter', ed4Rec.id)
        oldSaida.set('kind', 'posicao')
        oldSaida.set('order', 3)
        oldSaida.set(
          'caption',
          'Vire de lado, faça um camarão caprichado e coloque o joelho de volta no meio para recuperar a guarda!',
        )
        app.save(oldSaida)
      }
    } catch (_) {}

    // Atualizar quadros restantes de outros capítulos com kind e caption padrão se ainda não tiverem
    const otherPosters = app.findRecordsByFilter('posters', 'chapter != {:ch}', 'order', 50, 0, {
      ch: ed1.id,
    })
    for (let i = 0; i < otherPosters.length; i++) {
      const p = otherPosters[i]
      if (!p.getString('kind')) {
        p.set('kind', 'posicao')
      }
      if (!p.getString('caption')) {
        p.set('caption', p.getString('kid_text') || 'Aprenda e treine esta posição com o papai!')
      }
      app.save(p)
    }
  },
  (app) => {
    // Reverter campos se necessário
    try {
      const col = app.findCollectionByNameOrId('posters')
      col.fields.removeByName('caption')
      col.fields.removeByName('kind')
      app.save(col)
    } catch (_) {}
  },
)
