migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'vitorvargas@vvconsulting.com.br')
    } catch (_) {
      const user = new Record(users)
      user.setEmail('vitorvargas@vvconsulting.com.br')
      user.setPassword('Skip@Pass')
      user.setVerified(true)
      user.set('name', 'Pai do Álexis')
      app.save(user)
    }

    const chapterCollection = app.findCollectionByNameOrId('chapters')
    const posterCollection = app.findCollectionByNameOrId('posters')
    const chapterSeeds = [
      {
        title: 'Capítulo 1 — Sair das Posições',
        description: 'Proteja os braços, faça espaço e volte a defender.',
        emoji: '🛡️',
        order: 1,
      },
      {
        title: 'Capítulo 2 — Passagens e Estabilização',
        description: 'Passar a guarda e segurar a posição com firmeza.',
        emoji: '🤸',
        order: 2,
      },
      {
        title: 'Capítulo 3 — Controle das Costas',
        description: 'Acompanhar o colega e organizar o controle das costas.',
        emoji: '🧲',
        order: 3,
      },
      {
        title: 'Capítulo 4 — Montada e Defesas',
        description: 'Reconhecer posições e recuperar a guarda com segurança.',
        emoji: '⭐',
        order: 4,
      },
    ]

    for (let i = 0; i < chapterSeeds.length; i++) {
      const seed = chapterSeeds[i]
      try {
        app.findFirstRecordByData('chapters', 'title', seed.title)
      } catch (_) {
        const chapter = new Record(chapterCollection)
        chapter.set('title', seed.title)
        chapter.set('description', seed.description)
        chapter.set('emoji', seed.emoji)
        chapter.set('order', seed.order)
        app.save(chapter)
      }
    }

    const posterSeeds = [
      {
        chapter: 'Capítulo 1 — Sair das Posições',
        title: 'Montada Alta',
        kid_text: 'Proteja os braços, mexa o quadril e crie espaço para voltar a defender!',
        dad_tip:
          'Ajude o Álexis a reconhecer a montada alta. Reforce cotovelos fechados, mãos no quadril e o movimento de camarão, sem empurrar o rosto ou o pescoço do colega.',
        order: 1,
      },
      {
        chapter: 'Capítulo 1 — Sair das Posições',
        title: 'Saída da Montada com Camarão',
        kid_text: 'Vire de lado, faça um camarão caprichado e coloque o joelho de volta no meio.',
        dad_tip:
          'Treine a sequência devagar: proteger os braços, virar de lado, afastar o quadril e recuperar meia-guarda ou guarda. Valorize o espaço criado, não a força.',
        order: 2,
      },
      {
        chapter: 'Capítulo 2 — Passagens e Estabilização',
        title: 'Passagem de Guarda com Joelho',
        kid_text: 'Passe as pernas com postura firme e lembre de cuidar do seu equilíbrio.',
        dad_tip:
          'Mostre que a passagem termina somente quando o controle está estável. Oriente o joelho com cuidado e sem pressão brusca sobre o colega.',
        order: 1,
      },
      {
        chapter: 'Capítulo 2 — Passagens e Estabilização',
        title: 'Estabilizar os Cem-Quilos',
        kid_text: 'Passou? Encoste o peito, faça uma base firme e segure a posição com calma.',
        dad_tip:
          'Explique que ultrapassar as pernas não encerra o movimento. O Álexis deve distribuir o peso, controlar cabeça e ombro e bloquear o quadril sem machucar.',
        order: 2,
      },
      {
        chapter: 'Capítulo 3 — Controle das Costas',
        title: 'Da Montada para as Costas',
        kid_text: 'Quando o colega girar, acompanhe pertinho e organize seus ganchos.',
        dad_tip:
          'Ensine a acompanhar o giro mantendo conexão no tronco. O cinto de segurança vem antes dos ganchos, sempre sem puxar a cabeça ou o pescoço.',
        order: 1,
      },
      {
        chapter: 'Capítulo 3 — Controle das Costas',
        title: 'Ganchos e Cinto de Segurança',
        kid_text:
          'Um braço por cima, outro por baixo e os pés ativos para controlar com segurança.',
        dad_tip:
          'Reforce o controle do tronco e a posição dos ganchos. Evite cruzar os pés à frente do colega e pratique soltar imediatamente quando o professor pedir.',
        order: 2,
      },
      {
        chapter: 'Capítulo 4 — Montada e Defesas',
        title: 'Defesa da Montada com Cotovelos',
        kid_text: 'Cotovelos colados no corpo viram um escudo forte para você se defender.',
        dad_tip:
          'Peça ao Álexis para manter os cotovelos próximos às costelas e respirar. A defesa começa protegendo os braços antes de tentar qualquer fuga.',
        order: 1,
      },
      {
        chapter: 'Capítulo 4 — Montada e Defesas',
        title: 'Recuperar a Meia-Guarda',
        kid_text: 'Abra espaço com o quadril e prenda uma perna para ficar seguro outra vez.',
        dad_tip:
          'Treine o enquadramento com antebraços, o giro de quadril e a entrada do joelho. A meia-guarda é uma etapa segura antes de recuperar a guarda completa.',
        order: 2,
      },
    ]

    for (let i = 0; i < posterSeeds.length; i++) {
      const seed = posterSeeds[i]
      try {
        app.findFirstRecordByData('posters', 'title', seed.title)
      } catch (_) {
        const chapter = app.findFirstRecordByData('chapters', 'title', seed.chapter)
        const poster = new Record(posterCollection)
        poster.set('title', seed.title)
        poster.set('kid_text', seed.kid_text)
        poster.set('dad_tip', seed.dad_tip)
        poster.set('chapter', chapter.id)
        poster.set('order', seed.order)
        app.save(poster)
      }
    }
  },
  (app) => {
    const posterTitles = [
      'Montada Alta',
      'Saída da Montada com Camarão',
      'Passagem de Guarda com Joelho',
      'Estabilizar os Cem-Quilos',
      'Da Montada para as Costas',
      'Ganchos e Cinto de Segurança',
      'Defesa da Montada com Cotovelos',
      'Recuperar a Meia-Guarda',
    ]
    for (let i = 0; i < posterTitles.length; i++) {
      try {
        app.delete(app.findFirstRecordByData('posters', 'title', posterTitles[i]))
      } catch (_) {}
    }

    const chapterTitles = [
      'Capítulo 1 — Sair das Posições',
      'Capítulo 2 — Passagens e Estabilização',
      'Capítulo 3 — Controle das Costas',
      'Capítulo 4 — Montada e Defesas',
    ]
    for (let i = 0; i < chapterTitles.length; i++) {
      try {
        app.delete(app.findFirstRecordByData('chapters', 'title', chapterTitles[i]))
      } catch (_) {}
    }

    try {
      app.delete(app.findAuthRecordByEmail('_pb_users_auth_', 'vitorvargas@vvconsulting.com.br'))
    } catch (_) {}
  },
)
