import Item from '../types/Item'
import { Filters } from '../types/Filter'

const firstToUpperCase = (string: string) => {
	const first = string.charAt(0).toUpperCase()
	return first + string.slice(1)
}

function searchOptions(value: string, options: string[] = [], exclude: string[] = []) {
	return options.filter((option: string) => {
		const matches = option.toLowerCase().indexOf(value.toLowerCase()) === 0
		return matches && exclude.indexOf(option) < 0
	})
}

function filterArray(array: Item[], filters: Filters) {
	return array.filter(item => item.year >= filters.year.min && item.year <= filters.year.max && item.amount >= filters.amount.min && item.amount <= filters.amount.max)
}

export { firstToUpperCase, searchOptions, filterArray }
