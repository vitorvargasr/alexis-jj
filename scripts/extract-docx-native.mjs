import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import zlib from 'node:zlib'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const docxPath = path.join(rootDir, 'src/assets/desenhos-para-colorir-9a71e.docx')
const outDir = path.join(rootDir, 'public/desenhos-colorir')

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

if (!fs.existsSync(docxPath)) {
  console.error('DOCX not found at:', docxPath)
  process.exit(1)
}

const buffer = fs.readFileSync(docxPath)
console.log(`Reading DOCX (${buffer.length} bytes)...`)

// Local file header signature: 0x04034b50
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

console.log(`Found ${mediaFiles.length} media files in docx archive:`)
// Sort media files naturally by name (e.g. image1.png, image2.png ... image10.png)
mediaFiles.sort((a, b) => {
  const numA = parseInt(a.fileName.replace(/\D/g, ''), 10) || 0
  const numB = parseInt(b.fileName.replace(/\D/g, ''), 10) || 0
  return numA - numB
})

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
for (const mf of mediaFiles) {
  const compressedData = buffer.subarray(mf.dataStart, mf.dataEnd)
  let uncompressedData
  if (mf.compression === 0) {
    uncompressedData = compressedData
  } else if (mf.compression === 8) {
    uncompressedData = zlib.inflateRawSync(compressedData)
  } else {
    console.warn(`Unsupported compression ${mf.compression} for ${mf.fileName}`)
    continue
  }

  const paddedNum = String(idx).padStart(2, '0')
  const ext = path.extname(mf.fileName).toLowerCase() || '.png'
  const outFileName = `colorir-${paddedNum}${ext}`
  const outFilePath = path.join(outDir, outFileName)

  fs.writeFileSync(outFilePath, uncompressedData)
  console.log(`[${idx}] Wrote ${outFileName} (${uncompressedData.length} bytes)`)

  const title = titles[idx - 1] || `Desenho ${idx}`
  coloringList.push({
    id: `colorir-${paddedNum}`,
    order: idx,
    title,
    description: `Desenho oficial para imprimir e colorir: ${title}`,
    fileName: outFileName,
    downloadName: `desenho-colorir-${paddedNum}-alexis-jiu-jitsu${ext}`,
    url: `/desenhos-colorir/${outFileName}`,
    size: uncompressedData.length,
  })

  idx++
}

const manifestPath = path.join(outDir, 'desenhos.json')
fs.writeFileSync(manifestPath, JSON.stringify(coloringList, null, 2))
console.log(`Saved manifest with ${coloringList.length} coloring pages to ${manifestPath}`)
