export interface Token {
  type: 'ignore' | 'keyword' | 'identifier' | 'atom' | 'string' | 'lBrace' | 'rBrace' | 'lBracket' | 'rBracket' | 'comma'
  value: string
  line: number
  start: number
  end: number
}
