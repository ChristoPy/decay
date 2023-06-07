import { Token } from '../types/token'
import parse from './parser'

function main() {
  const files: Record<string,Token[]> = {}

  function addFile(name: string, content: string) {
    const parser = parse(content)
    files[name] = parser.program()
    console.log(JSON.stringify(files[name], null, 2))
  }
  return {
    addFile,
  }
}

export default main
