import { ComponentAST, ComponentCall, ComponentCallParams, ComponentParams, FinalAST, TokenPosition } from '../types/ast'
import { Token } from '../types/token'
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
  function eatUntil(limiter: string, predicate: string, callback: (x: Token) => void) {
    let lookAhead = tokenizer.lookAhead()

    while(lookAhead && lookAhead.type != limiter) {
      const param = eat(predicate)
      callback(param)
      lookAhead = tokenizer.lookAhead()

      if (lookAhead && lookAhead.type === 'comma') {
        eat('comma')
      }
      lookAhead = tokenizer.lookAhead()
    }
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
      kind: 'component',
      name: name.value,
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
    eatUntil('rBrace', 'identifier', (param) => {
      params[param.value] = {
        position: [param.line, param.start]
      }
    })
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
    const params: ComponentCallParams[] = []

    const name = eat('identifier')
    const paramStart = eat('lBrace')
    let lookAhead = tokenizer.lookAhead()

    while(lookAhead && lookAhead.type != 'rBrace') {
      const param = componentCallParam()
      params.push(param)
      lookAhead = tokenizer.lookAhead()

      if (lookAhead && lookAhead.type === 'comma') {
        eat('comma')
      }
      lookAhead = tokenizer.lookAhead()
    }
    const paramEnd = eat('rBrace')

    return {
      kind: 'componentCall',
      name: name.value,
      params,
      meta: {
        namePosition: [name.line, name.start],
        openParamPosition: [paramStart.line, paramStart.start],
        closeParamPosition: [paramEnd.line, paramEnd.start]
      }
    }
  }
  function componentCallParam(): ComponentCallParams {
    const lookup = ['string', 'identifier']
    const nextToken = tokenizer.lookAhead()

    if (nextToken && lookup.includes(nextToken.type)) {
      const param = eat(nextToken.type)

      return {
        kind: param.type as ComponentCallParams['kind'],
        position: [param.line, param.start],
        value: param.value
      }
    }

    eat('string')
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
