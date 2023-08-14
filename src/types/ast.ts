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

export type TokenPosition = [number, number]

export interface Meta {
  keywordPosition: TokenPosition,
  namePosition: TokenPosition,
  openParamPosition: TokenPosition,
  closeParamPosition: TokenPosition,
  openBodyPosition: TokenPosition,
  closeBodyPosition: TokenPosition,
}

export interface ComponentMeta extends Meta {}

export interface ComponentParams {
  [key: string]: {
    position: TokenPosition
  }
}

export interface ComponentAST {
  name: 'component'
  params: ComponentParams
  body: []
  meta: ComponentMeta
}

export interface FinalAST {
  body: ComponentAST[]
}
