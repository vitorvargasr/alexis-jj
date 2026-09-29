import pdfUrl from '@/assets/do-4-ao-72-76a69.pdf'

// Mapeamento de cada título de quadro para a sua página exata no PDF (1 a 69)
export const posterPageMap: Record<string, number> = {
  // EDIÇÃO 2
  'Guarda Fechada: Reconhecer e Organizar': 6,
  'Postura na Guarda Fechada': 7,
  'Abertura de Guarda em Pé': 8,
  'Abertura de Joelhos com Calma': 9,
  'Depois de Abrir: Afastar e Controlar': 10,
  'Guarda Aberta: Pés e Joelhos Vivos': 11,
  'Guarda Borboleta: Base e Ganchos': 12,
  'Meia-Guarda: Reconhecer a Perna Presa': 13,
  'Escudo de Joelho na Meia-Guarda': 14,
  'Reposição de Guarda com Movimento de Quadril': 15,

  // EDIÇÃO 3
  'Raspagem Tesoura: Ângulo e Corte': 16,
  'Raspagem de Quadril: Sentar e Elevar': 17,
  'Raspagem Pêndulo: Balanço Inteligente': 18,
  'Raspagem Contra Quem Levanta': 19,
  'Raspagem Borboleta com um Gancho': 20,
  'Borboleta: Mudar de Lado com Agilidade': 21,
  'Meia-Guarda com Underhook (Esgrima)': 22,
  'Meia-Guarda com Gancho Borboleta': 23,
  'Guarda Sentada: Levantar e Raspar': 24,
  'Tesoura ou Quadril? A Leitura do Tatame': 25,

  // EDIÇÃO 4
  'Passagem Toreando: Controlar e Contornar': 2,
  'Passagem Toreando: Estabilização Lateral': 3,
  'Passagem da Meia-Guarda com Pressão Suave': 5,
  'Passagem da Meia com Escudo de Joelho': 44,
  'Passagem por Cima da Perna com Controle': 52,
  'Transição dos Cem-Quilos para a Montada': 58,
  'Passagem da Guarda Borboleta': 61,
  'Passagem com Corte de Joelho (Knee Cut)': 67,

  // EDIÇÃO 5
  'Sair das Costas: Proteger o Pescoço e Tirar os Ganchos': 38,
  'Sair do Norte-Sul: Virar o Quadril e Enquadrar': 39,
  'Escape de Cotovelo da Montada (Elbow Escape)': 45,
  'Virar para os Joelhos no Cem-Quilos': 50,
  'Cem-Quilos por Baixo: Moldura e Recuperar Espaço': 51,
  'Sair da Posição de Tartaruga com Segurança': 54,
  'Saída do Joelho na Barriga: Aliviar e Camarão': 55,
  'Recuperar a Guarda Fechada com Antebraços': 57,

  // EDIÇÃO 6
  'Drill 7: Troca de Base nos Joelhos': 4,
  'Drill 11: Passo do Gorila no Tapete': 26,
  'Drill 16: Hip Heist (Troca de Quadril)': 27,
  'Drill 12: Sit-Through com Agilidade': 28,
  'Drill 17: Caminhada do Urso Forte': 29,
  'Drill 13: Inversão Granby no Ombro': 30,
  'Drill 18: Sprawl com Giro em Círculo': 31,
  'Drill 14: Rolê da Tartaruga Protegida': 32,
  'Drill 19: Entrada Solo de Queda com Base': 33,
  'Drill 15: Caminhada do Caranguejo': 34,
  'Drill 20: Sequência Avançada Conectada': 35,
  'Drill 1: Ponte Básica (Upa) Explosiva': 42,
  'Drill 9: Sprawl Básico e Rápido': 46,
  'Drill 6: Rolamento para Trás Redondo': 48,
  'Drill 10: Sequência Caseira Completa': 49,
  'Drill 4: Levantada Técnica de Campeão': 53,

  // EDIÇÃO 7
  'Por Baixo na Guarda: Proteger, Desequilibrar e Raspar': 1,
  'Estou Sendo Finalizado: Bater, Parar e Reiniciar com Respeito': 36,
  'Chave Americana: Controle do Ombro e Respeito': 37,
  'Estrangulamento de Gola: Reconhecer e Comunicar': 40,
  'Chave de Braço (Arm Lock): Técnica sem Força': 62,
  'Kimura: Figura Quatro e Cuidado com o Parceiro': 65,
  'Por Cima na Guarda: Postura, Abertura e Passagem': 66,
}

// Mapas de capítulos para ilustrações de capa padrão baseadas nas páginas
export const chapterCoverPageMap: Record<number, number> = {
  2: 6, // Guarda Fechada
  3: 16, // Raspagem Tesoura
  4: 2, // Passagem Toreando
  5: 38, // Sair das Costas
  6: 26, // Drill Gorila
  7: 62, // Chave de Braço
}

export { pdfUrl }

// Cache simples de dataURLs gerados para evitar re-renderizar páginas já extraídas
const pageDataUrlCache = new Map<number, string>()
const renderPromises = new Map<number, Promise<string>>()

// Worker e biblioteca PDF.js via CDN carregada sob demanda
let pdfjsLibPromise: Promise<any> | null = null
let pdfDocPromise: Promise<any> | null = null

function loadPdfJsLib(): Promise<any> {
  if (pdfjsLibPromise) return pdfjsLibPromise
  pdfjsLibPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Browser only'))
    if ((window as any).pdfjsLib) return resolve((window as any).pdfjsLib)

    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.async = true
    script.onload = () => {
      const lib = (window as any).pdfjsLib
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
        resolve(lib)
      } else {
        reject(new Error('PDF.js não encontrado'))
      }
    }
    script.onerror = () => reject(new Error('Falha ao carregar script do PDF.js'))
    document.head.appendChild(script)
  })
  return pdfjsLibPromise
}

function getPdfDocument(): Promise<any> {
  if (pdfDocPromise) return pdfDocPromise
  pdfDocPromise = (async () => {
    const lib = await loadPdfJsLib()
    const loadingTask = lib.getDocument(pdfUrl)
    return loadingTask.promise
  })()
  return pdfDocPromise
}

/**
 * Renderiza uma página específica do PDF anexado em DataURL (imagem JPEG)
 */
export async function renderPdfPageToDataUrl(pageNumber: number): Promise<string> {
  if (pageDataUrlCache.has(pageNumber)) {
    return pageDataUrlCache.get(pageNumber)!
  }
  if (renderPromises.has(pageNumber)) {
    return renderPromises.get(pageNumber)!
  }

  const promise = (async () => {
    try {
      const doc = await getPdfDocument()
      const page = await doc.getPage(pageNumber)
      const viewport = page.getViewport({ scale: 1.5 })

      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas 2D context not available')

      await page.render({
        canvasContext: context,
        viewport,
      }).promise

      const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
      pageDataUrlCache.set(pageNumber, dataUrl)
      return dataUrl
    } catch (err) {
      console.warn(`Erro ao renderizar página ${pageNumber} do PDF:`, err)
      return ''
    } finally {
      renderPromises.delete(pageNumber)
    }
  })()

  renderPromises.set(pageNumber, promise)
  return promise
}
