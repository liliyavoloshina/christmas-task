interface PlayOptionItem {
  className: string
  active: number
  quantity: number
}

interface PlayOptionsObject {
  [key: string]: PlayOptionItem
}

export type { PlayOptionItem, PlayOptionsObject } 