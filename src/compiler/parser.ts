import { ComponentAST, ComponentCall, ComponentParams, FinalAST, TokenPosition } from '../types/ast'
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
    const calls = componentBlock()

    return {
      name: 'component',
      params: params.params,
      body: calls.calls,
      meta: {
        keywordPosition: [keyword.line, keyword.start],
        namePosition: [name.line, name.start],
        openParamPosition: params.openParamPosition,
        closeParamPosition: params.closeParamPosition,
        openBodyPosition: calls.openBlockPosition,
        closeBodyPosition: calls.closeBlockPosition,
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
  function componentBlock() {
    let calls: ComponentCall[] = []
    const blockStart = eat('lBracket')
    let lookAhead = tokenizer.lookAhead()

    while (lookAhead && lookAhead.type != 'rBracket') {
      const call = componentCall()
      calls.push(call)

      lookAhead = tokenizer.lookAhead()

      if (lookAhead && lookAhead.type === 'comma') {
        eat('comma')
      }
      lookAhead = tokenizer.lookAhead()
    }
    const blockEnd = eat('rBracket')

    return {
      calls,
      openBlockPosition: [blockStart.line, blockStart.start] as TokenPosition,
      closeBlockPosition: [blockEnd.line, blockEnd.start] as TokenPosition,
    }
  }
  function componentCall(): ComponentCall {
    const name = eat('identifier')
    const paramStart = eat('lBrace')
    const paramEnd = eat('rBrace')

    return {
      name: 'componentCall',
      params: [],
      meta: {
        namePosition: [name.line, name.start],
        openParamPosition: [paramStart.line, paramStart.start],
        closeParamPosition: [paramEnd.line, paramEnd.start]
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
