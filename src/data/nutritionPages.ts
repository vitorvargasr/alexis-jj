export interface NutritionPage {
  pageNumber: number // 1 a 10 no PDF
  order: number
  badgeNumber: number // número visual do card original (ex: 27, 28, 29, 30, 21, 22, 23, 24, 25, 26)
  title: string
  subtitle: string
  lead: string
  summary: string
  dadTip: string
  bullets: Array<{ number: number; title: string; text: string }>
  bannerBottom?: string
}

export const NUTRITION_PAGES: NutritionPage[] = [
  {
    pageNumber: 1,
    order: 1,
    badgeNumber: 27,
    title: 'Minerais',
    subtitle: 'Ossos fortes e corpo funcionando bem',
    lead: 'Minerais como cálcio, ferro, magnésio e zinco ajudam seus ossos, sangue, músculos e imunidade a funcionarem bem, dando mais energia para o dia a dia e para o tatame.',
    summary:
      'Minerais = Mais Saúde: ossos fortes, mais energia, músculos ativos, imunidade em dia e evolução sempre.',
    dadTip:
      'Refeições variadas reduzem a chance de faltar nutrientes importantes. Minerais silenciosos, resultados gigantes no crescimento e no treino!',
    bullets: [
      {
        number: 1,
        title: 'Cálcio',
        text: 'Ajuda a formar e manter ossos e dentes fortes, fundamentais para o crescimento e para a prática de esportes.',
      },
      {
        number: 2,
        title: 'Ferro',
        text: 'Participa do transporte de oxigênio no sangue, ajudando na disposição e no rendimento físico e mental.',
      },
      {
        number: 3,
        title: 'Magnésio',
        text: 'Atua nos músculos, no relaxamento e no bom funcionamento do sistema nervoso, ajudando a prevenir cãibras.',
      },
      {
        number: 4,
        title: 'Zinco',
        text: 'Contribui para o crescimento, fortalece a imunidade e ajuda na recuperação do corpo depois dos treinos.',
      },
      {
        number: 5,
        title: 'Onde encontrar',
        text: 'Leite e derivados, feijão, carnes, ovos, verduras e sementes são ótimas fontes de minerais. Inclua esses alimentos na sua rotina!',
      },
      {
        number: 6,
        title: 'Variedade importa',
        text: 'Comer de tudo um pouco, com equilíbrio, ajuda a garantir todos os minerais que seu corpo precisa para crescer e render mais.',
      },
    ],
  },
  {
    pageNumber: 2,
    order: 2,
    badgeNumber: 28,
    title: 'Antioxidantes',
    subtitle: 'Defesa e recuperação',
    lead: 'Alimentos ricos em antioxidantes ajudam a proteger o corpo e contribuem para a recuperação após o treino.',
    summary:
      'Comida de verdade, mais saúde, mais energia e mais vida! Cor no prato é um jeito simples de colocar mais defesa no corpo.',
    dadTip:
      'Monte lanches com 2 ou 3 cores de frutas diferentes. A cor das frutas e verduras é um sinal visual de que há defesas ativas!',
    bullets: [
      {
        number: 1,
        title: 'O que fazem',
        text: 'Ajudam a proteger as células do corpo contra os danos causados pelos radicais livres do estresse do treino.',
      },
      {
        number: 2,
        title: 'Por que interessam',
        text: 'Podem contribuir para a recuperação rápida após o treino e para uma imunidade muito mais forte.',
      },
      {
        number: 3,
        title: 'Onde estão',
        text: 'Principalmente em frutas e verduras coloridas, como frutas vermelhas, uva, acerola, laranja, beterraba, tomate e folhas verdes.',
      },
      {
        number: 4,
        title: 'Mais cor, melhor',
        text: 'Alimentos roxo, vermelho, laranja e verde escuro são ótimos sinais de que têm antioxidantes protetores.',
      },
      {
        number: 5,
        title: 'No dia a dia',
        text: 'Uma fruta no lanche e uma salada no almoço já ajudam muito a aumentar o consumo diário de antioxidantes.',
      },
      {
        number: 6,
        title: 'Comida de verdade',
        text: 'O foco principal deve ser uma alimentação equilibrada e variada no dia a dia, não em fórmulas milagrosas.',
      },
    ],
  },
  {
    pageNumber: 3,
    order: 3,
    badgeNumber: 29,
    title: 'Lanche Pré-Treino',
    subtitle: 'Leve, conhecido e no tempo certo',
    lead: 'Antes do treino ou de uma competição, a criança deve comer algo simples que dê energia, sem pesar no estômago.',
    summary:
      'Lanche leve e familiar ajuda a criança a entrar no treino pronta, concentrada e tranquila.',
    dadTip:
      'Perto do campeonato ou de dias intensos, teste o lanche nos dias normais de treino antes do dia da competição. Nunca invente novidades no dia da luta!',
    bullets: [
      {
        number: 1,
        title: 'Objetivo',
        text: 'Chegar com energia e sem desconforto. O lanche pré-treino deve dar energia para o seu filho treinar bem, sem pesar no estômago.',
      },
      {
        number: 2,
        title: 'Boas ideias',
        text: 'Banana, iogurte, pão com queijo, frutas, aveia ou sanduíche simples. Alimentos leves, conhecidos e fáceis de digerir são ótimas opções.',
      },
      {
        number: 3,
        title: 'Quando comer',
        text: 'Com alguma antecedência e sem correria. Prefira oferecer o lanche de 30 minutos a 2 horas antes do treino ou da competição.',
      },
      {
        number: 4,
        title: 'Evite',
        text: 'Frituras, exageros e comidas muito pesadas. Esses alimentos podem causar mal-estar, sono e atrapalhar o desempenho no tatame.',
      },
      {
        number: 5,
        title: 'Comida conhecida',
        text: 'Perto de desafios importantes, não invente moda. Ofereça alimentos que a criança já está acostumada a comer, para evitar surpresas.',
      },
      {
        number: 6,
        title: 'Junto com água',
        text: 'Lanche e hidratação caminham juntos. Ofereça o lanche junto com água e mantenha a hidratação antes, durante e depois do treino.',
      },
    ],
  },
  {
    pageNumber: 4,
    order: 4,
    badgeNumber: 30,
    title: 'Estimulantes?',
    subtitle: 'Para crianças, o melhor é evitar',
    lead: 'Crianças não precisam de cafeína, energéticos ou pré-treinos para treinar bem. Um corpo saudável, bem alimentado e descansado tem toda a energia que precisa para evoluir no tatame!',
    summary:
      'No jiu-jitsu kids, saúde primeiro e atalhos nunca. Água, comida boa e sono de qualidade geram mais evolução!',
    dadTip:
      'Ensine que desempenho infantil vem de treino, descanso e alimentação natural, não de estimulantes ou cápsulas.',
    bullets: [
      {
        number: 1,
        title: 'Cafeína',
        text: 'Pode acelerar demais o organismo, atrapalhar o sono e aumentar o nervosismo da criança antes do tatame.',
      },
      {
        number: 2,
        title: 'Energéticos',
        text: 'Não são boa escolha para crianças. Contêm altas doses de cafeína e outras substâncias estimulantes que podem fazer mal à saúde.',
      },
      {
        number: 3,
        title: 'Pré-treino',
        text: 'Suplemento estimulante não deve ser rotina infantil. Pode causar efeitos colaterais e não é necessário para o bom desempenho.',
      },
      {
        number: 4,
        title: 'Sono vale mais',
        text: 'Descansar bem melhora o humor, a concentração, a recuperação muscular e o desempenho muito mais do que buscar atalhos.',
      },
      {
        number: 5,
        title: 'Energia de verdade',
        text: 'Comida de verdade, água e uma rotina organizada fornecem a energia natural que seu filho precisa para treinar, aprender e se desenvolver.',
      },
      {
        number: 6,
        title: 'Orientação profissional',
        text: 'Qualquer suplemento só deve ser usado com indicação adequada de médico, nutricionista ou profissional de saúde qualificado.',
      },
    ],
  },
  {
    pageNumber: 5,
    order: 5,
    badgeNumber: 21,
    title: 'Proteínas',
    subtitle: 'Crescer, reparar e recuperar',
    lead: 'As proteínas ajudam no crescimento, na recuperação muscular e na manutenção do corpo das crianças que treinam, deixando elas mais fortes e saudáveis para evoluir no tatame.',
    summary: 'Proteína boa ajuda o pequeno atleta a crescer forte e se recuperar melhor.',
    dadTip:
      'Inclua uma fonte de proteína em 3 ou 4 refeições do dia, variando as fontes de acordo com a preferência familiar.',
    bullets: [
      {
        number: 1,
        title: 'O que fazem',
        text: 'Ajudam a construir e reparar músculos, pele e outros tecidos do corpo, importantes para o crescimento e para a recuperação após o treino.',
      },
      {
        number: 2,
        title: 'Boas fontes',
        text: 'Ovos, leite, iogurte, queijos, frango, peixe, feijão, lentilha e grão-de-bico são ótimas fontes de proteína.',
      },
      {
        number: 3,
        title: 'No café da manhã',
        text: 'Uma boa opção é leite ou iogurte com pão e ovo, que dá energia, proteína e ajuda a começar o dia com vigor.',
      },
      {
        number: 4,
        title: 'No almoço e jantar',
        text: 'Combine arroz, feijão e uma proteína como frango, carne ou peixe. Essa combinação é completa e muito nutritiva.',
      },
      {
        number: 5,
        title: 'Depois do treino',
        text: 'Consumir uma fonte de proteína junto com um carboidrato ajuda a recuperar melhor os músculos e repor a energia gasta.',
      },
      {
        number: 6,
        title: 'Sem exagero',
        text: 'A criança não precisa comer proteína demais. O mais importante é variar as fontes e manter uma alimentação equilibrada.',
      },
    ],
  },
  {
    pageNumber: 6,
    order: 6,
    badgeNumber: 22,
    title: 'Carboidratos',
    subtitle: 'Energia boa para o tatame',
    lead: 'Os carboidratos são a principal fonte de energia para o seu corpo. Eles ajudam você a treinar, brincar, aprender e manter a concentração dentro e fora do tatame!',
    summary: 'Carboidrato de qualidade vira energia e disposição na luta e no dia a dia.',
    dadTip:
      'Para crianças, NADA de cortar carboidrato! Prefira carboidratos simples e complexos de verdade que a criança já conhece e gosta.',
    bullets: [
      {
        number: 1,
        title: 'Combustível do corpo',
        text: 'Os carboidratos dão energia para você treinar, brincar e pensar. Eles são o combustível que o seu corpo mais usa.',
      },
      {
        number: 2,
        title: 'Melhores escolhas',
        text: 'Arroz, aveia, pão, frutas, batata-doce, mandioca e macarrão são ótimas fontes saudáveis de carboidratos.',
      },
      {
        number: 3,
        title: 'Antes do treino',
        text: 'Uma porção leve de carboidrato antes do treino ajuda você a chegar com energia, mais disposição e foco mental.',
      },
      {
        number: 4,
        title: 'Depois do treino',
        text: 'Repor o carboidrato depois do treino ajuda a recuperar o que foi gasto, devolve energia e prepara você para o próximo desafio.',
      },
      {
        number: 5,
        title: 'Cuidado com excesso de açúcar',
        text: 'Doces, bolos, refrigerantes e guloseimas não substituem os carboidratos de verdade e podem atrapalhar sua saúde e seu rendimento.',
      },
      {
        number: 6,
        title: 'Monte o prato',
        text: 'Combine o carboidrato com proteína, legumes e água. Assim você tem uma refeição completa, mais energia, saúde e melhor desempenho.',
      },
    ],
  },
  {
    pageNumber: 7,
    order: 7,
    badgeNumber: 23,
    title: 'Gorduras Boas',
    subtitle: 'Energia, cérebro e saciedade',
    lead: 'As gorduras boas ajudam o cérebro, os hormônios, a absorção de vitaminas e fornecem energia de forma estável, contribuindo para um melhor desempenho no tatame.',
    summary: 'Gordura boa, na medida certa, ajuda o atleta a ter saúde e constância.',
    dadTip:
      'Para crianças, nada de gorduras em excesso, mas ofereça gorduras boas de forma segura e adequada para a idade da criança.',
    bullets: [
      {
        number: 1,
        title: 'Para que servem',
        text: 'Ajudam o cérebro, os hormônios e a absorção das vitaminas A, D, E e K, além de fornecer energia de forma mais estável.',
      },
      {
        number: 2,
        title: 'Boas fontes',
        text: 'Abacate, azeite de oliva, castanhas (bem moídas ou picadas), sementes, pasta de amendoim e peixes como salmão.',
      },
      {
        number: 3,
        title: 'Pequenas porções',
        text: 'A gordura boa é importante, mas deve ser consumida em quantidade moderada, de acordo com a idade e as necessidades da criança.',
      },
      {
        number: 4,
        title: 'No lanche',
        text: 'Pão com pasta de amendoim ou iogurte com sementes podem ser ótimas opções para incluir gorduras boas no dia a dia.',
      },
      {
        number: 5,
        title: 'Evite excessos',
        text: 'Frituras e ultraprocessados não têm o mesmo valor nutricional e devem ser evitados, pois podem prejudicar a saúde e o rendimento.',
      },
      {
        number: 6,
        title: 'Equilíbrio no prato',
        text: 'A gordura boa completa a refeição, traz mais sabor e saciedade, mas não deve dominar o prato. O ideal é combinar com carboidratos, proteínas e vegetais.',
      },
    ],
  },
  {
    pageNumber: 8,
    order: 8,
    badgeNumber: 24,
    title: 'Hidratação',
    subtitle: 'Água também é parte do treino',
    lead: 'Manter o corpo bem hidratado ajuda na atenção, no movimento e também na regulação da temperatura, deixando a criança mais disposta para aprender e evoluir no tatame.',
    summary: 'Criança hidratada pensa melhor, se move melhor e treina melhor.',
    dadTip: 'Ensine a criança a levar e usar a própria garrafinha todos os dias de treino.',
    bullets: [
      {
        number: 1,
        title: 'Por que importa',
        text: 'A água ajuda no foco, no rendimento e na regulação da temperatura do corpo durante as atividades físicas.',
      },
      {
        number: 2,
        title: 'Antes do treino',
        text: 'Chegar hidratado é melhor do que tentar compensar depois. Ofereça água em casa e incentive a criança a beber antes de sair para o treino.',
      },
      {
        number: 3,
        title: 'Durante',
        text: 'Pequenos goles ao longo do treino são melhores do que beber muito de uma vez. Evite esperar sentir muita sede para beber.',
      },
      {
        number: 4,
        title: 'Depois',
        text: 'Beber água ajuda na recuperação, repõe os líquidos perdidos e prepara o corpo para o próximo treino.',
      },
      {
        number: 5,
        title: 'Sinal de alerta',
        text: 'Sede intensa, cansaço fora do normal, tontura e boca seca merecem atenção. Se aparecerem esses sinais, comunique o professor.',
      },
      {
        number: 6,
        title: 'Olhe a rotina',
        text: 'Deixe a garrafinha sempre por perto (na mochila, na escola e em casa). Ter a própria garrafa facilita o hábito e incentiva a autonomia.',
      },
    ],
  },
  {
    pageNumber: 9,
    order: 9,
    badgeNumber: 25,
    title: 'Eletrólitos',
    subtitle: 'Reposição inteligente no calor',
    lead: 'Sódio, potássio, cálcio e magnésio participam da hidratação, da contração muscular e do bom funcionamento dos nervos.',
    summary: 'Eletrólitos vêm, na maioria das vezes, de uma rotina simples e bem feita.',
    dadTip:
      'Priorize água, frutas e refeições completas antes de pensar em bebidas esportivas industrializadas para crianças.',
    bullets: [
      {
        number: 1,
        title: 'O que são',
        text: 'São minerais como sódio, potássio, cálcio e magnésio, que o corpo precisa para funcionar bem.',
      },
      {
        number: 2,
        title: 'Para que servem',
        text: 'Ajudam na hidratação, na contração muscular e no bom funcionamento dos nervos durante os movimentos.',
      },
      {
        number: 3,
        title: 'Onde encontrar',
        text: 'Estão na água de coco, no leite, nas frutas, no feijão, nas verduras e em outros alimentos de comida de verdade.',
      },
      {
        number: 4,
        title: 'Suor e calor',
        text: 'Em dias quentes ou em treinos longos, perdemos eletrólitos pelo suor. Nesses momentos, a atenção à reposição deve ser maior.',
      },
      {
        number: 5,
        title: 'Nem sempre isotônico',
        text: 'Para a maioria das crianças, água e uma alimentação equilibrada já resolvem. Bebidas isotônicas nem sempre são necessárias.',
      },
      {
        number: 6,
        title: 'Procure orientação',
        text: 'Em casos especiais, como treinos muito intensos, calor extremo ou condições de saúde específicas, a equipe de saúde pode orientar.',
      },
    ],
  },
  {
    pageNumber: 10,
    order: 10,
    badgeNumber: 26,
    title: 'Vitaminas',
    subtitle: 'Pequenos nutrientes, grande diferença',
    lead: 'As vitaminas ajudam a fortalecer a imunidade, mantêm a visão saudável, contribuem para ossos mais fortes e auxiliam no uso da energia dos alimentos pelo corpo.',
    summary: 'Prato colorido costuma trazer vitaminas e saúde para o pequeno atleta.',
    dadTip:
      'Varie as cores da fruta e da salada ao longo da semana para abranger todo o espectro vitamínico.',
    bullets: [
      {
        number: 1,
        title: 'Vitamina A',
        text: 'Contribui para a visão, a pele e ajuda na defesa do corpo, fortalecendo o sistema imunológico.',
      },
      {
        number: 2,
        title: 'Vitamina C',
        text: 'Ajuda a fortalecer a imunidade e facilita a absorção do ferro, importante para o transporte de oxigênio no corpo.',
      },
      {
        number: 3,
        title: 'Vitamina D',
        text: 'Importante para ossos fortes, ajuda na imunidade e no bom funcionamento do corpo. A exposição solar consciente e uma rotina adequada são essenciais.',
      },
      {
        number: 4,
        title: 'Complexo B',
        text: 'Participa do uso da energia dos alimentos, ajudando a transformar o que você come em energia para o dia a dia, os treinos e as competições.',
      },
      {
        number: 5,
        title: 'Comida colorida',
        text: 'Quanto mais cores naturais no prato, melhor a variedade de vitaminas e outros nutrientes para o seu corpo crescer sadio.',
      },
      {
        number: 6,
        title: 'Suplemento não é regra',
        text: 'O ideal é começar pelas alimentações do dia a dia. Suplementos só devem ser usados com orientação de um profissional de saúde qualificado.',
      },
    ],
  },
]
