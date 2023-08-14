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

test('component with a param AST', () => {
  const parse = parser('component example (name) {}')
  const result = parse.program()

  const expected: ComponentAST = {
    name: 'component',
    params: {
      name: {
        position: [1, 20]
      }
    },
    body: [],
    meta: {
      keywordPosition: [1, 1],
      namePosition: [1, 11],
      openParamPosition: [1, 19],
      closeParamPosition: [1, 24],
      openBodyPosition: [1, 26],
      closeBodyPosition: [1, 27],
    }
  }

  expect(result.body[0]).toStrictEqual(expected)
})

test('component with multiple params AST', () => {
  const parse = parser('component example (name, example) {}')
  const result = parse.program()

  const expected: ComponentAST = {
    name: 'component',
    params: {
      name: {
        position: [1, 20]
      },
      example: {
        position: [1, 26]
      }
    },
    body: [],
    meta: {
      keywordPosition: [1, 1],
      namePosition: [1, 11],
      openParamPosition: [1, 19],
      closeParamPosition: [1, 33],
      openBodyPosition: [1, 35],
      closeBodyPosition: [1, 36],
    }
  }

  expect(result.body[0]).toStrictEqual(expected)
})
