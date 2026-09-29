import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const inputImagePath = path.join(rootDir, 'src/assets/alexis-jj-bbe32.jpeg')
const publicDir = path.join(rootDir, 'public')

async function main() {
  console.log('Verificando imagem de entrada:', inputImagePath)
  if (!fs.existsSync(inputImagePath)) {
    throw new Error(`Imagem não encontrada: ${inputImagePath}`)
  }

  // Tenta carregar sharp
  let sharp
  try {
    const mod = await import('sharp')
    sharp = mod.default || mod
  } catch (err) {
    console.error('Sharp não instalado diretamente:', err.message)
    throw err
  }

  const meta = await sharp(inputImagePath).metadata()
  console.log(`Dimensões originais: ${meta.width}x${meta.height}`)

  // O rosto fica no terço superior:
  // "recorte quadrado centrado entre ~10% e ~55% da altura para o rosto ficar bem no ícone pequeno"
  // Imagem original é ~968 x 1576 (proporção ~1:1.63).
  // Se cortarmos um quadrado da largura total (width x width), pegando de top: ~10% a 15% da altura:
  const width = meta.width
  // Top entre 10% e 15% da altura
  // 1576 * 0.10 ~= 157px, width é 968. 157 + 968 = 1125 <= 1576.
  // 1125 / 1576 = ~71% da altura total.
  // Se top for ~100px a 160px, o rosto do Álexis (olhos, sorriso, kimono superior) fica perfeitamente centrado!
  const top = Math.round(meta.height * 0.1)
  const extractSize = Math.min(width, meta.height - top)

  console.log(
    `Extraindo quadrado de tamanho ${extractSize}x${extractSize} a partir de top=${top}, left=0`,
  )

  // Base quadrada recortada com o rosto
  const croppedBuffer = await sharp(inputImagePath)
    .extract({ left: 0, top, width: extractSize, height: extractSize })
    .toBuffer()

  // 1. pwa-192.png (192x192)
  console.log('Gerando pwa-192.png...')
  await sharp(croppedBuffer)
    .resize(192, 192, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'pwa-192.png'))

  // 2. pwa-512.png (512x512)
  console.log('Gerando pwa-512.png...')
  await sharp(croppedBuffer)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'pwa-512.png'))

  // 3. pwa-512-maskable.png (512x512 com margem de segurança ~20% na safe zone)
  // Safe zone para maskable icons é o círculo central de diâmetro 80% (ou seja, 512 * 0.8 = ~410px).
  // A cor de fundo de segurança ao redor deve ser #1e3a5f (navy do kimono/identidade) ou a cor de fundo do tatame/gibi.
  // Colocamos a foto redimensionada para ~410x410 centralizada num canvas 512x512 com background #1e3a5f.
  console.log('Gerando pwa-512-maskable.png...')
  const innerSize = Math.round(512 * 0.78) // ~400px
  const innerBuffer = await sharp(croppedBuffer)
    .resize(innerSize, innerSize, { fit: 'cover' })
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 30, g: 58, b: 95, alpha: 1 }, // --navy: #1e3a5f
    },
  })
    .composite([
      {
        input: innerBuffer,
        gravity: 'center',
      },
    ])
    .png()
    .toFile(path.join(publicDir, 'pwa-512-maskable.png'))

  // 4. apple-touch-icon.png (180x180)
  console.log('Gerando apple-touch-icon.png...')
  await sharp(croppedBuffer)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))

  // 5. favicon-32.png (32x32)
  console.log('Gerando favicon-32.png...')
  const fav32Buffer = await sharp(croppedBuffer).resize(32, 32, { fit: 'cover' }).png().toBuffer()
  fs.writeFileSync(path.join(publicDir, 'favicon-32.png'), fav32Buffer)

  // 6. favicon-16.png (16x16)
  console.log('Gerando favicon-16.png...')
  await sharp(croppedBuffer)
    .resize(16, 16, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'favicon-16.png'))

  // 7. favicon.ico (substituir usando PNG 32x32 com header .ico ou PNG direto suportado por browsers modernos)
  // Criar um arquivo .ico válido com 1 imagem PNG de 32x32:
  // Estrutura ICO padrão:
  // ICONDIR (6 bytes): 0,0 (reserved 2 bytes), 1,0 (type 1 for ico 2 bytes), 1,0 (count 1 image 2 bytes)
  // ICONDIRENTRY (16 bytes):
  // bWidth (1 byte): 32
  // bHeight (1 byte): 32
  // bColorCount (1 byte): 0
  // bReserved (1 byte): 0
  // wPlanes (2 bytes): 1, 0
  // wBitCount (2 bytes): 32, 0
  // dwBytesInRes (4 bytes): png length
  // dwImageOffset (4 bytes): 6 + 16 = 22
  // [PNG bytes]
  console.log('Gerando favicon.ico válido...')
  const icoHeader = Buffer.alloc(22)
  icoHeader.writeUInt16LE(0, 0) // reserved
  icoHeader.writeUInt16LE(1, 2) // type 1 = icon
  icoHeader.writeUInt16LE(1, 4) // 1 image
  // entry:
  icoHeader.writeUInt8(32, 6) // width 32
  icoHeader.writeUInt8(32, 7) // height 32
  icoHeader.writeUInt8(0, 8) // color count
  icoHeader.writeUInt8(0, 9) // reserved
  icoHeader.writeUInt16LE(1, 10) // planes
  icoHeader.writeUInt16LE(32, 12) // bit count
  icoHeader.writeUInt32LE(fav32Buffer.length, 14) // size
  icoHeader.writeUInt32LE(22, 18) // offset

  const icoBuffer = Buffer.concat([icoHeader, fav32Buffer])
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer)

  console.log('Todos os ícones gerados com sucesso!')
}

main().catch((err) => {
  console.error('Erro na geração:', err)
  process.exit(1)
})
