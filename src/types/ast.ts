export interface ASTNode {
  type: string
  value: string
  children: ASTNode[]
  root: boolean
  line: number
  start: number
  end: number
}

export interface AST {
  root: boolean
  children: ASTNode[]
}
