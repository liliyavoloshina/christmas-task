export interface RangeOptions {
	min: number
	max: number
}

interface ObjectKeys {
	[key: string]: RangeOptions
}

export interface Filters extends ObjectKeys {
	year: RangeOptions
	amount: RangeOptions
}
