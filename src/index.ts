import Compiler from './compiler'

const compiler = Compiler()
compiler.addFile('src/index.ts', `
// this is a comment

component Button {
  Text("Hello World")
}`)
