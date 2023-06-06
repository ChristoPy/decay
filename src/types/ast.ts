export interface ASTNode {
  type: string
  value?: string
  root: boolean
  line: number
  start: number
  end: number
}

export interface ComponentNode extends ASTNode {
  block: ComponentBlockNode
}
export interface ComponentBlockNode extends ASTNode {
  children: FunctionCallNode[]
}

export interface FunctionCallNode extends ASTNode {
  params: ASTNode[]
}

export interface ViewNode extends ASTNode {
  block: ComponentBlockNode
}

export interface AST {
  root: boolean
  children: ASTNode[]
}
