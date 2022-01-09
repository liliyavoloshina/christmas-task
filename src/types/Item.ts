enum ItemShape {
	Ball = 'ball',
	Figure = 'figure',
	Bell = 'bell',
	Cone = 'cone',
	Snowflake = 'snowflake',
}

enum ItemColor {
	Green = 'green',
	White = 'white',
	Red = 'red',
	blue = 'blue',
	Yellow = 'yellow',
}

enum ItemSize {
	Large = 'large',
	Medium = 'medium',
	Small = 'small',
}

interface ItemObject {
	[key: string]: string | number | boolean
}

interface Item extends ItemObject {
	id: string
	name: string
	amount: number
	year: number
	shape: ItemShape
	color: ItemColor
	size: ItemSize
	isFavorite: boolean
	isSelected: boolean
}

export { ItemShape, ItemColor, ItemSize }
export type { Item }
