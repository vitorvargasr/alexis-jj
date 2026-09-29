export interface DrillExercise {
  number: number
  name: string
  description: string
  reps: string
}

export interface DrillDay {
  day: number
  week: number // 1, 2, 3, 4, ou 5 (dias 29-30)
  title: string
  focus: string
  time: string
  pace: string
  equipment: string
  warmup: string
  exercises: DrillExercise[]
  finalChallenge: string
  parentTip: string
  progressSignal: string
}

export interface WeekCheckpoint {
  week: number
  theme: string
  kidQuestions: string[]
  parentEvaluationItems: string[]
  nextWeekTip: string
}

export const HOW_TO_USE_RULES = [
  {
    number: 1,
    title: 'Frequência',
    desc: 'Treine 5 a 6 dias por semana. Se a criança estiver cansada, pule o dia e retome depois. Consistência vale mais que obrigatoriedade.',
  },
  {
    number: 2,
    title: 'Duração',
    desc: 'Cada sessão dura cerca de 18 a 22 minutos. Crianças menores podem fazer apenas 2 blocos e o desafio final.',
  },
  {
    number: 3,
    title: 'Espaço',
    desc: 'Use piso firme com tapete ou tatame macio, sem quinas, móveis próximos ou objetos soltos.',
  },
  {
    number: 4,
    title: 'Repetição',
    desc: 'Qualidade primeiro. Pare a série quando o movimento começar a ficar desorganizado. Não treine até a exaustão.',
  },
  {
    number: 5,
    title: 'Pais',
    desc: 'O adulto organiza o espaço, marca o tempo e dá instruções simples. Não force amplitude, não faça resistência e não pressione posições.',
  },
  {
    number: 6,
    title: 'Professor',
    desc: 'O programa complementa – não substitui – o professor. Se um movimento for diferente do ensinado na academia, siga a orientação do professor.',
  },
]

export const GOLDEN_RULE =
  'Sem estrangulamentos, chaves articulares, quedas, projeções, pressão sobre pescoço ou resistência de adulto. Em casa, o foco é movimento, base, fuga, transição e coordenação.'

export const SAFETY_ITEMS = [
  {
    number: 1,
    title: 'Área Livre',
    desc: 'Retire mesas, bancos, brinquedos, quinas e objetos que possam ser atingidos.',
  },
  {
    number: 2,
    title: 'Superfície',
    desc: 'Prefira tatame EVA firme, colchonete esportivo ou tapete estável. Evite colchão muito mole.',
  },
  {
    number: 3,
    title: 'Pés Descalços',
    desc: 'Sem meias escorregadias. Mantenha o local seco e limpo.',
  },
  {
    number: 4,
    title: 'Sem Adulto como Adversário',
    desc: 'O adulto não deve usar peso corporal, força ou resistência contra a criança.',
  },
  {
    number: 5,
    title: 'Almofada / Dummy',
    desc: 'Quando indicado, use almofada grande, travesseiro firme ou boneco de treino como alvo técnico.',
  },
  {
    number: 6,
    title: 'Ritmo Infantil',
    desc: 'A criança deve conseguir conversar entre os blocos. Treino em casa não é teste de condicionamento máximo.',
  },
]

export const PROGRAM_MAP_WEEKS = [
  {
    week: 1,
    title: 'Semana 1: Fundamentos de Movimento',
    description: 'Base, postura, shrimp, ponte, levantar técnico, base de combate e revisão.',
    daysRange: 'Dias 1 a 7',
  },
  {
    week: 2,
    title: 'Semana 2: Mobilidade no Solo',
    description:
      'Troca de quadril, turtle, recuo defensivo, retenção de guarda na parede, passadas e circuito.',
    daysRange: 'Dias 8 a 14',
  },
  {
    week: 3,
    title: 'Semana 3: Conectar Técnicas',
    description:
      'Recuperar guarda, fuga da montada simulada, passagens ao redor de almofada, controle e transições.',
    daysRange: 'Dias 15 a 21',
  },
  {
    week: 4,
    title: 'Semana 4: Velocidade com Controle',
    description:
      'Reação, pegada leve, estabilidade, scramble, shadow jiu-jitsu, cadeias de fuga e passagem.',
    daysRange: 'Dias 22 a 28',
  },
  {
    week: 5,
    title: 'Dias 29-30: Simulação e Teste Final',
    description: 'Circuito de campeonato em casa, revisão do que melhorou e plano para continuar.',
    daysRange: 'Dias 29 e 30',
  },
]

export const QUICK_PARENT_GUIDE = [
  {
    number: 1,
    title: 'Use uma frase por vez',
    desc: '“Pés afastados.” “Quadril para fora.” “Termine em base.” Instruções curtas funcionam melhor.',
  },
  {
    number: 2,
    title: 'Elogie comportamento específico',
    desc: 'Em vez de “muito bem”, diga “você manteve a base mesmo cansado”. Isso mostra o que repetir.',
  },
  {
    number: 3,
    title: 'Evite virar técnico',
    desc: 'O professor ensina jiu-jitsu; o adulto em casa facilita repetição, rotina e confiança.',
  },
  {
    number: 4,
    title: 'Pare antes de ficar ruim',
    desc: 'Se a criança começa a se jogar, prender a respiração ou perder atenção, é hora de encerrar.',
  },
  {
    number: 5,
    title: 'Use jogos',
    desc: 'Cronômetro, cores, setas e almofadas transformam repetição em brincadeira sem perder o objetivo técnico.',
  },
  {
    number: 6,
    title: 'Registre evolução',
    desc: 'Uma foto do calendário ou uma nota de 1 a 5 ajuda a mostrar consistência sem criar pressão por resultado.',
  },
]

export const WEEK_CHECKPOINTS: WeekCheckpoint[] = [
  {
    week: 1,
    theme: 'Fundamentos de movimento',
    kidQuestions: [
      'Qual movimento ficou mais fácil?',
      'Qual movimento você quer repetir?',
      'Em qual drill você conseguiu ficar mais equilibrado?',
      'O que seu professor sempre pede para você lembrar?',
    ],
    parentEvaluationItems: [
      'Organização do movimento (melhorou / igual / precisa de calma)',
      'Equilíbrio (melhorou / igual / precisa de calma)',
      'Memória da sequência (melhorou / igual / precisa de calma)',
      'Autonomia (melhorou / igual / precisa de calma)',
      'Prazer em treinar (alto / médio / baixo)',
    ],
    nextWeekTip:
      'Escolha 2 pontos de atenção para a próxima semana (Ex.: “não cruzar os pés”, “usar mais o quadril”). Evite dar muitas correções ao mesmo tempo.',
  },
  {
    week: 2,
    theme: 'Mobilidade no solo',
    kidQuestions: [
      'Qual movimento ficou mais fácil?',
      'Qual movimento você quer repetir?',
      'Em qual drill você conseguiu ficar mais equilibrado?',
      'O que seu professor sempre pede para você lembrar?',
    ],
    parentEvaluationItems: [
      'Organização do movimento (melhorou / igual / precisa de calma)',
      'Equilíbrio (melhorou / igual / precisa de calma)',
      'Memória da sequência (melhorou / igual / precisa de calma)',
      'Autonomia (melhorou / igual / precisa de calma)',
      'Prazer em treinar (alto / médio / baixo)',
    ],
    nextWeekTip:
      'Trabalhe a fluidez das transições sem pressa. Valorize quando a criança sai do solo sem bater joelhos no chão.',
  },
  {
    week: 3,
    theme: 'Conectar técnicas',
    kidQuestions: [
      'Qual movimento ficou mais fácil?',
      'Qual movimento você quer repetir?',
      'Em qual drill você conseguiu ficar mais equilibrado?',
      'O que seu professor sempre pede para você lembrar?',
    ],
    parentEvaluationItems: [
      'Organização do movimento (melhorou / igual / precisa de calma)',
      'Equilíbrio (melhorou / igual / precisa de calma)',
      'Memória da sequência (melhorou / igual / precisa de calma)',
      'Autonomia (melhorou / igual / precisa de calma)',
      'Prazer em treinar (alto / médio / baixo)',
    ],
    nextWeekTip:
      'Observe a capacidade de ligar um movimento ao outro sem hesitar. Faça perguntas curtas: “Onde está sua base?”.',
  },
  {
    week: 4,
    theme: 'Velocidade com controle',
    kidQuestions: [
      'Qual movimento ficou mais fácil?',
      'Qual movimento você quer repetir?',
      'Em qual drill você conseguiu ficar mais equilibrado?',
      'O que seu professor sempre pede para você lembrar?',
    ],
    parentEvaluationItems: [
      'Organização do movimento (melhorou / igual / precisa de calma)',
      'Equilíbrio (melhorou / igual / precisa de calma)',
      'Memória da sequência (melhorou / igual / precisa de calma)',
      'Autonomia (melhorou / igual / precisa de calma)',
      'Prazer em treinar (alto / médio / baixo)',
    ],
    nextWeekTip:
      'Parabéns pela dedicação! Agora vocês estão prontos para a Simulação de Campeonato e Teste Final dos Dias 29 e 30.',
  },
]

export const DRILL_DAYS: DrillDay[] = [
  // SEMANA 1
  {
    day: 1,
    week: 1,
    title: 'Base e postura',
    focus: 'Aprender a ficar estável antes de atacar ou se mover.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup:
      '2 min de caminhada animal leve + 2 min alternando agachar, levantar e congelar em base.',
    exercises: [
      {
        number: 1,
        name: 'Base atlética',
        description:
          'Pés afastados, joelhos flexionados, peito alto e mãos à frente. Segure 10 s sem balançar.',
        reps: '5 x 10 s',
      },
      {
        number: 2,
        name: 'Passo sem cruzar',
        description: 'Dê 3 passos para cada lado mantendo os pés afastados sem cruzar as pernas.',
        reps: '4 voltas',
      },
      {
        number: 3,
        name: 'Base + toque',
        description:
          'Adulto aponta direita/esquerda; criança toca o chão com a mão do lado indicado e volta à base.',
        reps: '2 x 45 s',
      },
    ],
    finalChallenge:
      'Jogo do congelou: caminhe pelo espaço; ao ouvir “BASE!”, pare em postura estável em até 2 segundos.',
    parentTip:
      'Corrija apenas 2 coisas: pés não se cruzam e cabeça não fica muito à frente dos joelhos.',
    progressSignal: 'Consegue se mover em 4 direções e parar equilibrado.',
  },
  {
    day: 2,
    week: 1,
    title: 'Shrimp - fuga de quadril',
    focus: 'Criar espaço usando o quadril, sem empurrar com os braços.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup:
      'Mobilidade de quadril, 8 círculos para cada lado + 10 pontes leves + 20 passos laterais.',
    exercises: [
      {
        number: 1,
        name: 'Shrimp parado',
        description:
          'Deitado, um pé no chão, gire levemente de lado e empurre o chão para afastar o quadril.',
        reps: '3 x 5 por lado',
      },
      {
        number: 2,
        name: 'Shrimp em linha',
        description: 'Marque 2 m no chão. Faça shrimps alternando os lados até chegar ao final.',
        reps: '4 idas',
      },
      {
        number: 3,
        name: 'Shrimp + guarda',
        description: 'Após cada shrimp, traga os dois joelhos entre você e uma almofada à frente.',
        reps: '2 x 6',
      },
    ],
    finalChallenge:
      'Corrida do camarão: 2 percursos lentos buscando técnica limpa, não velocidade.',
    parentTip: 'Evite puxar a cabeça ou fazer força no pescoço. O impulso vem do pé e do quadril.',
    progressSignal: 'O quadril se afasta e os joelhos voltam para proteger a frente do corpo.',
  },
  {
    day: 3,
    week: 1,
    title: 'Ponte e giro',
    focus: 'Usar pés e quadril para tirar peso de cima e iniciar fugas.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '10 elevações de quadril, 10 joelhos ao peito e 30 s de prancha alta adaptada.',
    exercises: [
      {
        number: 1,
        name: 'Ponte alta',
        description:
          'Pés próximos do quadril, empurre o chão e eleve o quadril sem jogar a cabeça para trás.',
        reps: '3 x 6',
      },
      {
        number: 2,
        name: 'Ponte diagonal',
        description: 'Eleve e gire um ombro de cada vez, como se quisesse olhar para trás.',
        reps: '2 x 5 por lado',
      },
      {
        number: 3,
        name: 'Ponte + shrimp',
        description: 'Faça uma ponte, volte controlado e imediatamente execute um shrimp.',
        reps: '2 x 6',
      },
    ],
    finalChallenge:
      'Desafio 1-2: adulto fala “1” para ponte e “2” para shrimp; criança reage sem pressa por 60 s.',
    parentTip: 'Nada de pressão sobre a barriga ou peito. O drill é totalmente solo.',
    progressSignal: 'Consegue ligar ponte e shrimp sem parar para pensar.',
  },
  {
    day: 4,
    week: 1,
    title: 'Levantar técnico',
    focus: 'Levantar do chão mantendo distância e equilíbrio.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '2 min de deslocamentos + 5 senta-levanta lentos + 5 apoios de mão alternados.',
    exercises: [
      {
        number: 1,
        name: 'Posição inicial',
        description:
          'Sentado, uma mão atrás no chão, pé oposto plantado e outra mão protegendo a frente.',
        reps: '5 x cada lado',
      },
      {
        number: 2,
        name: 'Elevar quadril',
        description: 'Empurre o pé e a mão no chão, levantando o quadril sem cruzar as pernas.',
        reps: '3 x 5',
      },
      {
        number: 3,
        name: 'Passo para trás',
        description: 'Passe a perna livre para trás, termine em base e olhe para frente.',
        reps: '3 x 4 por lado',
      },
    ],
    finalChallenge:
      'Coloque uma almofada a 1 m como “adversário”. Levante técnico sem virar as costas para ela.',
    parentTip:
      'Priorize controle. Se a criança perder equilíbrio, reduza a velocidade e a amplitude.',
    progressSignal: 'Levanta sem apoiar os dois joelhos e termina em base.',
  },
  {
    day: 5,
    week: 1,
    title: 'Base de combate',
    focus: 'Aprender a posição intermediária entre chão e em pé.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: 'Mobilidade de tornozelos e quadril + 10 mudanças ajoelhado/em base.',
    exercises: [
      {
        number: 1,
        name: 'Combat base',
        description: 'Um joelho no chão, outro pé à frente, coluna alta e mãos prontas.',
        reps: '5 x 10 s por lado',
      },
      {
        number: 2,
        name: 'Troca de lado',
        description: 'Passe de uma base de combate para a outra sem levantar totalmente.',
        reps: '2 x 8',
      },
      {
        number: 3,
        name: 'Combat base + levantar',
        description: 'Da base de combate, levante em base atlética e retorne controlado.',
        reps: '3 x 5',
      },
    ],
    finalChallenge:
      'Relógio: adulto aponta 12, 3, 6 ou 9 horas; criança gira a base para a direção indicada.',
    parentTip: 'Não deixe o joelho bater no piso. Use superfície acolchoada e movimentos leves.',
    progressSignal: 'Troca os lados sem cair para dentro e mantém o peito alto.',
  },
  {
    day: 6,
    week: 1,
    title: 'Rolamento lateral e orientação corporal',
    focus: 'Melhorar noção espacial sem exigir rolamento sobre o pescoço.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup:
      '2 min de caminhada de urso leve + 8 rotações de tronco sentado + 10 abraços de joelho.',
    exercises: [
      {
        number: 1,
        name: 'Balanço lateral',
        description:
          'Deitado com joelhos abraçados, balance de um lado para o outro sem apoiar a cabeça.',
        reps: '2 x 8',
      },
      {
        number: 2,
        name: 'Ombro-quadril',
        description:
          'Role do lado direito para o esquerdo conectando ombro e quadril, sem passar sobre o pescoço.',
        reps: '3 x 6',
      },
      {
        number: 3,
        name: 'Virar para base',
        description: 'Do lado, gire para quatro apoios e termine em base de combate.',
        reps: '2 x 5 por lado',
      },
    ],
    finalChallenge:
      'Setas no chão: ao terminar o giro, a criança deve ficar de frente para a seta indicada.',
    parentTip:
      'Sem rolamento frontal ou para trás sobre a cervical. A cabeça fica protegida e fora do ponto de apoio.',
    progressSignal: 'Sai do chão e encontra a direção correta rapidamente.',
  },
  {
    day: 7,
    week: 1,
    title: 'Circuito da Semana 1',
    focus: 'Consolidar base, shrimp, ponte e levantar técnico.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '3 min de aquecimento livre com os movimentos favoritos da semana.',
    exercises: [
      {
        number: 1,
        name: 'Estação 1',
        description: 'Base + 4 passos laterais + congelar.',
        reps: '3 voltas',
      },
      {
        number: 2,
        name: 'Estação 2',
        description: '2 shrimps por lado + 2 pontes diagonais.',
        reps: '3 voltas',
      },
      {
        number: 3,
        name: 'Estação 3',
        description: '1 levantar técnico por lado + 2 trocas de combat base.',
        reps: '3 voltas',
      },
    ],
    finalChallenge:
      'Circuito 4 minutos: execute as 3 estações em fluxo, descansando quando precisar.',
    parentTip:
      'Filme 20 segundos apenas para comparar a organização do movimento, não para cobrar performance.',
    progressSignal: 'Executa 4 movimentos diferentes lembrando a ordem.',
  },

  // SEMANA 2
  {
    day: 8,
    week: 2,
    title: 'Troca de quadril',
    focus: 'Girar o quadril mantendo apoio e controle.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '10 pontes leves + 10 rotações de quadril em quatro apoios.',
    exercises: [
      {
        number: 1,
        name: 'Hip switch sentado',
        description: 'Sentado com pernas dobradas, gire os joelhos de um lado para o outro.',
        reps: '2 x 10',
      },
      {
        number: 2,
        name: 'Hip switch em apoio',
        description: 'Em quatro apoios, passe um quadril em direção ao chão e volte.',
        reps: '2 x 6 por lado',
      },
      {
        number: 3,
        name: 'Troca + base',
        description: 'Hip switch, retorne aos quatro apoios e suba para combat base.',
        reps: '2 x 5',
      },
    ],
    finalChallenge:
      'Jogo das cores: coloque 2 objetos coloridos; o adulto chama uma cor e a criança gira o quadril para aquele lado.',
    parentTip: 'Movimento baixo e controlado. Evite queda brusca do quadril.',
    progressSignal: 'Gira para os dois lados sem travar e volta para uma base forte.',
  },
  {
    day: 9,
    week: 2,
    title: 'Turtle e saída lateral',
    focus: 'Mover-se a partir de quatro apoios sem expor o pescoço.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: 'Caminhada de urso 2 x 20 s + 10 joelhos ao peito alternados.',
    exercises: [
      {
        number: 1,
        name: 'Turtle compacto',
        description:
          'Joelhos e cotovelos próximos, queixo levemente recolhido e costas arredondadas.',
        reps: '4 x 10 s',
      },
      {
        number: 2,
        name: 'Sit-out leve',
        description:
          'Dos quatro apoios, deslize uma perna por baixo do corpo e sente o quadril para o lado.',
        reps: '2 x 5 por lado',
      },
      {
        number: 3,
        name: 'Turtle + levantar',
        description: 'Volte aos quatro apoios, traga um pé à frente e termine em combat base.',
        reps: '2 x 5',
      },
    ],
    finalChallenge:
      'Desafio “saída”: o adulto fala direita/esquerda e a criança executa o sit-out para o lado correto.',
    parentTip: 'Não faça pressão nas costas e não puxe braços. O adulto apenas dá os comandos.',
    progressSignal: 'Protege o pescoço e consegue sair lateralmente para os dois lados.',
  },
  {
    day: 10,
    week: 2,
    title: 'Recuo defensivo',
    focus: 'Aprender a afastar quadril e pés quando algo se aproxima.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '30 s de passos rápidos + 10 agachamentos leves + 8 shrimps alternados.',
    exercises: [
      {
        number: 1,
        name: 'Hip back',
        description: 'De pé em base, dê um passo curto para trás mantendo as mãos à frente.',
        reps: '3 x 6',
      },
      {
        number: 2,
        name: 'Mãos no chão + pernas atrás',
        description: 'Apoie as mãos, leve os pés para trás sem jogar o corpo e volte.',
        reps: '2 x 6',
      },
      {
        number: 3,
        name: 'Recuo + base',
        description: 'Faça o recuo e retorne imediatamente à base atlética.',
        reps: '2 x 6',
      },
    ],
    finalChallenge:
      'Almofada avança: adulto desliza lentamente uma almofada pelo chão; criança cria distância sem chutá-la.',
    parentTip: 'Sem sprawl em cima de outra pessoa. Use apenas o movimento de recuo no solo.',
    progressSignal: 'Cria distância e recupera a base sem cruzar os pés.',
  },
  {
    day: 11,
    week: 2,
    title: 'Retenção de guarda na parede',
    focus: 'Treinar mobilidade de quadril e pernas usando uma parede como referência.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '10 shrimps + 10 movimentos de joelhos ao peito.',
    exercises: [
      {
        number: 1,
        name: 'Pés na parede',
        description:
          'Deite a uma distância confortável, coloque pés na parede e mantenha joelhos flexionados.',
        reps: '3 x 20 s',
      },
      {
        number: 2,
        name: 'Caminhar na parede',
        description: 'Mova os pés lateralmente enquanto o quadril acompanha.',
        reps: '2 x 30 s',
      },
      {
        number: 3,
        name: 'Shrimp na parede',
        description: 'Empurre levemente um pé na parede, afaste o quadril e recoloque os dois pés.',
        reps: '2 x 5 por lado',
      },
    ],
    finalChallenge:
      'Desafio “não fique quadrado”: mova o quadril 6 vezes sem deixar as pernas esticarem totalmente.',
    parentTip: 'Pare se a parede for escorregadia. Sem chutes ou impulsos fortes.',
    progressSignal: 'Quadril e pés trabalham juntos para manter a frente protegida.',
  },
  {
    day: 12,
    week: 2,
    title: 'Passos de passagem ao redor da almofada',
    focus: 'Treinar direção, base e troca de lado sem parceiro.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '2 min de passos laterais + 10 trocas de combat base.',
    exercises: [
      {
        number: 1,
        name: 'Passo lateral',
        description:
          'Almofada no chão. Contorne sem cruzar os pés e mantenha os joelhos flexionados.',
        reps: '4 voltas cada lado',
      },
      {
        number: 2,
        name: 'Knee-cut shadow',
        description: 'Simule um passo diagonal ao lado da almofada e termine com base estável.',
        reps: '2 x 6 por lado',
      },
      {
        number: 3,
        name: 'Troca de direção',
        description: 'Dê meia volta ao redor da almofada e mude o sentido ao comando.',
        reps: '2 x 45 s',
      },
    ],
    finalChallenge: 'Jogo do relógio: almofada no centro; pare nas posições 12, 3, 6 e 9 horas.',
    parentTip: 'Nenhum joelho deve cair com força sobre a almofada. É treino de pés e direção.',
    progressSignal: 'Consegue passar de um lado para o outro mantendo postura.',
  },
  {
    day: 13,
    week: 2,
    title: 'Levantar sob comando',
    focus: 'Transformar levantar técnico em resposta automática.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '5 shrimps por lado + 5 pontes + 5 combat bases.',
    exercises: [
      {
        number: 1,
        name: 'Sentado para base',
        description: 'Faça o levantar técnico completo em velocidade confortável.',
        reps: '3 x 4 por lado',
      },
      {
        number: 2,
        name: 'De lado para base',
        description: 'Comece deitado de lado, sente e faça o levantar técnico.',
        reps: '2 x 4 por lado',
      },
      {
        number: 3,
        name: 'Turtle para base',
        description: 'Quatro apoios -> combat base -> base em pé.',
        reps: '2 x 5',
      },
    ],
    finalChallenge:
      'Adulto chama “sentado”, “lado” ou “turtle”; criança assume a posição e levanta corretamente.',
    parentTip: 'Não transforme em corrida. Técnica limpa vale mais do que responder rápido.',
    progressSignal: 'Levanta a partir de três posições sem virar as costas para a frente.',
  },
  {
    day: 14,
    week: 2,
    title: 'Circuito da Semana 2',
    focus: 'Juntar mobilidade de solo, retenção e passadas.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '3 min de aquecimento com hip switch, turtle e passos laterais.',
    exercises: [
      {
        number: 1,
        name: 'Estação 1',
        description: '5 hip switches + 2 sit-outs por lado.',
        reps: '3 voltas',
      },
      {
        number: 2,
        name: 'Estação 2',
        description: '4 shrimps na parede + 1 levantar técnico.',
        reps: '3 voltas',
      },
      {
        number: 3,
        name: 'Estação 3',
        description: 'Uma volta completa ao redor da almofada + combat base.',
        reps: '3 voltas',
      },
    ],
    finalChallenge:
      'Faça 3 minutos contínuos em ritmo de conversa. Descanso de 60 s. Repita 2 vezes.',
    parentTip:
      'Observe se a criança mantém controle quando cansa. Se a técnica desorganizar, encerre a rodada.',
    progressSignal: 'Conecta movimentos sem perder segurança e postura.',
  },

  // SEMANA 3
  {
    day: 15,
    week: 3,
    title: 'Shrimp + recuperar guarda',
    focus: 'Criar espaço e recolocar pernas entre o corpo e o “adversário”.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '8 shrimps alternados + 10 joelhos ao peito.',
    exercises: [
      {
        number: 1,
        name: 'Almofada à frente',
        description: 'Deitado, deixe uma almofada perto do quadril. Faça shrimp para criar espaço.',
        reps: '2 x 6 por lado',
      },
      {
        number: 2,
        name: 'Joelho por dentro',
        description: 'Após o shrimp, traga o joelho do lado de dentro entre você e a almofada.',
        reps: '2 x 6',
      },
      {
        number: 3,
        name: 'Dois joelhos',
        description: 'Complete trazendo os dois joelhos à frente e pés prontos para enquadrar.',
        reps: '2 x 6',
      },
    ],
    finalChallenge:
      'Sequência 1-2-3: shrimp -> joelho por dentro -> dois joelhos. Faça 8 sequências limpas.',
    parentTip: 'Use apenas almofada; ninguém deve deitar sobre a criança.',
    progressSignal: 'Recupera a frente do corpo em vez de ficar “quadrado” no chão.',
  },
  {
    day: 16,
    week: 3,
    title: 'Fuga da montada - mecânica solo',
    focus: 'Treinar ponte, giro e shrimp usados em fugas sem colocar peso sobre a criança.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '10 pontes leves + 6 shrimps por lado.',
    exercises: [
      {
        number: 1,
        name: 'Ponte diagonal',
        description: 'Eleve o quadril e gire o ombro para um lado.',
        reps: '2 x 5 por lado',
      },
      {
        number: 2,
        name: 'Cotovelos próximos',
        description: 'Deitado, mantenha cotovelos perto das costelas e mãos protegendo a frente.',
        reps: '3 x 15 s',
      },
      {
        number: 3,
        name: 'Ponte + shrimp',
        description: 'Faça ponte diagonal, volte e execute shrimp para o mesmo lado.',
        reps: '3 x 4 por lado',
      },
    ],
    finalChallenge:
      'Almofada sobre as coxas sem peso: após o shrimp, “escape” o quadril para fora da linha da almofada.',
    parentTip:
      'Nunca sente sobre a criança para simular montada. O drill deve permanecer sem carga.',
    progressSignal: 'Consegue criar espaço combinando ponte e quadril.',
  },
  {
    day: 17,
    week: 3,
    title: 'Passagem em arco',
    focus: 'Aprender a contornar pernas imaginárias mantendo distância.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '2 min de footwork ao redor de marcações no chão.',
    exercises: [
      {
        number: 1,
        name: 'Arco externo',
        description: 'Coloque 2 almofadas como pernas. Contorne por fora em semicírculo.',
        reps: '3 x cada lado',
      },
      {
        number: 2,
        name: 'Troca rápida',
        description: 'Pare no meio do arco, volte um passo e mude para o outro lado.',
        reps: '2 x 6',
      },
      {
        number: 3,
        name: 'Arco + estabilizar',
        description: 'Ao chegar ao lado, pare 3 s em base baixa e controlada.',
        reps: '2 x 5 por lado',
      },
    ],
    finalChallenge: 'Desafio: 60 s contornando sem tocar nas almofadas e sem cruzar os pés.',
    parentTip: 'Espaço amplo, sem correr. O foco é precisão dos passos.',
    progressSignal: 'Chega ao lado da “guarda” e estabiliza em base.',
  },
  {
    day: 18,
    week: 3,
    title: 'Controle lateral no dummy',
    focus: 'Aprender distribuição de base usando almofada grande, sem parceiro.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '5 combat bases por lado + 10 deslocamentos de joelho suaves.',
    exercises: [
      {
        number: 1,
        name: 'Joelhos afastados',
        description:
          'Ao lado da almofada, ajoelhe com base ampla, quadril baixo e mãos no chão ao redor.',
        reps: '3 x 15 s',
      },
      {
        number: 2,
        name: 'Trocar de lado',
        description: 'Passe pela cabeça da almofada sem subir em cima dela.',
        reps: '2 x 6',
      },
      {
        number: 3,
        name: 'Base + levantar',
        description: 'Do controle simulado, volte para combat base e levante.',
        reps: '2 x 5',
      },
    ],
    finalChallenge: 'Relógio do controle: alterne lados a cada 10 s por 90 s.',
    parentTip: 'Sem joelho sobre pessoas. O “adversário” é apenas a almofada.',
    progressSignal: 'Mantém equilíbrio enquanto troca de lado.',
  },
  {
    day: 19,
    week: 3,
    title: 'Controle de costas no dummy',
    focus: 'Treinar posição, conexão e troca de lado sem aplicar pressão.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: 'Mobilidade de quadril sentado + 8 hip switches.',
    exercises: [
      {
        number: 1,
        name: 'Seatbelt no travesseiro',
        description:
          'Segure uma almofada grande junto ao peito com um braço por cima e outro por baixo.',
        reps: '3 x 20 s',
      },
      {
        number: 2,
        name: 'Troca de lado',
        description: 'Mude o braço que fica por cima sem soltar a almofada.',
        reps: '2 x 8',
      },
      {
        number: 3,
        name: 'Quadril atrás',
        description: 'Sente atrás da almofada, pés no chão, joelhos dobrados e postura alta.',
        reps: '3 x 15 s',
      },
    ],
    finalChallenge:
      'Jogo de conexão: adulto tenta puxar levemente a almofada, mas sem resistência corporal; criança mantém a pegada apenas o suficiente para ela não escapar.',
    parentTip:
      'Nada de simular estrangulamentos. O foco é abraçar e posicionar, nunca apertar o pescoço.',
    progressSignal: 'Mantém conexão com controle e troca os braços sem confusão.',
  },
  {
    day: 20,
    week: 3,
    title: 'Transições no dummy',
    focus: 'Ligar passagem, controle e saída de forma organizada.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '2 min de footwork + 6 combat bases.',
    exercises: [
      {
        number: 1,
        name: 'Passar para o lado',
        description: 'Contorne a almofada e pare ao lado.',
        reps: '2 x 5 por lado',
      },
      {
        number: 2,
        name: 'Lado para costas',
        description: 'Gire ao redor da parte superior da almofada e sente atrás dela.',
        reps: '2 x 5',
      },
      {
        number: 3,
        name: 'Costas para base',
        description: 'Solte a almofada, faça levantar técnico e termine em base.',
        reps: '2 x 5',
      },
    ],
    finalChallenge:
      'Sequência completa: passar -> lado -> costas -> levantar. Faça 5 vezes em cada sentido.',
    parentTip: 'Movimentos lentos e sem joelhos batendo no chão.',
    progressSignal: 'Completa uma cadeia de 4 posições lembrando a ordem.',
  },
  {
    day: 21,
    week: 3,
    title: 'Circuito da Semana 3',
    focus: 'Conectar fugas, passagem e controles simulados.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '3 min de revisão dos movimentos em ritmo leve.',
    exercises: [
      {
        number: 1,
        name: 'Estação 1',
        description: 'Ponte + shrimp + recuperar guarda.',
        reps: '4 repetições',
      },
      {
        number: 2,
        name: 'Estação 2',
        description: 'Arco de passagem + estabilizar 3 s.',
        reps: '4 por lado',
      },
      {
        number: 3,
        name: 'Estação 3',
        description: 'Controle lateral -> costas -> levantar técnico.',
        reps: '4 sequências',
      },
    ],
    finalChallenge:
      '2 rounds de 3 min com 90 s de descanso. A criança escolhe a ordem das estações no segundo round.',
    parentTip: 'Faça perguntas curtas: “onde está sua base?” e “qual é seu próximo movimento?”.',
    progressSignal: 'Consegue decidir o próximo passo sem receber instrução a cada segundo.',
  },

  // SEMANA 4
  {
    day: 22,
    week: 4,
    title: 'Reação e direção',
    focus: 'Responder a estímulos sem perder a técnica.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '4 min de caminhada, passos laterais e mudanças de direção.',
    exercises: [
      {
        number: 1,
        name: '4 cones',
        description: 'Coloque 4 objetos em cruz. Parta do centro e toque o objeto chamado.',
        reps: '3 x 40 s',
      },
      {
        number: 2,
        name: 'Base ao voltar',
        description: 'Sempre retorne ao centro em base atlética.',
        reps: '3 x 40 s',
      },
      {
        number: 3,
        name: 'Chão e em pé',
        description: 'Ao comando “chão”, sente; ao “base”, faça levantar técnico.',
        reps: '2 x 45 s',
      },
    ],
    finalChallenge:
      'Adulto mistura cores/direções por 2 min. Pontue 1 ponto para cada resposta com boa postura.',
    parentTip: 'Não aumente a velocidade se o espaço for pequeno. Segurança vem antes do tempo.',
    progressSignal: 'Reage sem cruzar os pés nem se jogar no chão.',
  },
  {
    day: 23,
    week: 4,
    title: 'Pegada leve e antebraço',
    focus: 'Melhorar coordenação das mãos sem treinos de força excessiva.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: 'Abrir/fechar mãos 20x + círculos de punho + 10 remadas sem carga.',
    exercises: [
      {
        number: 1,
        name: 'Toalha enrolada',
        description: 'Segure uma toalha com as duas mãos e faça tensão leve por 8 s.',
        reps: '5 x 8 s',
      },
      {
        number: 2,
        name: 'Troca de pegada',
        description: 'Passe a mão de uma ponta para outra da toalha, como subir uma escada.',
        reps: '2 x 30 s',
      },
      {
        number: 3,
        name: 'Puxa e relaxa',
        description: 'Adulto segura a outra ponta sem resistir; criança puxa levemente e relaxa.',
        reps: '2 x 8',
      },
    ],
    finalChallenge:
      'Desafio controle: segurar 15 s sem prender a respiração ou fazer careta de esforço.',
    parentTip:
      'Sem puxões fortes, sem pendurar o peso do corpo e sem competição de força com adulto.',
    progressSignal: 'Mantém pegada moderada e respiração normal.',
  },
  {
    day: 24,
    week: 4,
    title: 'Centro do corpo e postura',
    focus: 'Aumentar estabilidade para manter base durante os movimentos.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: 'Mobilidade de coluna suave + 10 bird-dogs alternados.',
    exercises: [
      {
        number: 1,
        name: 'Prancha curta',
        description: 'Prancha alta com joelhos no chão, corpo alinhado.',
        reps: '4 x 15 s',
      },
      {
        number: 2,
        name: 'Bird-dog',
        description: 'Em quatro apoios, estenda braço e perna opostos sem girar o tronco.',
        reps: '2 x 6 por lado',
      },
      {
        number: 3,
        name: 'Base com toque',
        description: 'Em base, toque lentamente joelho direito com mão esquerda e alterne.',
        reps: '2 x 10',
      },
    ],
    finalChallenge:
      'Jogo estátua: 5 posições de 10 s escolhidas entre base, combat base, turtle e prancha adaptada.',
    parentTip:
      'Nada de séries longas ou tremor excessivo. Interrompa antes da fadiga desorganizar a postura.',
    progressSignal: 'Mantém o tronco estável e respira durante os exercícios.',
  },
  {
    day: 25,
    week: 4,
    title: 'Scramble de 4 posições',
    focus: 'Trocar de posição com controle e orientação espacial.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '2 min de movimentos livres + 5 transições de cada posição.',
    exercises: [
      {
        number: 1,
        name: 'Base -> sentado',
        description: 'Desça com controle sem cair para trás.',
        reps: '5 repetições',
      },
      {
        number: 2,
        name: 'Sentado -> turtle',
        description: 'Gire para o lado e vá aos quatro apoios.',
        reps: '5 repetições',
      },
      {
        number: 3,
        name: 'Turtle -> combat base',
        description: 'Traga um pé à frente e estabilize.',
        reps: '5 por lado',
      },
    ],
    finalChallenge:
      'Fluxo: base -> sentado -> turtle -> combat base -> base. Faça 6 voltas; mude o sentido após 3.',
    parentTip:
      'Dê comandos de um passo por vez no começo. Depois deixe a criança memorizar a sequência.',
    progressSignal: 'Troca de posição sem usar a cabeça como apoio.',
  },
  {
    day: 26,
    week: 4,
    title: 'Shadow Jiu-Jitsu',
    focus: 'Treinar decisões imaginando situações de luta sem parceiro.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '3 min de movimentos favoritos em baixa intensidade.',
    exercises: [
      {
        number: 1,
        name: 'Abertura',
        description: '20 s em base: passo, mudança de direção e pegada imaginária.',
        reps: '3 rounds',
      },
      {
        number: 2,
        name: 'Defesa',
        description: '20 s: recuo, sentar, shrimp, recuperar guarda e levantar.',
        reps: '3 rounds',
      },
      {
        number: 3,
        name: 'Ataque técnico',
        description: '20 s: passo de passagem ao redor de almofada e estabilizar.',
        reps: '3 rounds',
      },
    ],
    finalChallenge:
      'Round de 2 min: criança cria sua própria sequência e narra o que está fazendo: “base, passo, passagem, controle, levantar”.',
    parentTip: 'Valorize clareza, não velocidade. Shadow é ferramenta de organização mental.',
    progressSignal: 'Consegue explicar a sequência enquanto executa.',
  },
  {
    day: 27,
    week: 4,
    title: 'Cadeia de fuga',
    focus: 'Automatizar ponte -> shrimp -> recuperar guarda -> levantar.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '8 pontes + 8 shrimps + 4 levantadas técnicas por lado.',
    exercises: [
      {
        number: 1,
        name: 'Ponte',
        description: 'Eleve e gire levemente para criar o primeiro espaço.',
        reps: '4 por lado',
      },
      {
        number: 2,
        name: 'Shrimp',
        description: 'Afaste o quadril na direção da fuga.',
        reps: '4 por lado',
      },
      {
        number: 3,
        name: 'Guarda + levantar',
        description: 'Traga joelhos à frente, sente com segurança e faça levantar técnico.',
        reps: '4 por lado',
      },
    ],
    finalChallenge:
      '5 sequências completas por lado. A última repetição deve ser a mais limpa, não a mais rápida.',
    parentTip: 'Sem pessoa sobre a criança. Use uma almofada apenas como referência visual.',
    progressSignal: 'Executa 4 etapas em ordem e termina em base.',
  },
  {
    day: 28,
    week: 4,
    title: 'Cadeia de passagem',
    focus: 'Automatizar footwork -> contornar -> estabilizar -> trocar lado.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '2 min ao redor de marcações + 6 combat bases.',
    exercises: [
      {
        number: 1,
        name: 'Entrar no ângulo',
        description: 'Passo diagonal curto ao lado da almofada.',
        reps: '5 por lado',
      },
      {
        number: 2,
        name: 'Contornar',
        description: 'Faça semicírculo mantendo base e mãos à frente.',
        reps: '5 por lado',
      },
      {
        number: 3,
        name: 'Estabilizar e trocar',
        description: 'Pare 3 s, volte à base e ataque o outro lado.',
        reps: '5 sequências',
      },
    ],
    finalChallenge:
      'Desafio técnico: 2 min alternando lado direito e esquerdo sem tocar na almofada.',
    parentTip: 'Se houver colisão ou pressa, reduza o espaço e diminua a velocidade.',
    progressSignal: 'Troca de lado com equilíbrio e boa distância.',
  },

  // DIAS 29 E 30: SIMULAÇÃO E TESTE FINAL
  {
    day: 29,
    week: 5,
    title: 'Simulação de campeonato em casa',
    focus: 'Aplicar técnica, foco e recuperação em rounds curtos.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '5 min: mobilidade, base, 4 shrimps, 4 pontes e 2 levantadas por lado.',
    exercises: [
      {
        number: 1,
        name: 'Round 1 - defesa',
        description: '2 min: shadow com recuo, sentar, shrimp, recuperar guarda e levantar.',
        reps: '2 min',
      },
      {
        number: 2,
        name: 'Round 2 - passagem',
        description: '2 min: contornar almofada, estabilizar, trocar de lado e levantar.',
        reps: '2 min',
      },
      {
        number: 3,
        name: 'Round 3 - livre',
        description: '2 min: combinar movimentos do programa sem parar por mais de 5 s.',
        reps: '2 min',
      },
    ],
    finalChallenge:
      'Descanse 90 s entre rounds. Beba água. No final, diga 1 movimento que funcionou melhor e 1 que precisa de treino.',
    parentTip:
      'Sem “gritar instruções”. Simule ambiente positivo: chamada, começo do round, fim e cumprimento.',
    progressSignal: 'Mantém técnica e atenção durante 3 rounds sem transformar em treino máximo.',
  },
  {
    day: 30,
    week: 5,
    title: 'Teste final + plano de continuidade',
    focus: 'Perceber evolução e escolher os fundamentos para continuar treinando.',
    time: '18-22 min',
    pace: 'técnico',
    equipment: 'tapete + almofada',
    warmup: '3 min de aquecimento leve com os movimentos preferidos.',
    exercises: [
      {
        number: 1,
        name: 'Teste técnico',
        description: '1 base + 2 shrimps por lado + 2 pontes + 1 levantar técnico por lado.',
        reps: '2 voltas',
      },
      {
        number: 2,
        name: 'Teste de sequência',
        description: 'Ponte -> shrimp -> guarda -> levantar -> contornar almofada -> estabilizar.',
        reps: '3 sequências',
      },
      {
        number: 3,
        name: 'Teste de explicação',
        description: 'A criança escolhe 3 movimentos e ensina ao adulto o que deve observar.',
        reps: '3 movimentos',
      },
    ],
    finalChallenge:
      'Mini circuito final de 4 min. Não conte “erros”; marque quantas vezes a criança se reorganizou sozinha.',
    parentTip:
      'Compare com o Dia 1 apenas em organização, confiança e compreensão. Não use peso, velocidade ou força como critério.',
    progressSignal: 'Escolhe 5 drills favoritos para manter 3 vezes por semana.',
  },
]
