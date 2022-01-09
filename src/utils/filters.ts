import { CatalogFilters, SortKey } from '../types/Catalog'
import { Item } from '../types/Item'

const filterArray = (items: Item[], filters: CatalogFilters) => {
	const isCorrectYear = (item: Item) => item.year >= filters.year.min && item.year <= filters.year.max
	const isCorrectAmount = (item: Item) => item.amount >= filters.amount.min && item.amount <= filters.amount.max
	const isCorrectShape = (item: Item) => filters.shape.includes(item.shape)
	const isCorrectColor = (item: Item) => filters.color.includes(item.color)
	const isCorrectSize = (item: Item) => filters.size.includes(item.size)
	const isCorrectFavorite = (item: Item) => {
		if (filters.areOnlyFavorite === true) {
			return item.isFavorite === filters.areOnlyFavorite
		}

		return true
	}

	const isCorrectSelected = (item: Item) => {
		if (filters.areOnlySelected === true) {
			return item.isSelected === filters.areOnlySelected
		}

		return true
	}

	return items.filter(
		item =>
			isCorrectYear(item) && isCorrectAmount(item) && isCorrectShape(item) && isCorrectColor(item) && isCorrectSize(item) && isCorrectFavorite(item) && isCorrectSelected(item)
	)
}

const sortArray = (array: Item[], key: SortKey) => {
	if (key === SortKey.Az) {
		return array.sort((a, b) => a.name.localeCompare(b.name))
	}
	if (key === SortKey.Za) {
		return array.sort((a, b) => b.name.localeCompare(a.name))
	}
	if (key === SortKey.Asc) {
		return array.sort((a, b) => a.year - b.year)
	}
	if (key === SortKey.Desc) {
		return array.sort((a, b) => b.year - a.year)
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

export { filterArray, sortArray, searchArray }
