import { Token } from "./token"

export interface Match {
  type: Token['type']
  value: string
  length: number
}
