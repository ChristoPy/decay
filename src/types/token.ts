export interface Token {
  type: 'ignore' | 'keyword' | 'identifier' | 'string' | 'lBrace' | 'rBrace' | 'lBracket' | 'rBracket' | 'comma'
  value: string
  line: number
  start: number
  end: number
}
