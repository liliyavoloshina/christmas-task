interface PlayOptionItem {
  className: string
  quantity: number
}

interface PlayOptionsObject {
  [key: string]: PlayOptionItem
}

interface PlayState {
  options: PlayOptionsObject
}

export type { PlayOptionItem, PlayState, PlayOptionsObject } 