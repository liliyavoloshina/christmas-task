interface FlippedProps {
  [key: string]: string
}

enum LocalStorage {
  OriginalItems = 'originalItems',
  CatalogSettings = 'catalogSettings',
  DefaultFilters = 'defaultFilters',
  FavoriteItems = 'favoriteItems',
  PlaySettings = 'playSettings',
}

export { LocalStorage }
export type { FlippedProps }
