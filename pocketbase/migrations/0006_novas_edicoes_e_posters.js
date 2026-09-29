migrate(
  (app) => {
    const chaptersCol = app.findCollectionByNameOrId('chapters')
    const postersCol = app.findCollectionByNameOrId('posters')

    // 1. Definições das 7 Edições do Gibi
    // Edição 1 já existe e permanece intocada.
    // Atualizamos/criamos as Edições 2 a 7 baseadas nas 69 ilustrações do gibi:
    const editionsData = [
      {
        order: 2,
        title: 'Edição 2 — Guarda, Postura e Aberturas',
        description:
          'Álexis aprende com o papai os segredos da guarda fechada, aberta, borboleta, meia-guarda e postura correta.',
        emoji: '🛡️',
      },
      {
        order: 3,
        title: 'Edição 3 — Raspagens Inteligentes',
        description:
          'Raspagem tesoura, de quadril, pêndulo e raspagem borboleta: desequilibrar o amigo e chegar por cima com técnica!',
        emoji: '⚡',
      },
      {
        order: 4,
        title: 'Edição 4 — Passagens e Estabilização',
        description:
          'Como passar a guarda toreando, meia-guarda, corte de joelho e estabilizar cem-quilos e montada sem afobação.',
        emoji: '🥋',
      },
      {
        order: 5,
        title: 'Edição 5 — Sair das Posições e Defesas',
        description:
          'Escapes inteligentes de cotovelo, saídas das costas, norte-sul, tartaruga, cem-quilos e joelho na barriga.',
        emoji: '🦀',
      },
      {
        order: 6,
        title: 'Edição 6 — Drills e Movimentação no Tapete',
        description:
          'Treinos e exercícios solo divertidos em casa: ponte, sprawl, rolamentos, passo do gorila, caranguejo e granby.',
        emoji: '🤸',
      },
      {
        order: 7,
        title: 'Edição 7 — Finalizações e Segurança no Tatame',
        description:
          'Chave de braço, kimura, americana e estrangulamento com respeito total ao colega, sabendo parar ao sinal de TAP!',
        emoji: '🤝',
      },
    ]

    const chapterMap = {}

    for (let i = 0; i < editionsData.length; i++) {
      const ed = editionsData[i]
      let chapterRec
      try {
        chapterRec = app.findFirstRecordByData('chapters', 'order', ed.order)
      } catch (_) {
        chapterRec = new Record(chaptersCol)
      }
      chapterRec.set('title', ed.title)
      chapterRec.set('description', ed.description)
      chapterRec.set('emoji', ed.emoji)
      chapterRec.set('order', ed.order)
      app.save(chapterRec)
      chapterMap[ed.order] = chapterRec.id
    }

    // 2. Os 69 quadros das ilustrações (páginas 1 a 69 do PDF)
    const panels = [
      // EDIÇÃO 2 (10 quadros)
      {
        page: 6,
        ed: 2,
        order: 1,
        title: 'Guarda Fechada: Reconhecer e Organizar',
        kind: 'posicao',
        caption:
          'Entenda quem está por cima e quem está por baixo para organizar a guarda fechada com postura e pegadas firmes.',
        kid_text:
          'Feche as pernas com firmeza ao redor do quadril do colega e mantenha o joelho ativo!',
        dad_tip:
          'Ajude o Álexis a diferenciar quem está por cima de quem está por baixo e a manter as pernas ativas sem cruzar de forma relaxada.',
      },
      {
        page: 7,
        ed: 2,
        order: 2,
        title: 'Postura na Guarda Fechada',
        kind: 'posicao',
        caption:
          'Coluna reta, cotovelos para dentro e mãos seguras: uma boa postura protege você e prepara a abertura.',
        kid_text:
          'Mantenha a coluna ereta, queixo alinhado e cotovelos protegidos para não dar espaço!',
        dad_tip:
          'Reforce para não curvar as costas nem deixar os braços esticados dentro da guarda do amigo.',
      },
      {
        page: 8,
        ed: 2,
        order: 3,
        title: 'Abertura de Guarda em Pé',
        kind: 'posicao',
        caption:
          'Postura, base firme e controle do quadril para abrir a guarda em pé com segurança e equilíbrio.',
        kid_text:
          'Faça pegadas seguras no tronco, coloque um pé de cada vez no tatame e empurre o quadril para abrir.',
        dad_tip:
          'Oriente a subir com coluna reta e nunca soltar o controle das pernas logo após a abertura.',
      },
      {
        page: 9,
        ed: 2,
        order: 4,
        title: 'Abertura de Joelhos com Calma',
        kind: 'posicao',
        caption:
          'Organize a base de joelhos, controle a faixa e use o joelho no centro para abrir com calma e técnica.',
        kid_text:
          'Ajoelhe com boa base, coloque um joelho no centro e empurre suavemente até a guarda ceder.',
        dad_tip:
          'Mostre que calma e alavanca funcionam melhor do que força brusca para abrir a guarda fechada.',
      },
      {
        page: 10,
        ed: 2,
        order: 5,
        title: 'Depois de Abrir: Afastar e Controlar',
        kind: 'posicao',
        caption:
          'Abra a guarda, afaste o quadril e mantenha as mãos nas pernas para controlar a distância antes de passar.',
        kid_text:
          'Não fique colado logo após abrir! Afaste o quadril e controle os joelhos do colega.',
        dad_tip:
          'Explique que abrir a guarda é só o primeiro passo; afastar evita que o colega feche tudo de novo.',
      },
      {
        page: 11,
        ed: 2,
        order: 6,
        title: 'Guarda Aberta: Pés e Joelhos Vivos',
        kind: 'posicao',
        caption:
          'Pés, joelhos e mãos trabalhando juntos em forma de escudos para manter a distância e se proteger.',
        kid_text:
          'Seus pés e joelhos são barreiras mágicas: mantenha-os sempre ativos na frente do colega!',
        dad_tip:
          'Incentive o Álexis a mexer os pés e pernas ativamente no quadril ou bíceps, sem deixar as pernas soltas no chão.',
      },
      {
        page: 12,
        ed: 2,
        order: 7,
        title: 'Guarda Borboleta: Base e Ganchos',
        kind: 'posicao',
        caption:
          'Sente com a coluna ativa, coloque os ganchos por dentro e controle as mangas para desequilibrar.',
        kid_text:
          'Sente ereto com os ganchos por dentro das pernas do colega, pronto para elevar e desequilibrar!',
        dad_tip:
          'Evite que a criança caia para trás sem ganchos organizados; o equilíbrio vem da postura sentada.',
      },
      {
        page: 13,
        ed: 2,
        order: 8,
        title: 'Meia-Guarda: Reconhecer a Perna Presa',
        kind: 'posicao',
        caption:
          'Reconheça quando uma das pernas está presa entre as do colega e saiba exatamente o que fazer.',
        kid_text:
          'Na meia-guarda, uma perna fica protegida. Quem está por baixo cria espaço e quem está por cima busca estabilidade.',
        dad_tip:
          'Ensine a reconhecer a posição sem pânico: meia-guarda é uma posição segura para recompor ou raspar.',
      },
      {
        page: 14,
        ed: 2,
        order: 9,
        title: 'Escudo de Joelho na Meia-Guarda',
        kind: 'posicao',
        caption:
          'Crie espaço com o joelho apontado no peito e monte uma barreira forte para respirar e se organizar.',
        kid_text:
          'Use o joelho como um escudo forte entre você e o colega para manter distância e não ser amassado!',
        dad_tip:
          'O escudo de joelho tira o peso direto do colega e dá tempo para pensar no próximo movimento.',
      },
      {
        page: 15,
        ed: 2,
        order: 10,
        title: 'Reposição de Guarda com Movimento de Quadril',
        kind: 'posicao',
        caption:
          'Use quadros no ombro e faça o camarão para deslizar o quadril e trazer as pernas de volta à guarda.',
        kid_text:
          'Deslize o quadril para longe, coloque o joelho no meio e recupere sua guarda com agilidade!',
        dad_tip:
          'Mostre que o quadril cria o espaço necessário para a perna entrar, nunca apenas a força dos braços.',
      },

      // EDIÇÃO 3 (10 quadros)
      {
        page: 16,
        ed: 3,
        order: 1,
        title: 'Raspagem Tesoura: Ângulo e Corte',
        kind: 'posicao',
        caption:
          'Abra um ângulo para o lado, corte com as pernas em tesoura e aproveite o desequilíbrio para subir.',
        kid_text:
          'Puxe com as mãos e passe uma perna no peito e outra rente ao tatame como uma tesoura!',
        dad_tip:
          'Enfatize que sem ângulo lateral a raspagem tesoura não funciona; girar o quadril é a chave.',
      },
      {
        page: 17,
        ed: 3,
        order: 2,
        title: 'Raspagem de Quadril: Sentar e Elevar',
        kind: 'posicao',
        caption:
          'Quebre a postura do colega, suba o tronco com a mão no chão e impulsione o quadril para virar por cima.',
        kid_text:
          'Apoie uma mão no chão, suba o quadril bem alto e vire o colega com um movimento forte e decidido!',
        dad_tip:
          'O segredo é sentar bem próximo ao colega e jogar o quadril alto, sem ficar deitado esperando.',
      },
      {
        page: 18,
        ed: 3,
        order: 3,
        title: 'Raspagem Pêndulo: Balanço Inteligente',
        kind: 'posicao',
        caption:
          'Isole o braço, abra o ângulo e balance a perna como um pêndulo para virar o colega sem esforço excessivo.',
        kid_text:
          'Balance a perna bem aberta como um relógio de pêndulo e use o embalo para virar por cima!',
        dad_tip:
          'Ensine que o movimento de pêndulo usa a gravidade e o peso da perna, poupando a força muscular.',
      },
      {
        page: 19,
        ed: 3,
        order: 4,
        title: 'Raspagem Contra Quem Levanta',
        kind: 'posicao',
        caption:
          'Quando o parceiro fica em pé na sua guarda, controle os tornozelos, apoie os pés no quadril e desequilibre.',
        kid_text:
          'Se o amigo levantar, segure os tornozelos e empurre os quadris para ele cair sentadinho!',
        dad_tip:
          'Segurar os tornozelos impede o colega de dar passos para trás e garante uma queda suave e segura.',
      },
      {
        page: 20,
        ed: 3,
        order: 5,
        title: 'Raspagem Borboleta com um Gancho',
        kind: 'posicao',
        caption:
          'Puxe o parceiro para quebrar a base e use um único gancho para elevar e girar por cima com elegância.',
        kid_text:
          'Puxe a manga e a gola, traga o amigo para você e levante a perna do gancho para virar!',
        dad_tip:
          'Desequilíbrio antes da elevação: se o colega estiver firme no chão, a raspagem fica pesada demais.',
      },
      {
        page: 21,
        ed: 3,
        order: 6,
        title: 'Borboleta: Mudar de Lado com Agilidade',
        kind: 'posicao',
        caption:
          'Se um lado fecha a defesa, mude a direção e surpreenda raspando para o outro lado com técnica.',
        kid_text:
          'Quando o amigo bloquear um lado, não insista na força: troque o ângulo e raspe para o outro!',
        dad_tip:
          'Ótima lição de Jiu-Jitsu para a vida: se uma porta se fecha com força, procure o caminho aberto com calma.',
      },
      {
        page: 22,
        ed: 3,
        order: 7,
        title: 'Meia-Guarda com Underhook (Esgrima)',
        kind: 'posicao',
        caption:
          'Entre o braço por baixo da axila do colega (esgrima), vire de lado e suba na base com controle.',
        kid_text:
          'Passe o braço por baixo e cole o ouvido no peito dele: a esgrima abre o caminho para subir!',
        dad_tip:
          'Explique que ficar deitado de costas na meia-guarda cansa; virar de lado com a esgrima é libertador.',
      },
      {
        page: 23,
        ed: 3,
        order: 8,
        title: 'Meia-Guarda com Gancho Borboleta',
        kind: 'posicao',
        caption:
          'Misture o espaço do joelho com o gancho da borboleta para elevar o quadril do parceiro e raspar.',
        kid_text:
          'Coloque o pezinho por dentro da perna livre e eleve com o giro do corpo para raspar!',
        dad_tip:
          'Essa conexão de posições ajuda a criança a entender como as técnicas se completam no tatame.',
      },
      {
        page: 24,
        ed: 3,
        order: 9,
        title: 'Guarda Sentada: Levantar e Raspar',
        kind: 'posicao',
        caption:
          'Controle as mangas, apoie o pé firme e faça a levantada técnica tirando a base do colega com postura.',
        kid_text:
          'Suba com base forte usando um pé e uma mão no chão, desequilibrando o colega sem correria!',
        dad_tip: 'Movimento com controle e sem bater de cabeça; ensine a postura ereta na subida.',
      },
      {
        page: 25,
        ed: 3,
        order: 10,
        title: 'Tesoura ou Quadril? A Leitura do Tatame',
        kind: 'historia',
        caption:
          'Observe a reação do amigo: se ele ficar baixo, use a tesoura; se erguer o tronco, ataque o quadril!',
        kid_text:
          'Sinta o corpo do parceiro de treino: cada posição te dá a pista certa do que fazer!',
        dad_tip:
          'Estimule a tomada de decisão consciente. Pensar antes de agir é o grande diferencial no tatame e na escola.',
      },

      // EDIÇÃO 4 (8 quadros)
      {
        page: 2,
        ed: 4,
        order: 1,
        title: 'Passagem Toreando: Controlar e Contornar',
        kind: 'posicao',
        caption:
          'Segure os tornozelos, empurre as pernas para o lado e contorne com passos leves até os cem-quilos.',
        kid_text:
          'Segure as pernas como o volante de um carro, jogue para o lado e dê a volta correndo baixinho!',
        dad_tip:
          'Evite que a criança tente pular por cima das pernas; contornar mantendo pegada nos tornozelos é mais seguro.',
      },
      {
        page: 3,
        ed: 4,
        order: 2,
        title: 'Passagem Toreando: Estabilização Lateral',
        kind: 'posicao',
        caption:
          'Após contornar, bloqueie o quadril e encoste o peito no peito com base firme e joelhos vivos.',
        kid_text:
          'Chegou do lado? Abrace a cabeça e o quadril, respire fundo e mantenha o corpo bem pesado!',
        dad_tip:
          'A estabilização dos 3 segundos ensina a criança a controlar a ansiedade antes de buscar a próxima posição.',
      },
      {
        page: 5,
        ed: 4,
        order: 3,
        title: 'Passagem da Meia-Guarda com Pressão Suave',
        kind: 'posicao',
        caption:
          'Controle o tronco, achate os ombros do amigo, liberte o joelho preso e finalize nos cem-quilos.',
        kid_text:
          'Abrace a cabeça, deslize o joelho devagarinho para o chão e solte a perna com calma!',
        dad_tip:
          'Passar meia-guarda exige paciência: primeiro ganhe o controle dos braços e do peito, depois solte a perna.',
      },
      {
        page: 44,
        ed: 4,
        order: 4,
        title: 'Passagem da Meia com Escudo de Joelho',
        kind: 'posicao',
        caption:
          'Desvie o joelho escudo com a mão na perna, aproxime o tronco com carinho e libere a passagem.',
        kid_text:
          'Abaixe o joelho do escudo com a mãozinha e aproxime o peito para não dar espaço!',
        dad_tip:
          'Mostre que tentar forçar a passagem sem abaixar o escudo machuca e prende a perna; técnica sempre supera a força.',
      },
      {
        page: 52,
        ed: 4,
        order: 5,
        title: 'Passagem por Cima da Perna com Controle',
        kind: 'posicao',
        caption:
          'Afaste a perna que bloqueia seu caminho, passe sua perna com postura e gire o quadril para estabilizar.',
        kid_text:
          'Segure a perninha com firmeza, dê um passo por cima com equilíbrio e chegue ao lado!',
        dad_tip:
          'Oriente a nunca pular ou saltar desajeitado; passos firmes garantem segurança para ambos.',
      },
      {
        page: 58,
        ed: 4,
        order: 6,
        title: 'Transição dos Cem-Quilos para a Montada',
        kind: 'posicao',
        caption:
          'Com peito no peito firme, deslize o joelho suavemente sobre a barriga e estabeleça a montada.',
        kid_text:
          'Deslize o joelho devagar por cima da barriga do amigo até os dois joelhos tocarem o tatame!',
        dad_tip: 'Enfatize que o joelho deve deslizar suavemente, nunca bater ou machucar o amigo.',
      },
      {
        page: 61,
        ed: 4,
        order: 7,
        title: 'Passagem da Guarda Borboleta',
        kind: 'posicao',
        caption:
          'Afaste um dos ganchos com as mãos na canela, contorne o quadril e encoste o peito para imobilizar.',
        kid_text:
          'Tire os ganchinhos com cuidado pelas canelas e contorne rápido para o lado aberto!',
        dad_tip:
          'Entrar de frente sem tirar os ganchos facilita a raspagem do parceiro; contornar é o caminho ideal.',
      },
      {
        page: 67,
        ed: 4,
        order: 8,
        title: 'Passagem com Corte de Joelho (Knee Cut)',
        kind: 'posicao',
        caption:
          'Aponte o joelho no tatame cortando em diagonal e deslize controlando a gola e a manga até os cem-quilos.',
        kid_text:
          'Corte com o joelho no chão rente à coxa e deslize o corpinho como quem escorrega num tobogã!',
        dad_tip:
          'O corte de joelho é ágil e fluido; mantenha o tronco colado para não permitir que o colega reponha.',
      },

      // EDIÇÃO 5 (8 quadros)
      {
        page: 38,
        ed: 5,
        order: 1,
        title: 'Sair das Costas: Proteger o Pescoço e Tirar os Ganchos',
        kind: 'posicao',
        caption:
          'Proteja as duas mãos na gola, caia para o lado do braço que defende e use as pernas para tirar um gancho.',
        kid_text:
          'Segure firme as duas mãos no braço que abraça o pescoço, caia de ladinho e tire o primeiro gancho!',
        dad_tip:
          'A prioridade absoluta nas costas é proteger o pescoço com as duas mãos e encostar o queixo no peito.',
      },
      {
        page: 39,
        ed: 5,
        order: 2,
        title: 'Sair do Norte-Sul: Virar o Quadril e Enquadrar',
        kind: 'posicao',
        caption:
          'Cotovelos fechados, mãos no ombro e quadril do parceiro para afastar com camarão e trazer os joelhos.',
        kid_text:
          'Feche os bracinhos, vire o bumbum de lado e puxe os joelhos para o meio do peito!',
        dad_tip:
          'Evite empurrar o parceiro com os braços esticados para cima; use a moldura dos antebraços.',
      },
      {
        page: 45,
        ed: 5,
        order: 3,
        title: 'Escape de Cotovelo da Montada (Elbow Escape)',
        kind: 'posicao',
        caption:
          'Faça um quadro com as mãos, uma ponte curta para aliviar o peso, deslize o quadril e traga o joelho para a guarda.',
        kid_text:
          'Levante o quadril na pontinha dos pés, faça o camarão e enfie o joelho para voltar à meia-guarda!',
        dad_tip:
          'O escape de cotovelo é o escape mais seguro da montada; treine o ritmo calmo sem pressa.',
      },
      {
        page: 50,
        ed: 5,
        order: 4,
        title: 'Virar para os Joelhos no Cem-Quilos',
        kind: 'posicao',
        caption:
          'Proteja o pescoço, faça espaço com a ponte e vire a barriga em direção ao chão para subir de quatro apoios.',
        kid_text: 'Proteja a cabeça, vire a barriguinha para o tatame e suba de joelhos bem firme!',
        dad_tip:
          'Não deixe o braço esticado para trás ao virar, mantendo sempre os cotovelos protegidos.',
      },
      {
        page: 51,
        ed: 5,
        order: 5,
        title: 'Cem-Quilos por Baixo: Moldura e Recuperar Espaço',
        kind: 'posicao',
        caption:
          'Crie uma moldura no queixo e no quadril, deslize as pernas e escolha: repor a guarda ou virar para os joelhos.',
        kid_text:
          'Faça uma janela com os braços para respirar e mexa o quadril para trazer suas pernas de volta!',
        dad_tip:
          'A criança aprende que quem está por baixo deve ser ativa com o quadril, sem se render ao cansaço.',
      },
      {
        page: 54,
        ed: 5,
        order: 6,
        title: 'Sair da Posição de Tartaruga com Segurança',
        kind: 'posicao',
        caption:
          'Fique compacto como uma tartaruga no casco, abra espaço com uma mão no tatame e sente de lado na guarda.',
        kid_text:
          'Encolha a cabeça como uma tartaruguinha feliz, vire de lado e coloque os pezinhos na frente!',
        dad_tip:
          'A tartaruga é uma posição de transição rápida: ensine o Álexis a não morar ali e buscar a guarda.',
      },
      {
        page: 55,
        ed: 5,
        order: 7,
        title: 'Saída do Joelho na Barriga: Aliviar e Camarão',
        kind: 'posicao',
        caption:
          'Proteja com quadros nas pernas, gire o quadril para diminuir a pressão e traga o joelho de volta à guarda.',
        kid_text:
          'Tire a pressão da barriga virando o quadril de lado e coloque o joelho no meio do amigo!',
        dad_tip:
          'Nunca empurre o joelho do parceiro com força bruta para não torcer a articulação; mova o seu próprio quadril.',
      },
      {
        page: 57,
        ed: 5,
        order: 8,
        title: 'Recuperar a Guarda Fechada com Antebraços',
        kind: 'posicao',
        caption:
          'Faça o camarão profundo, traga o joelho superior por dentro e recomponha a guarda fechada com segurança.',
        kid_text:
          'Abra espaço com o bumbum, enfie o joelho e abrace o amigo com as pernas na guarda fechada!',
        dad_tip:
          'Recuperar a guarda fecha o ciclo defensivo e renova a confiança da criança na aula.',
      },

      // EDIÇÃO 6 (16 quadros)
      {
        page: 4,
        ed: 6,
        order: 1,
        title: 'Drill 7: Troca de Base nos Joelhos',
        kind: 'posicao',
        caption:
          'Mude o apoio dos joelhos com equilíbrio, quadril baixo e postura firme no tapete da sala.',
        kid_text: 'Ajoelhe, levante um joelho com o pé firme e troque de lado como um ninja!',
        dad_tip:
          'Esse exercício treina a mobilidade pélvica e a coordenação de troca de lado sem desequilíbrio.',
      },
      {
        page: 26,
        ed: 6,
        order: 2,
        title: 'Drill 11: Passo do Gorila no Tapete',
        kind: 'posicao',
        caption:
          'Mãos no chão, quadril baixo e passos fortes e silenciosos como os de um gorila guardião.',
        kid_text: 'Apoie as mãos no chão e dê passos de gorila mantendo o bumbum bem baixinho!',
        dad_tip:
          'Fortalece os ombros, o core e a musculatura das pernas de forma lúdica e muito divertida.',
      },
      {
        page: 27,
        ed: 6,
        order: 3,
        title: 'Drill 16: Hip Heist (Troca de Quadril)',
        kind: 'posicao',
        caption:
          'Sente com apoio, erga o quadril e gire a perna por baixo para trocar a base rapidamente.',
        kid_text: 'Apoie uma mão atrás, suba o quadril e passe a perna de trás para frente!',
        dad_tip: 'Ensina a levantar do chão sem oferecer as costas ou perder o equilíbrio.',
      },
      {
        page: 28,
        ed: 6,
        order: 4,
        title: 'Drill 12: Sit-Through com Agilidade',
        kind: 'posicao',
        caption:
          'Da posição de quatro apoios, gire o quadril e passe a perna por baixo com controle absoluto.',
        kid_text: 'Na posição de quatro apoios, passe uma perna por baixo e olhe para a frente!',
        dad_tip: 'Excelente para agilidade de defesa contra cinturadas e ataques nas costas.',
      },
      {
        page: 29,
        ed: 6,
        order: 5,
        title: 'Drill 17: Caminhada do Urso Forte',
        kind: 'posicao',
        caption:
          'Mãos e pés no chão, joelhos elevados a poucos centímetros e passos alternados com o quadril firme.',
        kid_text: 'Ande como um urso forte pelo tapete, sem encostar os joelhos no chão!',
        dad_tip: 'Trabalha a estabilização e o condicionamento motor completo da criança.',
      },
      {
        page: 30,
        ed: 6,
        order: 6,
        title: 'Drill 13: Inversão Granby no Ombro',
        kind: 'posicao',
        caption:
          'Enrole o corpo pelo ombro em diagonal, proteja o pescoço e saia de joelhos com leveza.',
        kid_text: 'Enrole no ombrinho de lado sem bater a cabeça no chão e termine de joelhos!',
        dad_tip:
          'Atenção para o Álexis não rolar sobre a nuca ou pescoço; o contato deve ser estritamente no ombro.',
      },
      {
        page: 31,
        ed: 6,
        order: 7,
        title: 'Drill 18: Sprawl com Giro em Círculo',
        kind: 'posicao',
        caption:
          'Jogue as pernas para trás com quadril baixo no sprawl e circule com passos rápidos para o lado.',
        kid_text:
          'Faça o sprawl rápido no tapete e circule como um carrossel em volta do adversário!',
        dad_tip: 'Desenvolve reflexo e tempo de reação para defesas de queda no Jiu-Jitsu.',
      },
      {
        page: 32,
        ed: 6,
        order: 8,
        title: 'Drill 14: Rolê da Tartaruga Protegida',
        kind: 'posicao',
        caption:
          'De quatro apoios, proteja o queixo, role pelo ombro por dentro e reapareça do outro lado com base.',
        kid_text:
          'Guarde a cabeça no casco, role pelo ombro e apareça do outro lado pronto para lutar!',
        dad_tip:
          'Estimula a consciência espacial da criança quando estiver de cabeça para baixo ou em rotação.',
      },
      {
        page: 33,
        ed: 6,
        order: 9,
        title: 'Drill 19: Entrada Solo de Queda com Base',
        kind: 'posicao',
        caption:
          'Baixe o nível, dê o passo de entrada tocando o joelho suavemente e levante abraçando o espaço.',
        kid_text:
          'Dobre os joelhos, dê um passinho para a frente e levante com base forte e postura de campeão!',
        dad_tip:
          'Aprender o movimento solo primeiro evita lesões antes de praticar com um parceiro.',
      },
      {
        page: 34,
        ed: 6,
        order: 10,
        title: 'Drill 15: Caminhada do Caranguejo',
        kind: 'posicao',
        caption:
          'Quadril alto como uma mesa, mãos e pés fortes deslocando para os lados com equilíbrio alegre.',
        kid_text:
          'Erga a barriguinha como uma mesa e ande de lado como um caranguejo esperto na praia!',
        dad_tip: 'Fortalece os glúteos e a cadeia posterior, fundamental para uma ponte explosiva.',
      },
      {
        page: 35,
        ed: 6,
        order: 11,
        title: 'Drill 20: Sequência Avançada Conectada',
        kind: 'posicao',
        caption:
          'Gorila + sit-through + granby: ligando todos os movimentos com fluidez e consciência corporal.',
        kid_text:
          'Ligue o passo do gorila com a passada e a rolagem! Movimentos conectados viram superpoderes!',
        dad_tip:
          'Celebre o ritmo contínuo. Não precisa de pressa, o foco é a precisão e a respiração.',
      },
      {
        page: 42,
        ed: 6,
        order: 12,
        title: 'Drill 1: Ponte Básica (Upa) Explosiva',
        kind: 'posicao',
        caption:
          'Pés perto do corpo, eleve o quadril no alto com controle e proteja o pescoço e o queixo.',
        kid_text:
          'Deite de costas, coloque os pés perto do bumbum e empurre o chão como um foguete subindo!',
        dad_tip:
          'A ponte é o motor de quase todas as fugas no Jiu-Jitsu. Treine subir alto apoiado nos pés.',
      },
      {
        page: 46,
        ed: 6,
        order: 13,
        title: 'Drill 9: Sprawl Básico e Rápido',
        kind: 'posicao',
        caption:
          'Em pé em base leve, jogue as pernas para trás instantaneamente e desça o quadril pesado.',
        kid_text:
          'Mãos prontas na frente, pernas para trás e barriga perto do chão: sprawl perfeito!',
        dad_tip:
          'Reforce para que a criança não caia de joelhos e sim com os pés ativos e quadril baixo.',
      },
      {
        page: 48,
        ed: 6,
        order: 14,
        title: 'Drill 6: Rolamento para Trás Redondo',
        kind: 'posicao',
        caption:
          'Agache, queixo colado no peito, costas arredondadas e empurre o tatame pelas orelhas.',
        kid_text: 'Queixo bem colado no peito, role para trás como uma bola e levante de joelhos!',
        dad_tip: 'Costas redondas e queixo no peito garantem que a cabeça não encoste no tatame.',
      },
      {
        page: 49,
        ed: 6,
        order: 15,
        title: 'Drill 10: Sequência Caseira Completa',
        kind: 'posicao',
        caption:
          'Ponte + shrimp (camarão) + levantada técnica: o trio de ouro para escapar e levantar com segurança.',
        kid_text:
          'Faça a ponte, dê o camarão de lado e levante sem virar as costas: parabéns, você levantou seguro!',
        dad_tip:
          'Praticar essa sequência três vezes ao dia cria um reflexo protetor que dura a vida inteira.',
      },
      {
        page: 53,
        ed: 6,
        order: 16,
        title: 'Drill 4: Levantada Técnica de Campeão',
        kind: 'posicao',
        caption:
          'Uma mão no chão atrás, a outra protegendo o rosto, erga o quadril e passe a perna sem cruzar.',
        kid_text:
          'Mãozinha na guarda do rosto, levante o quadril e puxe a perna de trás com calma!',
        dad_tip: 'A levantada técnica é a habilidade de autodefesa mais importante para crianças.',
      },

      // EDIÇÃO 7 (7 quadros)
      {
        page: 1,
        ed: 7,
        order: 1,
        title: 'Por Baixo na Guarda: Proteger, Desequilibrar e Raspar',
        kind: 'posicao',
        caption:
          'Organize a guarda antes de tentar virar o colega: primeiro a segurança, depois o desequilíbrio e a raspagem.',
        kid_text:
          'Você está por baixo? Segure gola e manga, quebre a postura do amigo e chegue por cima!',
        dad_tip:
          'Ensine que por baixo a criança não está apenas se defendendo, ela tem objetivos claros passo a passo.',
      },
      {
        page: 36,
        ed: 7,
        order: 2,
        title: 'Estou Sendo Finalizado: Bater, Parar e Reiniciar com Respeito',
        kind: 'historia',
        caption:
          'Sentiu desconforto ou aperto? Dê três batidinhas ou diga "PARA!". Solte na hora e cuide do seu parceiro.',
        kid_text:
          'Bater no tatame ou dizer "PARA" mostra coragem e inteligência! Treino seguro é amizade pra sempre!',
        dad_tip:
          'Ensine com muito carinho que no tatame saber bater e saber soltar imediatamente é o maior ato de honra.',
      },
      {
        page: 37,
        ed: 7,
        order: 3,
        title: 'Chave Americana: Controle do Ombro e Respeito',
        kind: 'posicao',
        caption:
          'Imobilize o braço em formato de "L", ajuste sem força e pare imediatamente ao menor sinal de tap.',
        kid_text: 'Faça a pegada com calma sem puxar com força. O Jiu-Jitsu cuida do amigo!',
        dad_tip:
          'Finalizações em crianças devem ser praticadas com velocidade zero, apenas para reconhecimento do limite.',
      },
      {
        page: 40,
        ed: 7,
        order: 4,
        title: 'Estrangulamento de Gola: Reconhecer e Comunicar',
        kind: 'posicao',
        caption:
          'Perceba a pegada de gola no pescoço, defenda com as mãos e avise logo dizendo "CHEGA!" ou batendo.',
        kid_text:
          'Sentiu a pressão na gola? Peça para parar bem alto e recomecem com um sorriso e um cumprimento OSS!',
        dad_tip:
          'Comunicação limpa e respeito: se o colega pediu para parar, solte no mesmo segundo.',
      },
      {
        page: 62,
        ed: 7,
        order: 5,
        title: 'Chave de Braço (Arm Lock): Técnica sem Força',
        kind: 'posicao',
        caption:
          'Controle o cotovelo junto ao peito com as pernas firmes e solte no exato instante do toque.',
        kid_text:
          'Controle o bracinho com as pernas, ajuste devagarinho e ao menor toque solte e ajude o colega a levantar!',
        dad_tip:
          'Reforce que esticar o braço de vez machuca; o controle perfeito não precisa de tranco.',
      },
      {
        page: 65,
        ed: 7,
        order: 6,
        title: 'Kimura: Figura Quatro e Cuidado com o Parceiro',
        kind: 'posicao',
        caption:
          'Faça a pegada de figura quatro segurando o punho e o próprio pulso, respeitando sempre o limite do colega.',
        kid_text:
          'Segure firme com pegada quatro, mantenha o corpo colado e ouça com atenção se o amigo bater!',
        dad_tip:
          'A kimura ensina a mecânica de alavancas; demonstre como o respeito ao amigo constrói campeões.',
      },
      {
        page: 66,
        ed: 7,
        order: 7,
        title: 'Por Cima na Guarda: Postura, Abertura e Passagem',
        kind: 'posicao',
        caption:
          'As três etapas sagradas de quem está por cima: primeiro posture, depois abra com calma e então passe!',
        kid_text:
          'Coluna reta, abra a guarda no tempo certo e passe comemorando com o papai e com o Léo!',
        dad_tip:
          'Três etapas em ordem para não se afobar: postura -> abertura -> passagem. Um passo de cada vez!',
      },
    ]

    // Salvar ou atualizar cada um dos 57 quadros representativos das 69 páginas
    for (let i = 0; i < panels.length; i++) {
      const p = panels[i]
      const chapterId = chapterMap[p.ed]
      if (!chapterId) continue

      let posterRec
      try {
        posterRec = app.findFirstRecordByData('posters', 'title', p.title)
      } catch (_) {
        posterRec = new Record(postersCol)
      }
      posterRec.set('title', p.title)
      posterRec.set('chapter', chapterId)
      posterRec.set('order', p.order)
      posterRec.set('kind', p.kind)
      posterRec.set('caption', p.caption)
      posterRec.set('kid_text', p.kid_text)
      posterRec.set('dad_tip', p.dad_tip)
      app.save(posterRec)
    }

    // Limpar quadros órfãos ou de seeds preliminares em edições antigas se houver
    const oldTitlesToRemove = [
      'Passagem de Guarda com Joelho',
      'Defesa da Montada com Cotovelos',
      'Ganchos e Cinto de Segurança',
      'Recuperar a Meia-Guarda',
      'Saída da Montada com Camarão',
    ]
    for (let i = 0; i < oldTitlesToRemove.length; i++) {
      try {
        const oldP = app.findFirstRecordByData('posters', 'title', oldTitlesToRemove[i])
        // Se ainda não tem arte e pertence a edições 2..4 antigas, podemos remover para não duplicar
        if (oldP && !oldP.getString('image')) {
          app.delete(oldP)
        }
      } catch (_) {}
    }
  },
  (app) => {
    // Reverter novas edições criadas se necessário
    for (let ord = 2; ord <= 7; ord++) {
      try {
        const c = app.findFirstRecordByData('chapters', 'order', ord)
        if (c) app.delete(c)
      } catch (_) {}
    }
  },
)
