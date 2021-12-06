import Item from '../types/Item'
import { Filters } from '../types/Filter'

type StorageKeys = 'filters' | 'sort'

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

function setToStorage<T>(key: StorageKeys, value: T) {
	const stringified = JSON.stringify(value)
	window.localStorage.setItem(key, stringified)
}

function getFromStorage(key: StorageKeys) {
	const stored = window.localStorage.getItem(key)

	if (stored) {
		return JSON.parse(stored)
	}

	return ''
}

export { firstToUpperCase, searchOptions, filterArray, setToStorage, getFromStorage }
