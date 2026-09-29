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
  console.log(`[Coloring] Processed ${coloringList.length} coloring pages`)
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
  console.log(`[Lesão Zero] Processed ${lesaoList.length} cards`)
}
