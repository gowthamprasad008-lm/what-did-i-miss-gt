export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024

export type UploadResult = { ok: true; text: string } | { ok: false; error: string }

export async function readChatFile(file: File): Promise<UploadResult> {
  const isTxtName = file.name.toLowerCase().endsWith('.txt')
  // Some systems report an empty MIME type for .txt files, so only reject explicit non-text types.
  const isTextType = file.type === '' || file.type.startsWith('text/')

  if (!isTxtName || !isTextType) {
    return { ok: false, error: `"${file.name}" isn't a .txt file. Export the chat as plain text and try again.` }
  }

  if (file.size === 0) {
    return { ok: false, error: `"${file.name}" is empty.` }
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
    return { ok: false, error: `"${file.name}" is ${sizeMb} MB. The limit is 2 MB — try exporting a shorter chat.` }
  }

  const text = await file.text()

  if (text.includes('\u0000')) {
    return { ok: false, error: `"${file.name}" doesn't look like a text file.` }
  }

  return { ok: true, text }
}
