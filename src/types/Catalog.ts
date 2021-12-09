type Shapes = 'ball' | 'figure' | 'bell' | 'cone' | 'snowflake'
type Colors = 'green' | 'white' | 'red' | 'blue' | 'yellow'
type Sizes = 'large' | 'medium' | 'small'
type SortKeys = 'az' | 'za' | 'asc' | 'desc'
type MultiselectOptions = Shapes[] | Colors[] | Sizes[]
type CatalogSettingsValues = CatalogFilters | SortKeys | number | boolean
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
  [key: string]: SortKeys | string
}

interface CatalogFilters extends CatalogFiltersObject {
  year: RangeOptions
  amount: RangeOptions
  shape: Shapes[],
  color: Colors[],
  size: Sizes[],
  areOnlyFavorite: boolean,
}

interface CatalogSettings extends CatalogSettingsObject {
  filters: CatalogFilters
  sort: SortKeys,
  favoriteItemsQuantity: number,
  isCardExpanded: boolean
}

interface SortOptions extends SortOptionsObject {
  key: SortKeys
  text: string
}

export type { CatalogSettings, CatalogFilters, SortKeys, CatalogFiltersValues, MultiselectOptions, RangeOptions, Shapes, Colors, Sizes, SortOptions }