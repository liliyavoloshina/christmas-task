import { CatalogSettings } from '../types/Catalog'
import { Item } from '../types/Item'
import { GarlandColor } from '../types/Play'
import { LocalStorage } from '../types/utils'

const serverRequest = async <T>(url: string): Promise<T> => {
	const req = await fetch(url)
	const res = await req.json()
	return res
}

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

	// difference between PlaySelectedItems and SelectedItems in structure (ex PlaySelectedItems has id and coords)
	if (key === LocalStorage.PlaySelectedItems) {
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
			garlandColor: GarlandColor.Multicolor,
		}
		return defaultPlaySettings
	}

	const initialItemsFromServer = await serverRequest<Item[]>('data/items.json')
	return initialItemsFromServer
}

export { setData, getData }