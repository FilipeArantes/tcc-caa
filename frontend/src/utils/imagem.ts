const MAIOR_LADO_PX = 1280
const QUALIDADE_JPEG = 0.85

export async function reduzirImagem(arquivo: File): Promise<File> {
  if (!arquivo.type.startsWith('image/') || typeof createImageBitmap === 'undefined') {
    return arquivo
  }

  const bitmap = await createImageBitmap(arquivo)
  const escala = Math.min(1, MAIOR_LADO_PX / Math.max(bitmap.width, bitmap.height))

  if (escala === 1 && arquivo.size <= 500 * 1024) {
    bitmap.close()
    return arquivo
  }

  const tela = document.createElement('canvas')
  tela.width = Math.round(bitmap.width * escala)
  tela.height = Math.round(bitmap.height * escala)
  tela.getContext('2d')?.drawImage(bitmap, 0, 0, tela.width, tela.height)
  bitmap.close()

  const reduzida = await new Promise<Blob | null>((resolver) => tela.toBlob(resolver, 'image/jpeg', QUALIDADE_JPEG))

  if (reduzida === null || reduzida.size >= arquivo.size) {
    return arquivo
  }

  return new File([reduzida], arquivo.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' })
}
