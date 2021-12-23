enum LightsOffsetType {
	Top = 'top',
	Left = 'left',
}

enum GarlandColor {
	Multicolor = 'multicolor',
	Yellow = 'yellow',
	Red = 'red',
	Pink = 'pink',
	Green = 'green',
}

enum PlayOptionName {
	Scene = 'scene',
	Tree = 'tree',
	Lights = 'lights',
}

enum PlayCheckboxName {
	Snow = 'snow',
	Music = 'music',
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

interface PlaySettings {
	scene: number
	tree: number
	isSnow: boolean
	isMusic: boolean
	isGarland: boolean
	garlandColor: GarlandColor
}

interface PreviousWork {
	id: number
	imageUrl: string
	playSettings: PlaySettings
	itemsSetted: PlaySelectedItemCopy[]
	itemsNotSetted: PlaySelectedItemCopy[]
	playSelectedItems: PlaySelectedItem[]
}

export type { ObjectIndexNumber, PlaySelectedItemCopy, PlaySelectedItem, PlaySettings, PreviousWork }
export { LightsOffsetType, GarlandColor, PlayOptionName, PlayCheckboxName }
