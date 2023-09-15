import { Match } from "../types/parser"
import { Token } from "../types/token"

interface TokenDefinition {
  type: Token['type']
  pattern: RegExp
}

const TOKENS: TokenDefinition[] = [
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

  function reset(param: { line: number, cursor: number, column: number }) {
    line = param.line
    column = param.column
    cursor = param.cursor
  }

  function lookAhead(): Token | null {
    if (!hasTokens()) {
      return null
    }

    const initialLine = line
    const initialColumn = column
    const initialCursor = cursor

    let slice = content.slice(cursor)
    const matched = getToken(slice)
    if (matched) {
      column += matched.length
      cursor += matched.length

      if (matched.value == '\n') {
        line++
        column = 1
      }
      if (matched.type === 'ignore') {
        const result = nextToken()
        reset({ line: initialLine, cursor: initialCursor, column: initialColumn })
        return result
      }

      const result = {
        type: matched.type,
        value: matched.value,
        line,
        start: column - matched.length,
        end: column,
      }

      reset({ line: initialLine, cursor: initialCursor, column: initialColumn })
      return result
    }

    return null
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
