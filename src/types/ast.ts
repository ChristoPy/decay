export interface ASTNode {
  type: string
  value?: string
  line: number
  start: number
  end: number
}

export interface ComponentNode extends ASTNode {
  params: ASTNode[]
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

// ===============


export interface Meta {
  keywordPosition: [number, number],
  namePosition: [number, number],
  closeBracePosition: [number, number],
}

export interface ComponentMeta extends Meta {
  openBracePosition: [number, number],
}

export interface ComponentAST {
  name: 'component'
  params: {}
  body: []
  meta: ComponentMeta
}

export interface FinalAST {
  body: ComponentAST[]
}
