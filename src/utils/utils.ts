import Item from '../types/Item'
import { Filters, SortOptionsKeys } from '../types/Filter'

type StorageKeys = 'filters' | 'sort'

const firstToUpperCase = (string: string) => {
	const first = string.charAt(0).toUpperCase()
	return first + string.slice(1)
}

const searchOptions = (value: string, options: string[] = [], exclude: string[] = []) =>
	options.filter((option: string) => {
		const matches = option.toLowerCase().indexOf(value.toLowerCase()) === 0
		return matches && exclude.indexOf(option) < 0
	})

const filterArray = (array: Item[], filters: Filters) => {
	const filteredByRange = array.filter(
		item => item.year >= filters.year.min && item.year <= filters.year.max && item.amount >= filters.amount.min && item.amount <= filters.amount.max
	)
	const filteredByColor = filteredByRange.filter(item => filters.color.includes(item.color))
	const filteredBySize = filteredByColor.filter(item => filters.size.includes(item.size))
	const filteredByShape = filteredBySize.filter(item => filters.shape.includes(item.shape))
	const filteredByFavorite = filteredByShape.filter(item => item.isFavorite === filters.areOnlyFavorite)

	return filteredByFavorite
}

const sortArray = (array: Item[], key: SortOptionsKeys) => {
	if (key === 'az') {
		return array.sort((a, b) => a.name.localeCompare(b.name))
	}
	if (key === 'za') {
		return array.sort((a, b) => b.name.localeCompare(a.name))
	}
	if (key === 'asc') {
		return array.sort((a, b) => a.amount - b.amount)
	}
	if (key === 'desc') {
		return array.sort((a, b) => b.amount - a.amount)
	}

	return array
}

const searchArray = (array: Item[], key: string) =>
	array.filter(item => {
		if (key === '') {
			return item
		}
		return item.name.toLocaleLowerCase().includes(key.toLowerCase())
	})

const setToStorage = <T>(key: StorageKeys, value: T) => {
	const stringified = JSON.stringify(value)
	window.localStorage.setItem(key, stringified)
}

const defaultFilters = {
	year: {
		min: 1940,
		max: 2020,
	},
	amount: {
		min: 1,
		max: 12,
	},
	shape: ['ball', 'figure', 'bell', 'cone', 'snowflake'],
	color: ['green', 'white', 'red', 'blue', 'yellow'],
	size: ['large', 'medium', 'small'],
	areOnlyFavorite: false,
}

const getFromStorage = (key: StorageKeys) => {
	const stored = window.localStorage.getItem(key)

	if (stored) {
		return JSON.parse(stored)
	}

	return defaultFilters
}

export { firstToUpperCase, searchOptions, filterArray, setToStorage, getFromStorage, sortArray, searchArray }
