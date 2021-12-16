/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/no-autofocus */
import '../styles/pages/__catalog.scss'
import React, { Component } from 'react'
import { Flipper, Flipped } from 'react-flip-toolkit'
import SearchPanel from '../layout/SearchPanel'
import Card from '../components/Card'
import Item from '../types/Item'
import Popup from '../components/Popup'
import Btn from '../components/Btn'
import Select from '../components/Select'
import Pagination from '../layout/Pagination'
import { CatalogSettings, CatalogFilters, SortKeys, CatalogFiltersValues, RadiusKeys } from '../types/Catalog'
import { FlippedProps, LocalStorage } from '../types/utils'
import { filterArray, getData, setData, sortArray, searchArray, FAVORITE_MAX_QUANTITY, mergeFavoriteAndOriginal } from '../utils/utils'
import Loader from '../components/Loader'

interface CatalogState {
	isLoaded: boolean
	settings: CatalogSettings
	search: string
	filteredItems: Item[]
	originalItems: Item[]
	favoriteItems: Item[]
	defaultFilters: CatalogFilters
	isPopupHidden: boolean
	isAnimated: boolean
	currentPage: number
}

class Catalog extends Component<{}, CatalogState> {
	constructor(props: Readonly<{}>) {
		super(props)
		this.state = {
			isLoaded: false,
			settings: {} as CatalogSettings,
			defaultFilters: {} as CatalogFilters,
			filteredItems: [],
			originalItems: [],
			favoriteItems: [],
			isPopupHidden: true,
			isAnimated: false,
			currentPage: 0,
			search: '',
		}
	}

	async componentDidMount() {
		const storedItems = await getData(LocalStorage.OriginalItems)
		const favoriteItems = await getData(LocalStorage.FavoriteItems)

		const storedSettings = await getData(LocalStorage.CatalogSettings)
		const defaultFilters = await getData(LocalStorage.DefaultFilters)

		this.setState({ originalItems: storedItems, settings: storedSettings, defaultFilters, favoriteItems }, () => {
			this.filter()
			this.setState({ isLoaded: true })
		})

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

	handleSort(key: SortKeys) {
		const { filteredItems, settings } = this.state
		settings.sort = key

		this.setState({ settings }, () => {
			this.sort(filteredItems, settings)
		})
	}

	handleFavorite(id: string, isFavorite: boolean) {
		const { settings, filteredItems, favoriteItems, originalItems } = this.state
		const { filters } = settings

		if (favoriteItems.length === FAVORITE_MAX_QUANTITY && isFavorite === true) {
			this.setState({ isPopupHidden: false })

			this.animate()

			setTimeout(() => {
				this.setState({ isPopupHidden: true })
			}, 4000)
			return
		}

		const checkedItem = originalItems.find(item => item.id === id)
		let updatedFavoriteItems = favoriteItems

		if (isFavorite === true) {
			updatedFavoriteItems.push(checkedItem!)
		} else {
			updatedFavoriteItems = updatedFavoriteItems.filter(item => item.id !== id)
		}

		const merged = mergeFavoriteAndOriginal(updatedFavoriteItems, filteredItems)

		this.setState({ favoriteItems: updatedFavoriteItems, filteredItems: merged, settings }, () => {
			// save favorite items, so favorites are tracking even on play page without reload
			setData<Item[]>(LocalStorage.FavoriteItems, updatedFavoriteItems)
		})

		if (filters.areOnlyFavorite) {
			const filtered = merged.filter(item => item.isFavorite === true)
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

	changeView(viewType: string) {
		const { settings } = this.state
		settings.isCardExpanded = viewType === 'list'
		this.setState({ settings })
	}

	clear() {
		const { originalItems, defaultFilters, settings } = this.state
		settings.filters = { ...defaultFilters }
		settings.isCardExpanded = false
		settings.sort = 'az'
		settings.itemsPerPage = 60
		this.setState({ favoriteItems: [], filteredItems: originalItems, settings, search: '' }, () => {
			this.filter()
		})
		window.localStorage.removeItem(LocalStorage.FavoriteItems)
		window.localStorage.removeItem(LocalStorage.CatalogSettings)
	}

	reset() {
		const { originalItems, favoriteItems, defaultFilters, settings } = this.state
		settings.filters = { ...defaultFilters }

		const merged = mergeFavoriteAndOriginal(favoriteItems, originalItems)

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
		const { originalItems, favoriteItems, settings } = this.state
		const { filters } = settings
		const merged = mergeFavoriteAndOriginal(favoriteItems, originalItems)
		const filtered = filterArray(merged, filters)
		this.sort(filtered, settings)
	}

	render() {
		const { isLoaded, filteredItems, favoriteItems, settings, search, isPopupHidden, isAnimated, currentPage } = this.state
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
					favoriteItemsQuantity={favoriteItems.length}
					onSort={(key: SortKeys) => this.handleSort(key)}
					onReset={() => this.reset()}
					onClear={() => this.clear()}
				/>

				<div className="items">
					<div className="additional-panel">
						<div className="additional-panel__change-view">
							<Btn onClick={() => this.changeView('grid')} accented={!isCardExpanded} icon="grid_view" form="square" title="change view" />
							<Btn onClick={() => this.changeView('list')} accented={isCardExpanded} icon="view_list" form="square" title="change view" />
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
										<Card
											flippedProps={flippedProps}
											isCardExpanded={isCardExpanded}
											onFavorite={(id, isFavorite) => this.handleFavorite(id, isFavorite)}
											key={item.id}
											{...item}
										/>
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
