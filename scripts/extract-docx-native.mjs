import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import zlib from 'node:zlib'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

function extractMediaFromDocx(docxPath) {
  if (!fs.existsSync(docxPath)) return []
  const buffer = fs.readFileSync(docxPath)
  let offset = 0
  const mediaFiles = []

  while (offset < buffer.length - 30) {
    const sig = buffer.readUInt32LE(offset)
    if (sig === 0x04034b50) {
      const compression = buffer.readUInt16LE(offset + 8)
      const compressedSize = buffer.readUInt32LE(offset + 18)
      const uncompressedSize = buffer.readUInt32LE(offset + 22)
      const fileNameLen = buffer.readUInt16LE(offset + 26)
      const extraLen = buffer.readUInt16LE(offset + 28)

      const fileName = buffer.toString('utf8', offset + 30, offset + 30 + fileNameLen)
      const dataStart = offset + 30 + fileNameLen + extraLen
      const dataEnd = dataStart + compressedSize

      if (fileName.startsWith('word/media/')) {
        mediaFiles.push({
          fileName,
          compression,
          compressedSize,
          uncompressedSize,
          dataStart,
          dataEnd,
        })
      }

      offset = dataEnd
    } else if (sig === 0x02014b50 || sig === 0x06054b50) {
      break
    } else {
      offset++
    }
  }

  mediaFiles.sort((a, b) => {
    const numA = parseInt(a.fileName.replace(/\D/g, ''), 10) || 0
    const numB = parseInt(b.fileName.replace(/\D/g, ''), 10) || 0
    return numA - numB
  })

  const results = []
  for (const mf of mediaFiles) {
    const compressedData = buffer.subarray(mf.dataStart, mf.dataEnd)
    let uncompressedData
    if (mf.compression === 0) {
      uncompressedData = compressedData
    } else if (mf.compression === 8) {
      uncompressedData = zlib.inflateRawSync(compressedData)
    } else {
      continue
    }
    results.push({
      originalFileName: mf.fileName,
      data: uncompressedData,
    })
  }
  return results
}

// 1. Processar Desenhos para Colorir
const coloringDocx = path.join(rootDir, 'src/assets/desenhos-para-colorir-9a71e.docx')
const coloringOutDir = path.join(rootDir, 'public/desenhos-colorir')
if (!fs.existsSync(coloringOutDir)) {
  fs.mkdirSync(coloringOutDir, { recursive: true })
}

if (fs.existsSync(coloringDocx)) {
  const coloringMedia = extractMediaFromDocx(coloringDocx)
  const titles = [
    'Cumprimento do Tatame (Oss!)',
    'Postura e Base Forte',
    'Passagem de Guarda Ágil',
    'Controle dos 100 Quilos',
    'Montada Firme do Pequeno Campeão',
    'Pegada de Costas com Mochila',
    'Defesa e Raspagem Ninja',
    'Álexis e Léo Treinando Juntos',
    'Papai Vítor Ensinando a Posição',
    'A Conquista da Faixa e o Troféu',
  ]
  const coloringList = []
  let idx = 1
  for (const item of coloringMedia) {
    const paddedNum = String(idx).padStart(2, '0')
    const ext = path.extname(item.originalFileName).toLowerCase() || '.png'
    const outFileName = `colorir-${paddedNum}${ext}`
    const outFilePath = path.join(coloringOutDir, outFileName)
    fs.writeFileSync(outFilePath, item.data)
    const title = titles[idx - 1] || `Desenho ${idx}`
    coloringList.push({
      id: `colorir-${paddedNum}`,
      order: idx,
      title,
      description: `Desenho oficial para imprimir e colorir: ${title}`,
      fileName: outFileName,
      downloadName: `desenho-colorir-${paddedNum}-alexis-jiu-jitsu${ext}`,
      url: `/desenhos-colorir/${outFileName}`,
      size: item.data.length,
    })
    idx++
  }
  fs.writeFileSync(
    path.join(coloringOutDir, 'desenhos.json'),
    JSON.stringify(coloringList, null, 2),
  )
}

// 2. Processar Lesão Zero e Fortalecimento
const lesaoDocx = path.join(rootDir, 'src/assets/lesao-zero-e-fortalecimento-629a5.docx')
const lesaoOutDir = path.join(rootDir, 'public/lesao-zero')
if (!fs.existsSync(lesaoOutDir)) {
  fs.mkdirSync(lesaoOutDir, { recursive: true })
}

if (fs.existsSync(lesaoDocx)) {
  const lesaoMedia = extractMediaFromDocx(lesaoDocx)
  const titlesLesao = [
    'Capa: Prevenção de Lesões & Fortalecimento Seguro',
    'Mobilidade Articular e Aquecimento Específico',
    'Fortalecimento do Pescoço e Cervical Protegida',
    'Estabilidade do Core e Quadril Blindado',
    'Joelhos e Tornozelos: Base Firme e Flexível',
    'Ombros Fortes: Prevenção de Traumas e Estabilidade',
    'Pegada Segura e Descanso dos Dedos/Punhos',
    'Regras de Ouro: Tap Cedo, Treino sem Ego e Respeito',
    'Rotina de Recuperação, Sono e Hidratação',
  ]
  const descriptionsLesao = [
    'Guia ilustrado de prevenção de lesões, postura e fortalecimento infantil para praticantes de Jiu-Jitsu.',
    'Como preparar as articulações antes de entrar no tatame sem sobrecarregar tendões.',
    'Exercícios específicos e seguros para manter o pescoço e a coluna fortes e protegidos.',
    'Exercícios de centro de corpo para aguentar pressão e manter o equilíbrio nas lutas.',
    'Fortalecimento de membros inferiores para transições de guarda e passos firmes sem torção.',
    'Mobilidade escapular e fortalecimento dos manguitos para apoios de solo seguros.',
    'Cuidado na hora de fazer a pegada no quimono sem machucar articulações pequenas.',
    'Bater com antecedência e manter o tatame seguro é o verdadeiro espírito marcial.',
    'Como o descanso, a alimentação equilibrada e o sono restaurador constroem pequenos campeões.',
  ]
  const lesaoList = []
  let idx = 1
  for (const item of lesaoMedia) {
    const paddedNum = String(idx).padStart(2, '0')
    const ext = path.extname(item.originalFileName).toLowerCase() || '.png'
    const outFileName = `lesao-zero-${paddedNum}${ext}`
    const outFilePath = path.join(lesaoOutDir, outFileName)
    fs.writeFileSync(outFilePath, item.data)
    const title = titlesLesao[idx - 1] || `Exercício & Dica #${idx}`
    const description =
      descriptionsLesao[idx - 1] || `Prancha informativa e exercícios ilustrados #${idx}`
    lesaoList.push({
      id: `lesao-zero-${paddedNum}`,
      order: idx,
      title,
      description,
      fileName: outFileName,
      downloadName: `lesao-zero-${paddedNum}-alexis-jiu-jitsu${ext}`,
      url: `/lesao-zero/${outFileName}`,
      size: item.data.length,
    })
    idx++
  }
  fs.writeFileSync(path.join(lesaoOutDir, 'lesao-zero.json'), JSON.stringify(lesaoList, null, 2))
}

// 3. Processar Preparação para o Campeonato (PDF das 20 páginas ilustradas)
const championshipPdf = path.join(rootDir, 'src/assets/preparacao-para-o-campeonato-0cbdf.pdf')
const championshipOutDir = path.join(rootDir, 'public/campeonato')
if (!fs.existsSync(championshipOutDir)) {
  fs.mkdirSync(championshipOutDir, { recursive: true })
}

if (fs.existsSync(championshipPdf)) {
  const buf = fs.readFileSync(championshipPdf)
  const str = buf.toString('latin1')
  const streamStarts = []
  let spos = 0
  while (true) {
    const idx = str.indexOf('stream', spos)
    if (idx === -1) break
    streamStarts.push(idx)
    spos = idx + 6
  }

  const images = []
  for (let i = 0; i < streamStarts.length; i++) {
    const s = streamStarts[i]
    const header = str.slice(Math.max(0, s - 300), s)
    if (header.includes('/Subtype/Image') || header.includes('/Subtype /Image')) {
      const isJpeg = header.includes('/DCTDecode')
      const widthMatch = header.match(/\/Width\s+(\d+)/)
      const heightMatch = header.match(/\/Height\s+(\d+)/)
      const lengthMatch = header.match(/\/Length\s+(\d+)/)
      images.push({
        pos: s,
        isJpeg,
        width: widthMatch ? widthMatch[1] : '?',
        height: heightMatch ? heightMatch[1] : '?',
        length: lengthMatch ? lengthMatch[1] : '0',
      })
    }
  }

  const pranchasInfo = [
    {
      num: 1,
      title: 'Manual do Campeonato de Jiu-Jitsu Kids',
      subtitle: 'Guia ilustrado para crianças e pais',
      category: 'Capa & Apresentação',
      badge: 'Manual Oficial',
      filename: 'campeonato-01.jpg',
      downloadName: 'campeonato-01-manual-alexis-jiu-jitsu.jpg',
    },
    {
      num: 2,
      title: 'Entendendo o Campeonato',
      subtitle: 'Aprender, competir e se divertir',
      category: 'Valores & Estrutura',
      badge: 'Etapas',
      filename: 'campeonato-02.jpg',
      downloadName: 'campeonato-02-entendendo-o-campeonato-alexis.jpg',
    },
    {
      num: 3,
      title: 'Checklist do Campeonato',
      subtitle: 'Tudo pronto para competir com tranquilidade',
      category: 'Organização',
      badge: 'Mochila Pronta',
      filename: 'campeonato-03.jpg',
      downloadName: 'campeonato-03-checklist-alexis-jiu-jitsu.jpg',
    },
    {
      num: 4,
      title: 'Antes da Luta',
      subtitle: 'Como funciona a entrada no campeonato',
      category: 'Chegada & Pesagem',
      badge: 'Concentração',
      filename: 'campeonato-04.jpg',
      downloadName: 'campeonato-04-antes-da-luta-alexis.jpg',
    },
    {
      num: 5,
      title: 'Como se Comportar na Luta',
      subtitle: 'Respeito e atenção em primeiro lugar',
      category: 'Regras & Postura',
      badge: 'Atitude de Campeão',
      filename: 'campeonato-05.jpg',
      downloadName: 'campeonato-05-como-se-comportar-alexis.jpg',
    },
    {
      num: 6,
      title: 'Como Marcar Pontos',
      subtitle: 'Entenda de forma simples',
      category: 'Pontuação & Arbitragem',
      badge: 'Queda, Raspagem, Guarda & Montada',
      filename: 'campeonato-06.jpg',
      downloadName: 'campeonato-06-como-marcar-pontos-alexis.jpg',
    },
    {
      num: 7,
      title: 'Competir com Cuidado',
      subtitle: 'Saúde e proteção sempre',
      category: 'Segurança & Saúde',
      badge: 'Cuidado & Proteção',
      filename: 'campeonato-07.jpg',
      downloadName: 'campeonato-07-competir-com-cuidado-alexis.jpg',
    },
    {
      num: 8,
      title: 'Cabeça Forte no Campeonato',
      subtitle: 'Ganhar e aprender fazem parte',
      category: 'Mente Forte & Emoções',
      badge: 'Inteligência Emocional',
      filename: 'campeonato-08.jpg',
      downloadName: 'campeonato-08-cabeca-forte-alexis.jpg',
    },
    {
      num: 9,
      title: 'Guia para os Pais: Como Apoiar seu Filho',
      subtitle: 'Presença, calma e incentivo fazem diferença',
      category: 'Guia da Família',
      badge: 'Apoio dos Pais',
      filename: 'campeonato-09.jpg',
      downloadName: 'campeonato-09-apoio-dos-pais-alexis.jpg',
    },
    {
      num: 10,
      title: 'Passo a Passo do Grande Dia',
      subtitle: 'Do início ao fim com confiança',
      category: 'Dia da Luta',
      badge: 'Roteiro Completo',
      filename: 'campeonato-10.jpg',
      downloadName: 'campeonato-10-passo-a-passo-alexis.jpg',
    },
    {
      num: 11,
      title: '30 Dias Antes: Preparação para o Campeonato',
      subtitle: 'Organização, rotina e metas claras',
      category: 'Planejamento 30 Dias',
      badge: 'Cronograma',
      filename: 'campeonato-11.jpg',
      downloadName: 'campeonato-11-30-dias-antes-alexis.jpg',
    },
    {
      num: 12,
      title: 'A Última Semana: Revisão, Descanso e Ajustes',
      subtitle: 'Chegar leve e preparado é melhor do que cansado',
      category: 'Semana Final',
      badge: '7 Dias Finais',
      filename: 'campeonato-12.jpg',
      downloadName: 'campeonato-12-a-ultima-semana-alexis.jpg',
    },
    {
      num: 13,
      title: 'Peso, Alimentação e Hidratação',
      subtitle: 'Energia boa e controle saudável',
      category: 'Nutrição & Peso',
      badge: 'Peso Saudável',
      filename: 'campeonato-13.jpg',
      downloadName: 'campeonato-13-peso-alimentacao-alexis.jpg',
    },
    {
      num: 14,
      title: 'Treino Técnico Inteligente',
      subtitle: 'Repetição com qualidade',
      category: 'Técnica & Estratégia',
      badge: 'Base, Pegada & Queda',
      filename: 'campeonato-14.jpg',
      downloadName: 'campeonato-14-treino-tecnico-alexis.jpg',
    },
    {
      num: 15,
      title: 'Preparação Física para Kids',
      subtitle: 'Coordenação, mobilidade e prevenção',
      category: 'Físico & Mobilidade',
      badge: 'Corpo Preparado',
      filename: 'campeonato-15.jpg',
      downloadName: 'campeonato-15-preparacao-fisica-alexis.jpg',
    },
    {
      num: 16,
      title: 'Regras, Pontos e Faltas',
      subtitle: 'Entender as regras ajuda a lutar melhor',
      category: 'Regras Oficiais',
      badge: 'Pontos & Penalidades',
      filename: 'campeonato-16.jpg',
      downloadName: 'campeonato-16-regras-pontos-faltas-alexis.jpg',
    },
    {
      num: 17,
      title: 'Aquecimento Pré-Luta',
      subtitle: 'Ativar o corpo e focar a mente',
      category: 'Aquecimento Específico',
      badge: 'Sequência 15 min',
      filename: 'campeonato-17.jpg',
      downloadName: 'campeonato-17-aquecimento-pre-luta-alexis.jpg',
    },
    {
      num: 18,
      title: 'Estratégia de Luta',
      subtitle: 'Pensar a luta ajuda a competir melhor',
      category: 'Tática & Planos',
      badge: 'Plano A, B e C',
      filename: 'campeonato-18.jpg',
      downloadName: 'campeonato-18-estrategia-de-luta-alexis.jpg',
    },
    {
      num: 19,
      title: 'Cabeça Forte e Recuperação',
      subtitle: 'Controle emocional e energia para continuar',
      category: 'Pós-Luta & Mente',
      badge: 'Entre Lutas',
      filename: 'campeonato-19.jpg',
      downloadName: 'campeonato-19-recuperacao-alexis.jpg',
    },
    {
      num: 20,
      title: 'Guia Técnico para os Pais',
      subtitle: 'Apoio certo antes, durante e depois',
      category: 'Guia Técnico Pais',
      badge: 'Comunicação Familiar',
      filename: 'campeonato-20.jpg',
      downloadName: 'campeonato-20-guia-tecnico-pais-alexis.jpg',
    },
  ]

  const manifest = []
  for (let i = 0; i < images.length; i++) {
    const im = images[i]
    let sStart = im.pos + 6
    if (buf[sStart] === 0x0d && buf[sStart + 1] === 0x0a) sStart += 2
    else if (buf[sStart] === 0x0a || buf[sStart] === 0x0d) sStart += 1

    let jpegStart = sStart
    while (jpegStart < sStart + 50 && !(buf[jpegStart] === 0xff && buf[jpegStart + 1] === 0xd8)) {
      jpegStart++
    }
    if (!(buf[jpegStart] === 0xff && buf[jpegStart + 1] === 0xd8)) {
      jpegStart = sStart
    }

    const endstreamIdx = str.indexOf('endstream', jpegStart)
    let sEnd = endstreamIdx !== -1 ? endstreamIdx : jpegStart + parseInt(im.length, 10)
    while (
      sEnd > jpegStart &&
      (buf[sEnd - 1] === 0x0a || buf[sEnd - 1] === 0x0d || buf[sEnd - 1] === 0x20)
    ) {
      sEnd--
    }
    const imgData = buf.subarray(jpegStart, sEnd)
    const info = pranchasInfo[i] || {
      num: i + 1,
      title: `Prancha #${i + 1}`,
      subtitle: 'Preparação para o Campeonato',
      category: 'Preparação',
      badge: 'Oficial',
      filename: `campeonato-${String(i + 1).padStart(2, '0')}.jpg`,
      downloadName: `campeonato-${String(i + 1).padStart(2, '0')}-alexis.jpg`,
    }

    const outPath = path.join(championshipOutDir, info.filename)
    fs.writeFileSync(outPath, imgData)
    manifest.push({
      id: `campeonato-${String(info.num).padStart(2, '0')}`,
      pageNumber: info.num,
      order: info.num,
      title: info.title,
      subtitle: info.subtitle,
      category: info.category,
      badge: info.badge,
      url: `/campeonato/${info.filename}`,
      downloadName: info.downloadName,
      size: imgData.length,
    })
  }

  fs.writeFileSync(
    path.join(championshipOutDir, 'campeonato.json'),
    JSON.stringify(manifest, null, 2),
  )
}
