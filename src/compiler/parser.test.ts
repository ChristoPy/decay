import { expect, test } from 'vitest'
import parser from './parser'
import { ComponentAST } from '../types/ast'

test('no code, no AST', () => {
  const parse = parser('')
  const result = parse.program()

  expect(result.body).toStrictEqual([])
})

test('empty component AST', () => {
  const parse = parser('component example () {}')
  const result = parse.program()

  const expected: ComponentAST = {
    name: 'component',
    params: {},
    body: [],
    meta: {
      keywordPosition: [1, 1],
      namePosition: [1, 11],
      openParamPosition: [1, 19],
      closeParamPosition: [1, 20],
      openBodyPosition: [1, 22],
      closeBodyPosition: [1, 23],
    }
  }

  expect(result.body[0]).toStrictEqual(expected)
})
