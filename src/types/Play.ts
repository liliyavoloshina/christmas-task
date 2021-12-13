interface PlayOptionItem {
  className: string
  active: number
  quantity: number
}

interface FavoriteItemCopy {
  id: string
  coords: [string, string]
}

interface FavoriteItem {
  id: string
  amount: number
  itemsSetted: FavoriteItemCopy[]
  itemsNotSetted: FavoriteItemCopy[]
}

interface ObjectIndexNumber {
  [key: number]: string
}

interface PlayOptionsObject {
  [key: string]: PlayOptionItem
}

interface PlaySettings {
  activeScene: number
  activeTree: number
  activeLights: number
  isSnow: boolean
  isMusic: boolean
}

export type { PlayOptionItem, PlayOptionsObject, ObjectIndexNumber, FavoriteItemCopy, FavoriteItem, PlaySettings } 