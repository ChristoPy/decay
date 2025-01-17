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

export interface ComponentParam {
  position: TokenPosition
}

export interface ComponentParams {
  [key: string]: ComponentParam
}

export interface ComponentCallParams {
  kind: 'string' | 'identifier'
  value: any
  position: TokenPosition
}
export interface ComponentCall {
  kind: 'componentCall'
  name: string
  nestedCall: NestedComponentCall | null,
  params: ComponentCallParams[]
  meta: Meta
}

export interface NestedComponentCallParams {
  kind: 'string' | 'identifier' | 'atom'
  value: any
  position: TokenPosition
}
export interface NestedComponentCall {
  kind: 'nestedComponentCall'
  name: string
  nestedCall: ComponentCall | null,
  params: NestedComponentCallParams[]
  meta: Meta
}

export interface ComponentAST {
  kind: 'component'
  name: string
  params: ComponentParams
  body: ComponentCall[]
  meta: ComponentMeta
}

export interface FinalAST {
  body: ComponentAST[]
}
