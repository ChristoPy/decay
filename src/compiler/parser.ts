import { ComponentAST, FinalAST } from '../types/ast'
import Tokenize from './tokenizer'

function main(source: string) {
  const tokenizer = Tokenize(source)

  function eat(type: string) {
    const token = tokenizer.nextToken()
    if (token && token.type === type) {
      return token
    }
    if (!token) {
      throw new Error(`Expected ${type} but got EOF`)
    }

    throw new Error(`Expected ${type} but got ${token?.type}`)
  }
  function eatOr(left: string, right: string) {
    const token = tokenizer.nextToken()
    if (token && (token.type === left || token.type === right)) {
      return token
    }
    if (!token) {
      throw new Error(`Expected ${left} or ${right} but got EOF`)
    }

    throw new Error(`Expected ${left} or ${right} but got ${token?.type}`)
  }

  function statement() {
    const lookAhead = tokenizer.lookAhead()
    if (!lookAhead) {
      return null
    }

    if (lookAhead.type === 'keyword') {
      switch (lookAhead.value) {
        case 'component':
          return component()
        default:
          throw new Error(`Unknown keyword ${lookAhead.value}`)
      }
    }

    throw new Error(`Unknown statement ${lookAhead?.value}`)
  }

  function component(): ComponentAST {
    const keyword = eat('keyword')
    const name = eat('identifier')
    const paramStart = eat('lBrace')
    const paramEnd = eat('rBrace')
    const blockStart = eat('lBracket')
    const blockEnd = eat('rBracket')

    return {
      name: 'component',
      params: {},
      body: [],
      meta: {
        keywordPosition: [keyword.line, keyword.start],
        namePosition: [name.line, name.start],
        openParamPosition: [paramStart.line, paramStart.start],
        closeParamPosition: [paramEnd.line, paramEnd.start],
        openBodyPosition: [blockStart.line, blockStart.start],
        closeBodyPosition: [blockEnd.line, blockEnd.start],
      }
    }
  }

  function program(): FinalAST {
    const tokens: ComponentAST[] = []
    while (tokenizer.hasTokens()) {
      const statements = statement()
      if (!statements) {
        break
      }
      tokens.push(statements)
    }

    return {
      body: tokens,
    }
  }

  return {
    program
  }
}

export default main
