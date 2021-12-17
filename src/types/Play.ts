interface PlayOptionItem {
	className: string
	active: number
	quantity: number
}

interface PlaySelectedItemCopy {
	id: string
	coords: [string, string]
}

interface PlaySelectedItem {
	id: string
	amount: number
	itemsSetted: PlaySelectedItemCopy[]
	itemsNotSetted: PlaySelectedItemCopy[]
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
	isGarland: boolean
	garlandColor: 'multicolor' | 'yellow' | 'red' | 'pink' | 'green'
}

export type { PlayOptionItem, PlayOptionsObject, ObjectIndexNumber, PlaySelectedItemCopy, PlaySelectedItem, PlaySettings }
