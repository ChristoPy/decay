import { Token } from "../types/token"

const TOKENS = [
  {
    type: 'ignore',
    pattern: /^(\s|\t|\n)/,
  },
  {
    type: 'ignore',
    pattern: /^\/\/.*/,
  },
  {
    type: 'keyword',
    pattern: /^component/,
  },
  {
    type: 'keyword',
    pattern: /^view/,
  },
  {
    type: 'identifier',
    pattern: /^([a-zA-Z_][a-zA-Z0-9_]*)/,
  },
  {
    type: 'string',
    pattern: /^"([^"]*)"/,
  },
  {
    type: 'lBrace',
    pattern: /^\(/,
  },
  {
    type: 'rBrace',
    pattern: /^\)/,
  },
  {
    type: 'lBracket',
    pattern: /^{/,
  },
  {
    type: 'rBracket',
    pattern: /^}/,
  },
  {
    type: 'comma',
    pattern: /^,/,
  }
]

function getToken(source: string): Match | null {
  let matched: Match | null = null

  for (let { type, pattern } of TOKENS) {
    let match = pattern.exec(source)
    if (match) {
      matched = {
        type,
        value: match[0],
        length: match[0].length,
      }
      break
    }
  }

  return matched
}

function main(source: string) {
  let content = source
  let line = 1
  let column = 1

  let cursor = 0
  let lookAheadCursor = 0

  function lookAhead(): Token | null {
    let slice = content.slice(lookAheadCursor)
    const matched = getToken(slice)
    if (!matched) {
      return null
    }
    if (matched.type === 'ignore') {
      lookAheadCursor += matched.length
      return lookAhead()
    }

    return {
      type: matched.type || 'eof',
      value: matched.value || '',
      line: 0,
      start: cursor,
      end: cursor + matched.length || 0,
    }
  }
  function hasTokens(): Boolean {
    return cursor < content.length
  }
  function nextToken(): Token | null {
    if (!hasTokens()) {
      return null
    }

    let slice = content.slice(cursor)
    const matched = getToken(slice)
    if (matched) {
      column += matched.length
      cursor += matched.length
      lookAheadCursor = cursor

      if (matched.value == '\n') {
        line++
        column = 1
      }
      if (matched.type === 'ignore') {
        return nextToken()
      }

      return {
        type: matched.type,
        value: matched.value,
        line,
        start: column - matched.length,
        end: column,
      }
    }

    return null
  }

  return {
    lookAhead,
    hasTokens,
    nextToken,
  }
}

export default main
