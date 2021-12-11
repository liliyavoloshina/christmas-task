interface PlayOptionItem {
  className: string
  active: number
  quantity: number
}

interface ObjectIndexNumber {
  [key: number]: string
}

interface PlayOptionsObject {
  [key: string]: PlayOptionItem
}

interface ParentCardsObject {
  [key: string]: HTMLDivElement
}

export type { PlayOptionItem, PlayOptionsObject, ObjectIndexNumber, ParentCardsObject } 