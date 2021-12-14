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
import { filterArray, getData, setData, sortArray, searchArray, FAVORITE_MAX_QUANTITY } from '../utils/utils'

interface CatalogState {
	isLoaded: boolean
	settings: CatalogSettings
	search: string
	filteredItems: Item[]
	originalItems: Item[]
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
			filteredItems: [],
			originalItems: [],
			defaultFilters: {} as CatalogFilters,
			isPopupHidden: true,
			isAnimated: false,
			search: '',
		}
	}

	async componentDidMount() {
		const storedItems = await getData(LocalStorage.OriginalItems)
		const storedSettings = await getData(LocalStorage.CatalogSettings)
		const defaultFilters = await getData(LocalStorage.DefaultFilters)

		this.setState({ originalItems: storedItems, settings: storedSettings, defaultFilters }, async () => {
			await this.filter()
			await this.sort()
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
		const { settings } = this.state
		settings.sort = key

		this.setState({ settings }, () => {
			this.sort()
		})
	}

	handleFavorite(id: string, isFavorite: boolean) {
		const { settings, filteredItems, originalItems, isAnimated } = this.state
		const { filters, favoriteItemsQuantity } = settings

		if (favoriteItemsQuantity === FAVORITE_MAX_QUANTITY && isFavorite === true) {
			this.setState({ isPopupHidden: false, isAnimated: !isAnimated })
			setTimeout(() => {
				this.setState({ isPopupHidden: true })
			}, 4000)
			return
		}

		const updatedOriginalItems = originalItems.map(item => (item.id === id ? { ...item, isFavorite } : item))
		const updatedFilteredItems = filteredItems.map(item => (item.id === id ? { ...item, isFavorite } : item))
		const updatedFavoriteItemsQuantity = isFavorite ? favoriteItemsQuantity + 1 : favoriteItemsQuantity - 1

		settings.favoriteItemsQuantity = updatedFavoriteItemsQuantity

		this.setState({ originalItems: updatedOriginalItems, filteredItems: updatedFilteredItems, settings, isAnimated: !isAnimated }, () => {
			// save original items, so favorites are tracking even on play page without reload
			setData<Item[]>(LocalStorage.OriginalItems, updatedOriginalItems)
			// and favorite item's quantity - updated on time (maybe use "global state"?)
			setData<CatalogSettings>(LocalStorage.CatalogSettings, settings)
		})

		if (filters.areOnlyFavorite) {
			const filterd = updatedFilteredItems.filter(item => item.isFavorite === true)
			this.setState({ filteredItems: filterd, isAnimated: !isAnimated })
		}
	}

	async filter() {
		const { originalItems, settings, isAnimated } = this.state
		const { filters } = settings
		const filtered = await filterArray(originalItems, filters)
		this.setState({ filteredItems: filtered, isAnimated: !isAnimated })
	}

	async sort() {
		const { filteredItems, settings, isAnimated } = this.state
		const { sort } = settings
		const sorted = await sortArray(filteredItems, sort)
		this.setState({ filteredItems: sorted, isAnimated: !isAnimated })
	}

	search(e: React.SyntheticEvent) {
		const { isAnimated } = this.state
		const { value } = e.target as HTMLInputElement
		this.setState({ search: value, isAnimated: !isAnimated })
	}

	async clear() {
		const { originalItems, defaultFilters, isAnimated, settings } = this.state
		settings.filters = { ...defaultFilters }

		this.setState({ settings, filteredItems: originalItems, isAnimated: !isAnimated }, async () => {
			await this.sort()
		})
	}

	changeView(viewType: string) {
		const { settings } = this.state
		settings.isCardExpanded = viewType === 'list'
		this.setState({ settings })
	}

	render() {
		const { isLoaded, filteredItems, settings, search, isPopupHidden, isAnimated } = this.state
		const { filters, sort, favoriteItemsQuantity, isCardExpanded } = settings
		const hasMatches = searchArray(filteredItems, search).length > 0
		const springConfig = { stiffness: 2000, damping: 300, mass: 3 }

		if (!isLoaded) {
			return <div>Loading....</div>
		}

		return (
			<div className="catalog">
				<Popup text="Sorry, all slots are full!" isHidden={isPopupHidden} />
				<div className="search-bar">
					<input onInput={e => this.search(e)} autoFocus type="search" placeholder="Search..." className="search-bar__input" autoComplete="off" />
				</div>

				<SearchPanel
					onFilter={(type: string, options) => this.handleFilter(type, options)}
					filters={filters}
					sort={sort}
					favoriteItemsQuantity={favoriteItemsQuantity}
					onSort={(key: SortKeys) => this.handleSort(key)}
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
