import Compiler from './compiler'

const compiler = Compiler()
compiler.addFile('src/index.ts', `
// this is a comment

component Header {
  Img("https://example.com/logo.png")
}

component Button {
  Text("Hello World")
}

view App {
  Header()
  Button()
}
`)
