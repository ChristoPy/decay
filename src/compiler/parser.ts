import { ComponentAST, ComponentParams, FinalAST, TokenPosition } from '../types/ast'
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

    const lookup = {
      'component': component
    }

    if (lookAhead.type === 'keyword') {
      const statementMethod = lookup[lookAhead.value]
      if (!statementMethod) {
        throw new Error(`Unknown keyword ${lookAhead.value}`)
      }

      return statementMethod()
    }

    throw new Error(`Unknown statement ${lookAhead?.value}`)
  }

  function component(): ComponentAST {
    const keyword = eat('keyword')
    const name = eat('identifier')
    const params = componentParams()
    const blockStart = eat('lBracket')
    const blockEnd = eat('rBracket')

    return {
      name: 'component',
      params: params.params,
      body: [],
      meta: {
        keywordPosition: [keyword.line, keyword.start],
        namePosition: [name.line, name.start],
        openParamPosition: params.openParamPosition,
        closeParamPosition: params.closeParamPosition,
        openBodyPosition: [blockStart.line, blockStart.start],
        closeBodyPosition: [blockEnd.line, blockEnd.start],
      }
    }
  }
  function componentParams() {
    let params: ComponentParams = {}
    const paramStart = eat('lBrace')
    let lookAhead = tokenizer.lookAhead()

    while(lookAhead && lookAhead.type != 'rBrace') {
      const param = eat('identifier')
      params[param.value] = {
        position: [param.line, param.start]
      }
      lookAhead = tokenizer.lookAhead()

      if (lookAhead && lookAhead.type === 'comma') {
        eat('comma')
      }
      lookAhead = tokenizer.lookAhead()
    }
    const paramEnd = eat('rBrace')

    return {
      openParamPosition: [paramStart.line, paramStart.start] as TokenPosition,
      closeParamPosition: [paramEnd.line, paramEnd.start] as TokenPosition,
      params
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
