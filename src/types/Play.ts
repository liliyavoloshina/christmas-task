interface PlayOptionItem {
  className: string
  active: number
  quantity: number
}

interface TreePaths {
  [key: number]: string
}

interface PlayOptionsObject {
  [key: string]: PlayOptionItem
}

export type { PlayOptionItem, PlayOptionsObject, TreePaths } 