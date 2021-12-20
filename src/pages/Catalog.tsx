import '../styles/pages/__catalog.scss'
import React, { Component } from 'react'
import { Flipper, Flipped } from 'react-flip-toolkit'
import SearchPanel from '../layout/SearchPanel'
import Card from '../components/Card'
import { Item } from '../types/Item'
import Popup from '../components/Popup'
import Btn from '../components/Btn'
import Select from '../components/Select'
import Pagination from '../layout/Pagination'
import { CatalogSettings, CatalogFilters, SortKey, CatalogFiltersValues, RadiusKeys, CatalogView } from '../types/Catalog'
import { FlippedProps, LocalStorage } from '../types/utils'
import { loadResources, mergeSelectedAndOriginal } from '../utils/utils'
import { getData, setData } from '../utils/data'
import { filterArray, sortArray, searchArray } from '../utils/filters'
import { SELECTED_MAX_QUANTITY } from '../utils/constants'
import Loader from '../components/Loader'

interface CatalogState {
	isLoaded: boolean
	settings: CatalogSettings
	search: string
	filteredItems: Item[]
	originalItems: Item[]
	selectedItems: Item[]
	defaultFilters: CatalogFilters
	isPopupHidden: boolean
	isAnimated: boolean
	currentPage: number
}

class Catalog extends Component<Record<string, never>, CatalogState> {
	constructor(props: Readonly<Record<string, never>>) {
		super(props)
		this.state = {
			isLoaded: false,
			settings: {} as CatalogSettings,
			defaultFilters: {} as CatalogFilters,
			filteredItems: [],
			originalItems: [],
			selectedItems: [],
			isPopupHidden: true,
			isAnimated: false,
			currentPage: 0,
			search: '',
		}
	}

	async componentDidMount() {
		const storedItems = await getData(LocalStorage.OriginalItems)
		const selectedItems = await getData(LocalStorage.SelectedItems)

		const storedSettings = await getData(LocalStorage.CatalogSettings)
		const defaultFilters = await getData(LocalStorage.DefaultFilters)

		this.setState({ originalItems: storedItems, settings: storedSettings, defaultFilters, selectedItems }, () => {
			this.filter()
		})

		const imagesToPreload = ['images/41.png', 'images/9.png', 'images/23.png', 'images/50.png', 'images/38.png', 'images/33.png', 'images/28.png', 'images/45.png', 'images/24.png']

		await loadResources(imagesToPreload)
		this.setState({ isLoaded: true })

		window.addEventListener('beforeunload', () => {
			const { settings } = this.state
			setData<CatalogSettings>(LocalStorage.CatalogSettings, settings)
		})
	}

	handleFilter(type: string, options: CatalogFiltersValues) {
		const { settings } = this.state
		settings.filters[type] = options
		this.setState({ settings }, () => {
			this.filter()
		})
	}

	handleSort(key: SortKey) {
		const { filteredItems, settings } = this.state
		settings.sort = key

		this.setState({ settings }, () => {
			this.sort(filteredItems, settings)
		})
	}

	handleSelect(id: string, isSelected: boolean) {
		const { settings, filteredItems, selectedItems, originalItems } = this.state
		const { filters } = settings

		if (selectedItems.length === SELECTED_MAX_QUANTITY && isSelected === true) {
			this.setState({ isPopupHidden: false })

			this.animate()

			setTimeout(() => {
				this.setState({ isPopupHidden: true })
			}, 4000)
			return
		}

		const checkedItem = originalItems.find(item => item.id === id)
		let updatedSelectedItems = selectedItems

		if (isSelected === true) {
			updatedSelectedItems.push(checkedItem!)
		} else {
			updatedSelectedItems = updatedSelectedItems.filter(item => item.id !== id)
		}

		const merged = mergeSelectedAndOriginal(updatedSelectedItems, filteredItems)

		this.setState({ selectedItems: updatedSelectedItems, filteredItems: merged, settings }, () => {
			// save favorite items, so favorites are tracking even on play page without reload
			setData<Item[]>(LocalStorage.SelectedItems, updatedSelectedItems)
		})

		if (filters.areOnlySelected) {
			const filtered = merged.filter(item => item.isSelected === true)
			this.setState({ filteredItems: filtered })

			this.animate()
		}
	}

	handlePageChange(pageNum: number) {
		this.setState({ currentPage: pageNum })
	}

	changePaginationLimits(key: RadiusKeys) {
		const { settings } = this.state
		settings.itemsPerPage = key
		this.setState({ settings })
		this.handlePageChange(0)
	}

	animate() {
		const { isAnimated } = this.state
		this.setState({ isAnimated: !isAnimated })
	}

	changeView(viewType: CatalogView) {
		const { settings } = this.state
		settings.isCardExpanded = viewType === CatalogView.List
		this.setState({ settings })
	}

	clear() {
		const { originalItems, defaultFilters, settings } = this.state
		settings.filters = { ...defaultFilters }
		settings.isCardExpanded = false
		settings.sort = SortKey.Az
		settings.itemsPerPage = 60
		this.setState({ selectedItems: [], filteredItems: originalItems, settings, search: '' }, () => {
			this.filter()
		})
		window.localStorage.removeItem(LocalStorage.SelectedItems)
		window.localStorage.removeItem(LocalStorage.CatalogSettings)
	}

	reset() {
		const { originalItems, selectedItems, defaultFilters, settings } = this.state
		settings.filters = { ...defaultFilters }

		const merged = mergeSelectedAndOriginal(selectedItems, originalItems)

		this.setState({ settings, filteredItems: merged }, () => {
			this.sort(merged, settings)
		})
	}

	search(e: React.SyntheticEvent) {
		const { value } = e.target as HTMLInputElement
		this.setState({ search: value })

		this.animate()
	}

	sort(toSort: Item[], settings: CatalogSettings) {
		const { sort } = settings
		const sorted = sortArray(toSort, sort)
		this.setState({ filteredItems: sorted })

		this.animate()
	}

	// will fire sort every time, so filtered items remain sorted
	filter() {
		const { originalItems, selectedItems, settings } = this.state
		const { filters } = settings
		const merged = mergeSelectedAndOriginal(selectedItems, originalItems)
		const filtered = filterArray(merged, filters)
		this.sort(filtered, settings)
	}

	render() {
		const { isLoaded, filteredItems, selectedItems, settings, search, isPopupHidden, isAnimated, currentPage } = this.state
		const { filters, sort, itemsPerPage, isCardExpanded } = settings

		const hasMatches = searchArray(filteredItems, search).length > 0
		const springConfig = { stiffness: 2000, damping: 300, mass: 3 }

		const pageSliceFrom = currentPage === 0 ? 0 : currentPage * itemsPerPage

		if (!isLoaded) {
			return <Loader />
		}

		return (
			<div className="catalog">
				<Popup text="Sorry, all slots are full!" isHidden={isPopupHidden} />
				<div className="search-bar">
					<input onInput={e => this.search(e)} value={search} autoFocus type="search" placeholder="Search..." className="search-bar__input" autoComplete="off" />
				</div>

				<SearchPanel
					onFilter={(type: string, options) => this.handleFilter(type, options)}
					filters={filters}
					sort={sort}
					selectedItemsQuantity={selectedItems.length}
					onSort={(key: SortKey) => this.handleSort(key)}
					onReset={() => this.reset()}
					onClear={() => this.clear()}
				/>

				<div className="items">
					<div className="additional-panel">
						<div className="additional-panel__change-view">
							<Btn onClick={() => this.changeView(CatalogView.Grid)} accented={!isCardExpanded} icon="grid_view" form="square" title="change view" />
							<Btn onClick={() => this.changeView(CatalogView.List)} accented={isCardExpanded} icon="view_list" form="square" title="change view" />
						</div>
						<div className="additional-panel__text">
							<Select type="pagination" initialSort={itemsPerPage} onSelect={(key: RadiusKeys) => this.changePaginationLimits(key)} />
						</div>
					</div>

					<div className={`no-matches-message ${hasMatches ? 'hidden' : ''}`}>
						<div className="no-matches-message__first">No matches found!</div>
						<div className="no-matches-message__second">Try something else</div>
					</div>

					<Flipper className={`items__list${isCardExpanded ? ' expanded' : ''}`} flipKey={isAnimated} spring={springConfig}>
						{searchArray(filteredItems, search)
							.slice(pageSliceFrom, pageSliceFrom + itemsPerPage)
							.map(item => (
								<Flipped key={item.id} flipId={item.id}>
									{(flippedProps: FlippedProps) => (
										<Card flippedProps={flippedProps} isCardExpanded={isCardExpanded} onSelect={(id, isSelected) => this.handleSelect(id, isSelected)} key={item.id} {...item} />
									)}
								</Flipped>
							))}
					</Flipper>

					<Pagination onPageChanged={(page: number) => this.handlePageChange(page)} currentPage={currentPage} totalItems={filteredItems.length} itemsPerPage={+itemsPerPage} />
				</div>
			</div>
		)
	}
}

export default Catalog
