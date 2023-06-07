export interface DecayType {
  name: string
  value: any
}

export interface DecayComponentCall {
  name: string
  properties: DecayType[]
}

export interface DecayComponent {
  name: string
  properties: DecayType[]
  sideEffects: DecayComponentCall[]
}

export interface DecayView {
  name: string
  components: DecayComponent[]
}
