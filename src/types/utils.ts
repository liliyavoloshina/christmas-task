interface FlippedProps {
	[key: string]: string
}

enum LocalStorage {
	OriginalItems = 'originalItems',
	CatalogSettings = 'catalogSettings',
	DefaultFilters = 'defaultFilters',
	SelectedItems = 'selectedItems',
	PlaySettings = 'playSettings',
	playSelectedItems = 'playSelectedItems',
}

export { LocalStorage }
export type { FlippedProps }
