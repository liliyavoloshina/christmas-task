type Shapes = 'ball' | 'figure' | 'bell' | 'cone' | 'snowflake'
type Colors = 'green' | 'white' | 'red' | 'blue' | 'yellow'
type Sizes = 'large' | 'medium' | 'small'
type SortKeys = 'az' | 'za' | 'asc' | 'desc'
type RadiusKeys = 5 | 10 | 20 | 30 | 60
type MultiselectOptions = Shapes[] | Colors[] | Sizes[]
type CatalogSettingsValues = CatalogFilters | SortKeys | number | boolean | RadiusKeys
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
	// [key: string]: SortKeys | string | RadiusKeys
}

interface CatalogFilters extends CatalogFiltersObject {
	year: RangeOptions
	amount: RangeOptions
	shape: Shapes[]
	color: Colors[]
	size: Sizes[]
	areOnlyFavorite: boolean
	areOnlySelected: boolean
}

interface CatalogSettings extends CatalogSettingsObject {
	filters: CatalogFilters
	sort: SortKeys
	itemsPerPage: RadiusKeys
	isCardExpanded: boolean
}

interface SortOptions extends SortOptionsObject {
	key: string | number
	// key: SortKeys | RadiusKeys | string
	text: string
}

interface PaginationData {
	currentPage: number
	pageLimit: number
	totalItems: number
	totalPages: number
}

export type { CatalogSettings, CatalogFilters, SortKeys, CatalogFiltersValues, MultiselectOptions, RangeOptions, Shapes, Colors, Sizes, SortOptions, RadiusKeys, PaginationData }
