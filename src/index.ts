import Compiler from './compiler'

const compiler = Compiler()
compiler.addFile('src/index.ts', `
// this is a comment

component Header(title, subtitle) {
  Img("https://example.com/logo.png")
  Text(title)
  Text(subtitle)
}

view App {
  Header("123", "456")
}
`)
