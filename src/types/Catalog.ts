import { ItemColor, ItemShape, ItemSize } from './Item'

enum SortKey {
	Az = 'az',
	Za = 'za',
	Asc = 'asc',
	Desc = 'desc',
}

enum CatalogView {
	List = 'list',
	Grid = 'grid',
}

enum MultiselectOption {
	Shape = 'shape',
	Color = 'color',
	Size = 'size',
}

type RadiusKeys = 5 | 10 | 20 | 30 | 60
type MultiselectOptions = ItemShape[] | ItemColor[] | ItemSize[]
type CatalogSettingsValues = CatalogFilters | SortKey | number | boolean | RadiusKeys
type CatalogFiltersValues = RangeOptions | MultiselectOptions | boolean

interface RangeOptions {
	min: number
	max: number
}

interface CatalogSettingsObject {
	[key: string]: CatalogSettingsValues
}

interface CatalogFiltersObject {
	[key: string]: RangeOptions | MultiselectOptions | boolean
}

interface SortOptionsObject {
	[key: string]: string | number
}

interface CatalogFilters extends CatalogFiltersObject {
	year: RangeOptions
	amount: RangeOptions
	shape: ItemShape[]
	color: ItemColor[]
	size: ItemSize[]
	areOnlyFavorite: boolean
	areOnlySelected: boolean
}

interface CatalogSettings extends CatalogSettingsObject {
	filters: CatalogFilters
	sort: SortKey
	itemsPerPage: RadiusKeys
	isCardExpanded: boolean
}

interface SortOptions extends SortOptionsObject {
	key: string | number
	text: string
}

interface PaginationData {
	currentPage: number
	pageLimit: number
	totalItems: number
	totalPages: number
}

export type { CatalogSettings, CatalogFilters, CatalogFiltersValues, MultiselectOptions, RangeOptions, SortOptions, RadiusKeys, PaginationData }

export { SortKey, CatalogView, MultiselectOption }
