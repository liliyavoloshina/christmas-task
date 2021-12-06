export interface RangeOptions {
	min: number
	max: number
}

export type Shapes = 'ball' | 'figure' | 'bell' | 'cone' | 'snowflake'
export type Colors = 'green' | 'white' | 'red' | 'blue' | 'yellow'
export type Sizes = 'large' | 'medium' | 'small'

export interface ObjectKeys {
	[key: string]: AllOptions
}

export interface ShapeOptions {
	shape: Shapes[]
}

export interface ColorOptions {
	shape: Colors[]
}

export interface SizeOptions {
	shape: Sizes[]
}

export type MultiselectOptions = Shapes[] | Colors[] | Sizes[]

export type AllOptions = RangeOptions | MultiselectOptions | boolean

export interface Filters extends ObjectKeys {
	year: RangeOptions
	amount: RangeOptions
	shape: Shapes[]
	color: Colors[]
	size: Sizes[]
	areOnlyFavorite: boolean
}
