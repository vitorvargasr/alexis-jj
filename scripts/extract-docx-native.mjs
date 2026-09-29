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

console.log('Reading docx:', docxPath)
const buffer = fs.readFileSync(docxPath)
console.log('Docx size:', buffer.length)

// Parse ZIP format
// Local file header signature = 0x04034b50
let offset = 0
const files = []

while (offset < buffer.length - 30) {
  const sig = buffer.readUInt32LE(offset)
  if (sig === 0x04034b50) {
    const minVersion = buffer.readUInt16LE(offset + 4)
    const gpFlag = buffer.readUInt16LE(offset + 6)
    const compression = buffer.readUInt16LE(offset + 8)
    const modTime = buffer.readUInt16LE(offset + 10)
    const modDate = buffer.readUInt16LE(offset + 12)
    const crc32 = buffer.readUInt32LE(offset + 14)
    const compressedSize = buffer.readUInt32LE(offset + 18)
    const uncompressedSize = buffer.readUInt32LE(offset + 22)
    const fileNameLen = buffer.readUInt16LE(offset + 26)
    const extraLen = buffer.readUInt16LE(offset + 28)

    const fileName = buffer.toString('utf8', offset + 30, offset + 30 + fileNameLen)
    const dataStart = offset + 30 + fileNameLen + extraLen
    const dataEnd = dataStart + compressedSize

    files.push({
      fileName,
      compression,
      compressedSize,
      uncompressedSize,
      dataStart,
      dataEnd,
      crc32,
    })

    offset = dataEnd
  } else if (sig === 0x02014b50 || sig === 0x06054b50) {
    // Central directory structure or end of central dir
    break
  } else {
    offset++
  }
}

console.log(`Found ${files.length} files in docx archive:`)
const mediaFiles = files.filter((f) => f.fileName.startsWith('word/media/'))
console.log(`Found ${mediaFiles.length} media files!`)

let imageIndex = 1
const extractedMeta = []

for (const mf of mediaFiles) {
  const compressedData = buffer.subarray(mf.dataStart, mf.dataEnd)
  let uncompressedData
  if (mf.compression === 0) {
    uncompressedData = compressedData
  } else if (mf.compression === 8) {
    uncompressedData = zlib.inflateRawSync(compressedData)
  } else {
    console.error('Unknown compression:', mf.compression)
    continue
  }

  const ext = path.extname(mf.fileName) || '.png'
  const outFileName = `desenho-${imageIndex}${ext}`
  const outPath = path.join(outDir, outFileName)
  fs.writeFileSync(outPath, uncompressedData)
  console.log(`Saved: ${outPath} (${uncompressedData.length} bytes)`)

  extractedMeta.push({
    index: imageIndex,
    originalName: path.basename(mf.fileName),
    fileName: outFileName,
    path: `/desenhos-colorir/${outFileName}`,
    size: uncompressedData.length,
  })

  imageIndex++
}

fs.writeFileSync(path.join(outDir, 'manifest.json'), JSON.stringify(extractedMeta, null, 2))
console.log('Done extracting docx media!')
