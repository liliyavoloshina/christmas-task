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
import { CatalogSettings, CatalogFilters, SortKeys, CatalogFiltersValues } from '../types/Catalog'
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
		const { filteredItems, settings, isAnimated } = this.state
		settings.sort = key

		this.setState({ settings }, () => {
			this.sort(filteredItems, settings, isAnimated)
		})
	}

	handleFavorite(id: string, isFavorite: boolean) {
		const { settings, filteredItems, favoriteItems, originalItems, isAnimated } = this.state
		const { filters } = settings

		if (favoriteItems.length === FAVORITE_MAX_QUANTITY && isFavorite === true) {
			this.setState({ isPopupHidden: false, isAnimated: !isAnimated })
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
			this.setState({ filteredItems: filtered, isAnimated: !isAnimated })
		}
	}

	// will fire sort every time, so filtered items remain sorted
	filter() {
		const { originalItems, favoriteItems, settings, isAnimated } = this.state
		const { filters } = settings
		const merged = mergeFavoriteAndOriginal(favoriteItems, originalItems)
		const filtered = filterArray(merged, filters)
		this.sort(filtered, settings, isAnimated)
	}

	sort(toSort: Item[], settings: CatalogSettings, isAnimated: boolean) {
		const { sort } = settings
		const sorted = sortArray(toSort, sort)
		this.setState({ filteredItems: sorted, isAnimated: !isAnimated })
	}

	search(e: React.SyntheticEvent) {
		const { isAnimated } = this.state
		const { value } = e.target as HTMLInputElement
		this.setState({ search: value, isAnimated: !isAnimated })
	}

	reset() {
		const { originalItems, defaultFilters, isAnimated, settings } = this.state
		settings.filters = { ...defaultFilters }

		this.setState({ settings, filteredItems: originalItems }, () => {
			this.sort(originalItems, settings, isAnimated)
		})
	}

	clear() {
		const { originalItems, defaultFilters, settings } = this.state
		settings.filters = { ...defaultFilters }
		settings.isCardExpanded = false
		settings.sort = 'az'
		this.setState({ favoriteItems: [], filteredItems: originalItems, settings, search: '' }, () => {
			this.filter()
		})
		window.localStorage.removeItem(LocalStorage.FavoriteItems)
		window.localStorage.removeItem(LocalStorage.CatalogSettings)
	}

	changeView(viewType: string) {
		const { settings } = this.state
		settings.isCardExpanded = viewType === 'list'
		this.setState({ settings })
	}

	render() {
		const { isLoaded, filteredItems, favoriteItems, settings, search, isPopupHidden, isAnimated } = this.state
		const { filters, sort, isCardExpanded } = settings
		const hasMatches = searchArray(filteredItems, search).length > 0
		const springConfig = { stiffness: 2000, damping: 300, mass: 3 }

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
						<div className="additional-panel__text">Toys found: {filteredItems.length}</div>
					</div>
					<div className={`no-matches-message ${hasMatches ? 'hidden' : ''}`}>
						<div className="no-matches-message__first">No matches found!</div>
						<div className="no-matches-message__second">Try something else</div>
					</div>

					<Flipper className={`items__list${isCardExpanded ? ' expanded' : ''}`} flipKey={isAnimated} spring={springConfig}>
						{searchArray(filteredItems, search).map(item => (
							<Flipped key={item.id} flipId={item.id}>
								{(flippedProps: FlippedProps) => (
									<Card flippedProps={flippedProps} isCardExpanded={isCardExpanded} onFavorite={(id, isFavorite) => this.handleFavorite(id, isFavorite)} key={item.id} {...item} />
								)}
							</Flipped>
						))}
					</Flipper>
				</div>
			</div>
		)
	}
}

export default Catalog
