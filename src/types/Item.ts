interface ItemObject {
	[key: string]: string | number | boolean
}

interface Item extends ItemObject {
	id: string
	name: string
	amount: number
	year: number
	shape: 'ball' | 'figure' | 'bell' | 'cone' | 'snowflake'
	color: 'green' | 'white' | 'red' | 'blue' | 'yellow'
	size: 'large' | 'medium' | 'small'
	isFavorite: boolean
	isSelected: boolean
}

export default Item
