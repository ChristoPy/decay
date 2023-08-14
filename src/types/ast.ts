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
  namePosition: TokenPosition
  openParamPosition: TokenPosition
  closeParamPosition: TokenPosition
}

export interface ComponentMeta extends Meta {
  keywordPosition: TokenPosition
  openBodyPosition: TokenPosition
  closeBodyPosition: TokenPosition
}

export interface ComponentParams {
  [key: string]: {
    position: TokenPosition
  }
}

export interface ComponentCall {
  meta: Meta
}

export interface ComponentAST {
  name: 'component'
  params: ComponentParams
  body: ComponentCall[]
  meta: ComponentMeta
}

export interface FinalAST {
  body: ComponentAST[]
}
