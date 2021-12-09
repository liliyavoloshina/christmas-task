import Item from '../types/Item'
import { CatalogSettings, SortKeys, CatalogFilters } from '../types/Catalog'

type DataKey = 'originalItems' | 'catalogSettings' | 'defaultFilters'

const FAVORITE_MAX_QUANTITY = 5

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

const serverRequest = async <T>(url: string): Promise<T> => {
  const req = await fetch(url)
  const res = await req.json()
  return res
}

const setData = <T>(key: DataKey, value: T) => {
  const stringified = JSON.stringify(value)
  window.localStorage.setItem(key, stringified)
}

const getData = async (key: DataKey) => {
  const stored = window.localStorage.getItem(key)

  if (stored) {
    return JSON.parse(stored)
  }

  if (key === 'catalogSettings') {
    const defaultSettingsFromServer = await serverRequest<CatalogSettings>('data/catalogSettings.json')
    return defaultSettingsFromServer
  }

  if (key === 'defaultFilters') {
    const defaultFilters = await serverRequest<CatalogSettings>('data/catalogSettings.json')
    return defaultFilters.filters
  }

  const initialItemsFromServer = await serverRequest<Item[]>('data/items.json')
  return initialItemsFromServer
}

export { firstToUpperCase, searchOptions, filterArray, setData, getData, sortArray, searchArray, FAVORITE_MAX_QUANTITY }
