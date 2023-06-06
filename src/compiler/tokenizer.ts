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
  let cursor = 0
  let lookAheadCursor = 0

  function lookAhead(): Match | null {
    let slice = content.slice(lookAheadCursor)
    const matched = getToken(slice)
    if (matched && matched.type === 'ignore') {
      lookAheadCursor += matched.length
      return lookAhead()
    }
    return matched
  }
  function hasTokens(): Boolean {
    return cursor < content.length
  }
  function nextToken(): Match | null {
    if (!hasTokens()) {
      return null
    }

    let slice = content.slice(cursor)
    const matched = getToken(slice)
    if (matched) {
      cursor += matched.length
      lookAheadCursor = cursor

      if (matched.type === 'ignore') {
        console.log('ignore', matched.value)
        return nextToken()
      }

      console.log('matched', matched.value)
      return matched
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
