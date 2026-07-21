import type { DocumentChunk } from '../types'

/**
 * Chunking inteligente que respeta la estructura del documento.
 * Divide por secciones (títulos) y subdivide párrafos largos.
 */
export async function chunkDocument(
  text: string,
  source: string,
  options?: { maxTokens?: number; overlap?: number },
): Promise<DocumentChunk[]> {
  const maxTokens = options?.maxTokens || 1000
  const overlap = options?.overlap || 200
  const chunks: DocumentChunk[] = []

  // 1. Dividir por secciones (títulos Markdown, saltos de página)
  const sections = splitBySections(text)

  for (const [sectionIndex, section] of sections.entries()) {
    const heading = extractHeading(section)

    // 2. Si la sección es muy larga, subdividir por párrafos
    if (countTokens(section) > maxTokens) {
      const subChunks = splitByParagraphs(section, maxTokens, overlap)
      for (const [subIndex, subChunk] of subChunks.entries()) {
        chunks.push({
          id: `chunk-${sectionIndex}-${subIndex}`,
          content: subChunk,
          metadata: {
            source,
            section: heading,
            position: sectionIndex,
          },
        })
      }
    } else {
      chunks.push({
        id: `chunk-${sectionIndex}`,
        content: section,
        metadata: {
          source,
          section: heading,
          position: sectionIndex,
        },
      })
    }
  }

  return chunks
}

/**
 * Divide el texto en secciones respetando títulos y estructura.
 */
function splitBySections(text: string): string[] {
  // Primero intentar dividir por títulos Markdown
  const sections: string[] = []
  let currentSection = ''
  
  for (const line of text.split('\n')) {
    if (/^#{1,3}\s/.test(line) && currentSection) {
      sections.push(currentSection.trim())
      currentSection = line
    } else {
      currentSection += (currentSection ? '\n' : '') + line
    }
  }
  
  if (currentSection.trim()) {
    sections.push(currentSection.trim())
  }

  // Si no se encontraron secciones, devolver el texto completo
  return sections.length > 0 ? sections : [text]
}

/**
 * Extrae el heading de una sección.
 */
function extractHeading(section: string): string {
  const match = section.match(/^#{1,3}\s+(.+)/)
  return match ? match[1]!.trim() : ''
}

/**
 * Divide texto largo en chunks con overlap.
 */
function splitByParagraphs(
  text: string,
  maxTokens: number,
  overlap: number,
): string[] {
  const chunks: string[] = []
  const paragraphs = text.split(/\n\n+/)
  let currentChunk = ''

  for (const paragraph of paragraphs) {
    const chunkWithParagraph = currentChunk + (currentChunk ? '\n\n' : '') + paragraph

    if (countTokens(chunkWithParagraph) > maxTokens && currentChunk) {
      chunks.push(currentChunk)
      // Overlap: mantener el último párrafo
      currentChunk = paragraph
    } else {
      currentChunk = chunkWithParagraph
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk)
  }

  return chunks
}

/**
 * Estimación simple de tokens (~4 caracteres por token).
 */
export function countTokens(text: string): number {
  return Math.ceil(text.length / 4)
}
