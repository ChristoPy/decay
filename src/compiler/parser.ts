import { AST, ASTNode, ComponentBlockNode, ComponentNode, FunctionCallNode } from '../types/ast'
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

  function component(): ComponentNode {
    const keyword = eat('keyword')
    const name = eat('identifier')
    const block = componentBlock()

    return {
      type: 'component',
      value: name.value,
      block: block,
      root: false,
      line: keyword.line,
      start: keyword.start,
      end: keyword.end,
    }
  }
  function componentBlock(): ComponentBlockNode {
    const lBracket = eat('lBracket')

    const nodes: ASTNode[] = []
    let rBracket: Token | null = null

    let closed = false
    while (tokenizer.hasTokens()) {
      const token = tokenizer.lookAhead()
      if (token?.type === 'rBracket') {
        rBracket = eat('rBracket')
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

    return {
      type: 'componentBlock',
      children: nodes,
      root: false,
      line: lBracket.line,
      start: lBracket.start,
      end: rBracket!.end,
    } as ComponentBlockNode
  }
  function functionCall(): FunctionCallNode {
    const name = eat('identifier')
    const lBrace = eat('lBrace')
    const param = eat('string')
    const rBrace = eat('rBrace')

    return {
      type: 'functionCall',
      value: name.value,
      params: [{
        type: 'string',
        value: param.value,
        root: false,
        line: 0,
        start: param.start,
        end: param.end,
      }],
      root: false,
      line: 0,
      start: lBrace.start,
      end: rBrace.end,
    }
  }

  function program(): AST {
    const tokens: ASTNode[] = []
    while (tokenizer.hasTokens()) {
      const statements = statement()
      if (!statements) {
        break
      }
      tokens.push(statements)
    }

    return {
      root: true,
      children: tokens,
    }
  }

  return {
    program
  }
}

export default main
