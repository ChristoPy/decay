import { ASTNode } from '../types/ast'
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

  function statement() {
    const lookAhead = tokenizer.lookAhead()
    if (!lookAhead) {
      return null
    }

    if (lookAhead?.type === 'keyword') {
      switch (lookAhead.value) {
        case 'component':
          return component()
        default:
          throw new Error(`Unknown keyword ${lookAhead.value}`)
      }
    }

    throw new Error(`Unknown statement ${lookAhead?.value}`)
  }

  function component() {
    eat('keyword')
    const name = eat('identifier')
    eat('lBracket')
    const nodes = componentBlock()

    return {
      type: 'component',
      value: name.value,
      children: nodes,
      root: false,
      line: 0,
      start: 0,
      end: 0,
    }
  }
  function componentBlock(): ASTNode[] {
    const nodes: ASTNode[] = []
    let closed = false
    while (tokenizer.hasTokens()) {
      const token = tokenizer.lookAhead()
      if (token?.type === 'rBracket') {
        eat('rBracket')
        closed = true
        break
      }
      const statements = functionCall()
      if (!statements) {
        break
      }
      nodes.push(statements)
    }

    if (!closed) {
      throw new Error('Expected ) but got EOF')
    }

    return [{
      type: 'componentBlock',
      value: '',
      children: nodes,
      root: false,
      line: 0,
      start: 0,
      end: 0,
    }]
  }
  function functionCall(): ASTNode {
    const name = eat('identifier')
    eat('lBrace')
    const param = eat('string')
    eat('rBrace')

    return {
      type: 'functionCall',
      value: name.value,
      children: [{
        type: 'string',
        value: param.value,
        children: [],
        root: false,
        line: 0,
        start: 0,
        end: 0,
      }],
      root: false,
      line: 0,
      start: 0,
      end: 0,
    }
  }

  function program() {
    const tokens: ASTNode[] = []
    while (tokenizer.hasTokens()) {
      const statements = statement()
      if (!statements) {
        break
      }
      tokens.push(statements)
    }

    return {
      type: 'root',
      value: '',
      children: tokens,
      root: true,
      line: 0,
      start: 0,
      end: 0,
    }
  }

  return {
    program
  }
}

export default main
