interface FlippedProps {
	[key: string]: string
}

enum LocalStorage {
	OriginalItems = 'originalItems',
	CatalogSettings = 'catalogSettings',
	DefaultFilters = 'defaultFilters',
	SelectedItems = 'selectedItems',
	PlaySettings = 'playSettings',
	PlaySelectedItems = 'playSelectedItems',
	PreviousWorks = 'previousWorks',
}

export { LocalStorage }
export type { FlippedProps }
