export function stripMarkdown(text) {
  if (text === undefined || text === null) {
    return ''
  }

  let result = String(text)

  // Normalize whitespace and line breaks
  result = result.replace(/\r?\n+/g, ' ')

  // Preserve link text, drop URL
  result = result.replace(/!\[([^\]]*)\]\((?:[^)]+)\)/g, '$1')
  result = result.replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, '$1')

  // Remove common markdown formatting tokens
  result = result.replace(/\*\*(.*?)\*\*/g, '$1')
  result = result.replace(/__(.*?)__/g, '$1')
  result = result.replace(/~~(.*?)~~/g, '$1')
  result = result.replace(/`([^`]+)`/g, '$1')
  result = result.replace(/`+/g, '')

  // Remove heading markers and blockquote markers
  result = result.replace(/^#{1,6}\s*/gm, '')
  result = result.replace(/^>\s*/gm, '')

  // Remove list markers from the start of lines
  result = result.replace(/^[\*\-\+]\s+/gm, '')

  // Remove any stray formatting characters left behind
  result = result.replace(/[\*_~`]/g, '')

  result = result.replace(/\s{2,}/g, ' ')
  return result.trim()
}

export function capitalizeFirstLetter(text) {
  const str = stripMarkdown(text)
  if (!str) {
    return ''
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}
