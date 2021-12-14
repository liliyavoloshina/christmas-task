import Item from '../types/Item'
import { CatalogSettings, SortKeys, CatalogFilters } from '../types/Catalog'
import { LocalStorage } from '../types/utils'

const FAVORITE_MAX_QUANTITY = 5
const SNOWFLAKES_COUNT = 200

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

  return items.filter(item => isCorrectYear(item) && isCorrectAmount(item) && isCorrectShape(item) && isCorrectColor(item) && isCorrectSize(item) && isCorrectFavorite(item))
}

const sortArray = (array: Item[], key: SortKeys) => {
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


const idToInitial = (id: string) => id.split('-').slice(0, 1).join('')

const updateItemsArrayToFavorite = (arr: Item[]) => {
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

  if (key === LocalStorage.FavoriteItems) {
    return []
  }

  if (key === LocalStorage.PlayFavoriteItems) {
    const favoriteItems = JSON.parse(window.localStorage.getItem(LocalStorage.FavoriteItems)!)

    if (favoriteItems.length === 0) {
      const storedItems = JSON.parse(window.localStorage.getItem(LocalStorage.OriginalItems)!)
      const firstTwentyItems = storedItems.slice(0, 20)
      const updatedFavoriteItems = updateItemsArrayToFavorite(firstTwentyItems)
      return updatedFavoriteItems
    }

    const updatedFavoriteItems = updateItemsArrayToFavorite(favoriteItems)
    return updatedFavoriteItems
  }

  if (key === LocalStorage.PlaySettings) {
    const defaultPlaySettings = {
      activeScene: 1,
      activeTree: 2,
      activeLights: 4,
      isSnow: false,
      isMusic: false,
    }
    return defaultPlaySettings
  }

  const initialItemsFromServer = await serverRequest<Item[]>('data/items.json')
  return initialItemsFromServer
}

const getSnowflakes = () => Array(SNOWFLAKES_COUNT)
  .fill(null)
  .map((value, index) => {
    const randomPaddingLeft = `${Math.random() * 10}px`
    const randomAnimationDuration = `${Math.random() * 5 + 3}s`
    const randomOpacity = Math.random() * 1
    const randomFontSize = `${Math.random() * (1 - 1.4) + 1.4}rem`
    const snowflake = { id: index, paddingLeft: randomPaddingLeft, animationDuration: randomAnimationDuration, opacity: randomOpacity, fontSize: randomFontSize }
    return snowflake
  })

export { firstToUpperCase, searchOptions, filterArray, setData, getData, sortArray, searchArray, FAVORITE_MAX_QUANTITY, idToInitial, getSnowflakes }
