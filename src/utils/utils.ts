import Item from '../types/Item'
import { CatalogSettings, SortKeys, CatalogFilters } from '../types/Catalog'
import { LocalStorage } from '../types/utils'
import { SNOWFLAKES_COUNT } from './constants'

const firstToUpperCase = (string: string) => {
	const first = string.charAt(0).toUpperCase()
	return first + string.slice(1)
}

const searchOptions = (value: string, options: string[] = [], exclude: string[] = []) =>
	options.filter((option: string) => {
		const matches = option.toLowerCase().indexOf(value.toLowerCase()) === 0
		return matches && exclude.indexOf(option) < 0
	})

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

const sortArray = (array: Item[], key: SortKeys) => {
	if (key === 'az') {
		return array.sort((a, b) => a.name.localeCompare(b.name))
	}
	if (key === 'za') {
		return array.sort((a, b) => b.name.localeCompare(a.name))
	}
	if (key === 'asc') {
		return array.sort((a, b) => a.year - b.year)
	}
	if (key === 'desc') {
		return array.sort((a, b) => b.year - a.year)
	}

	return array
}

const mergeSelectedAndOriginal = (selected: Item[], original: Item[]): Item[] => {
	const resettedOriginal = original.map(item => ({ ...item, isSelected: false }))

	const merged = [...resettedOriginal]

	if (selected.length > 0) {
		selected.forEach((selectedItem: Item) => {
			const selectedItemIndex = merged.findIndex((item: Item) => item.id === selectedItem.id)

			if (selectedItemIndex !== -1) {
				merged[selectedItemIndex].isSelected = true
			}
		})
	}

	return merged
}

const searchArray = (array: Item[], key: string) =>
	array.filter(item => {
		if (key === '') {
			return item
		}
		return item.name.toLocaleLowerCase().includes(key.toLowerCase())
	})

const idToInitial = (id: string) => id.split('-').slice(0, 1).join('')

const updateItemsArrayToSelected = (arr: Item[]) => {
	const updatedFavoriteItems = arr.map((item: Item) => {
		const itemsNotSetted = [...Array(item.amount)].map((el, index) => {
			const toy = { id: `${item.id}-${index}`, coords: [0, 0] }
			return toy
		})

		const itemForFavorite = { id: item.id, amount: item.amount, itemsNotSetted, itemsSetted: [] }
		return itemForFavorite
	})

	return updatedFavoriteItems
}

const serverRequest = async <T>(url: string): Promise<T> => {
	const req = await fetch(url)
	const res = await req.json()
	return res
}

const setData = <T>(key: LocalStorage, value: T) => {
	const stringified = JSON.stringify(value)
	window.localStorage.setItem(key, stringified)
}

const getData = async (key: LocalStorage) => {
	const stored = window.localStorage.getItem(key)

	if (stored) {
		return JSON.parse(stored)
	}

	if (key === LocalStorage.CatalogSettings) {
		const defaultSettingsFromServer = await serverRequest<CatalogSettings>('data/catalogSettings.json')
		return defaultSettingsFromServer
	}

	if (key === LocalStorage.DefaultFilters) {
		const defaultFilters = await serverRequest<CatalogSettings>('data/catalogSettings.json')
		return defaultFilters.filters
	}

	if (key === LocalStorage.SelectedItems) {
		return []
	}

	// playSelectedItems and SelectedItems different because play page requires special data structure for toys (ex id for every item)
	if (key === LocalStorage.playSelectedItems) {
		const selectedItems = JSON.parse(window.localStorage.getItem(LocalStorage.SelectedItems)!)

		if (!selectedItems) {
			const storedItems = await serverRequest<Item[]>('data/items.json')
			const firstTwentyItems = storedItems.slice(0, 20)
			const updatedSelectedItems = updateItemsArrayToSelected(firstTwentyItems)
			return updatedSelectedItems
		}

		const updatedSelectedItems = updateItemsArrayToSelected(selectedItems)
		return updatedSelectedItems
	}

	if (key === LocalStorage.PlaySettings) {
		const defaultPlaySettings = {
			activeScene: 1,
			activeTree: 2,
			activeLights: 4,
			isSnow: false,
			isMusic: false,
			isGarland: false,
			garlandColor: 'multicolor',
		}
		return defaultPlaySettings
	}

	const initialItemsFromServer = await serverRequest<Item[]>('data/items.json')
	return initialItemsFromServer
}

const getSnowflakes = () =>
	Array(SNOWFLAKES_COUNT)
		.fill(null)
		.map((value, index) => {
			const randomPaddingLeft = `${Math.random() * 10}px`
			const randomAnimationDuration = `${Math.random() * 5 + 3}s`
			const randomOpacity = Math.random() * 1
			const randomFontSize = `${Math.random() * (1 - 1.4) + 1.4}rem`
			const snowflake = { id: index, paddingLeft: randomPaddingLeft, animationDuration: randomAnimationDuration, opacity: randomOpacity, fontSize: randomFontSize }
			return snowflake
		})

const calculateGarlandOffset = (type: 'top' | 'left', index: number) => {
	if (type === 'top') {
		if (index <= 4) {
			return 5
		}
		if (index > 4 && index <= 12) {
			return 10
		}
		if (index > 12 && index <= 24) {
			return 15
		}
		if (index > 24 && index <= 38) {
			return 20
		}
		if (index > 38 && index <= 58) {
			return 22
		}
		if (index > 58 && index <= 80) {
			return 23
		}
	}

	if (index <= 4) {
		return 40
	}
	if (index > 4 && index <= 12) {
		return 20
	}
	if (index > 12 && index <= 24) {
		return -15
	}
	if (index > 24 && index <= 38) {
		return -60
	}
	if (index > 38 && index <= 58) {
		return -120
	}
	if (index > 58 && index <= 80) {
		return -200
	}

	return 0
}

const loadResources = async (arr: string[]) => {
	const loadResource = async (resource: string) => {
		const img = new Image()
		img.src = resource
		await img.decode()
	}

	await Promise.all(
		arr.map(async resource => {
			await loadResource(resource)
		})
	)
}

export {
	firstToUpperCase,
	searchOptions,
	filterArray,
	setData,
	getData,
	sortArray,
	searchArray,
	idToInitial,
	getSnowflakes,
	mergeSelectedAndOriginal,
	calculateGarlandOffset,
	loadResources,
}
