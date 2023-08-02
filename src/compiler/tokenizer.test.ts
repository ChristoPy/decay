import { expect, test } from 'vitest'
import tokenizer from './tokenizer'

test('no code, no tokens', () => {
  const tokenize = tokenizer('')
  expect(tokenize.lookAhead()).toBe(null)
  expect(tokenize.hasTokens()).toBe(false)
  expect(tokenize.nextToken()).toBe(null)
})

test('detect a token', () => {
  const tokenize = tokenizer('name')
  expect(tokenize.hasTokens()).toBe(true)
  const expected = {
    end: 5,
    line: 1,
    start: 1,
    type: "identifier",
    value: "name",
  }
  expect(tokenize.lookAhead()).toStrictEqual(expected)
  expect(tokenize.nextToken()).toStrictEqual(expected)
  expect(tokenize.lookAhead()).toBe(null)
})

test.only('break if a not defined token', () => {
  const tokenize = tokenizer('-')
  expect(tokenize.hasTokens()).toBe(true)
  expect(tokenize.nextToken()).toBe(null)
  expect(tokenize.lookAhead()).toBe(null)
})

test('detect all possible tokens', () => {
  const tokenize = tokenizer(
    `
component
view
name
"string"
()
{}
,`
  )
  expect(tokenize.hasTokens()).toBe(true)

  const component = {
    end: 10,
    line: 2,
    start: 1,
    type: "keyword",
    value: "component",
  }
  expect(tokenize.lookAhead()).toStrictEqual(component)
  expect(tokenize.nextToken()).toStrictEqual(component)

  const view = {
    end: 5,
    line: 3,
    start: 1,
    type: "keyword",
    value: "view",
  }
  expect(tokenize.lookAhead()).toStrictEqual(view)
  expect(tokenize.nextToken()).toStrictEqual(view)

  const name = {
    end: 5,
    line: 4,
    start: 1,
    type: "identifier",
    value: "name",
  }
  expect(tokenize.lookAhead()).toStrictEqual(name)
  expect(tokenize.nextToken()).toStrictEqual(name)

  const string = {
    end: 9,
    line: 5,
    start: 1,
    type: "string",
    value: '"string"',
  }
  expect(tokenize.lookAhead()).toStrictEqual(string)
  expect(tokenize.nextToken()).toStrictEqual(string)

  const lBrace = {
    end: 2,
    line: 6,
    start: 1,
    type: "lBrace",
    value: "(",
  }
  expect(tokenize.lookAhead()).toStrictEqual(lBrace)
  expect(tokenize.nextToken()).toStrictEqual(lBrace)

  const rBrace = {
    end: 3,
    line: 6,
    start: 2,
    type: "rBrace",
    value: ")",
  }
  expect(tokenize.lookAhead()).toStrictEqual(rBrace)
  expect(tokenize.nextToken()).toStrictEqual(rBrace)

  const lBracket = {
    end: 2,
    line: 7,
    start: 1,
    type: "lBracket",
    value: "{",
  }
  expect(tokenize.lookAhead()).toStrictEqual(lBracket)
  expect(tokenize.nextToken()).toStrictEqual(lBracket)

  const rBracket = {
    end: 3,
    line: 7,
    start: 2,
    type: "rBracket",
    value: "}",
  }
  expect(tokenize.lookAhead()).toStrictEqual(rBracket)
  expect(tokenize.nextToken()).toStrictEqual(rBracket)

  const comma = {
    end: 2,
    line: 8,
    start: 1,
    type: "comma",
    value: ",",
  }
  expect(tokenize.lookAhead()).toStrictEqual(comma)
  expect(tokenize.nextToken()).toStrictEqual(comma)

  expect(tokenize.lookAhead()).toBe(null)
})
