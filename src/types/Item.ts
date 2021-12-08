import { ObjectKeys } from './utils'

interface Item extends ObjectKeys {
	id: string
	name: string
	amount: number
	year: number
	shape: 'ball' | 'figure' | 'bell' | 'cone' | 'snowflake'
	color: 'green' | 'white' | 'red' | 'blue' | 'yellow'
	size: 'large' | 'medium' | 'small'
	isFavorite: boolean
}

export default Item
