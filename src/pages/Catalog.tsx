import '../styles/pages/__catalog.scss'
import React, { Component } from 'react'
import { Flipper, Flipped } from 'react-flip-toolkit'
import SearchPanel from '../layout/SearchPanel'
import Card from '../components/Card'
import Item from '../types/Item'
import Popup from '../components/Popup'
import Btn from '../components/Btn'
import { Filters, AllOptions, SortOptionsKeys } from '../types/Filter'
import { FlippedProps } from '../types/utils'
import { filterArray, getFromStorage, setToStorage, sortArray, searchArray, defaultFilters, FAVORITE_MAX_QUANTITY } from '../utils/utils'

interface CatalogState {
	isLoaded: boolean
	filters: Filters
	sort: SortOptionsKeys
	search: string
	filteredItems: Item[]
	originalItems: Item[]
	favoriteItemsQuantity: number
	isPopupHidden: boolean
	isAnimated: boolean
	isCardExpanded: boolean
}

class Catalog extends Component<{}, CatalogState> {
	private searchInput: React.RefObject<HTMLInputElement>

	constructor(props: Readonly<{}>) {
		super(props)
		this.state = {
			isLoaded: false,
			filters: {
				year: {
					min: 1940,
					max: 2020,
				},
				amount: {
					min: 1,
					max: 12,
				},
				shape: ['ball', 'figure', 'bell', 'cone', 'snowflake'],
				color: ['green', 'white', 'red', 'blue', 'yellow'],
				size: ['large', 'medium', 'small'],
				areOnlyFavorite: false,
			},
			sort: 'az',
			search: '',
			filteredItems: [],
			originalItems: [],
			favoriteItemsQuantity: 0,
			isPopupHidden: true,
			isAnimated: false,
			isCardExpanded: false,
		}
		this.searchInput = React.createRef()
	}

	async componentDidMount() {
		const storedItems = getFromStorage('originalItems')
		const storedFilters = getFromStorage('filters')
		const storedSort = getFromStorage('sort')
		const favoriteItemsQuantity = storedItems.filter((item: Item) => item.isFavorite === true).length

		this.setState({ isLoaded: true, originalItems: storedItems, filters: storedFilters, sort: storedSort, favoriteItemsQuantity }, () => {
			this.filter()
			this.focusInput()
		})

		window.addEventListener('beforeunload', () => {
			const { filters, sort, originalItems } = this.state

			setToStorage<Item[]>('originalItems', originalItems)
			setToStorage<Filters>('filters', filters)
			setToStorage<SortOptionsKeys>('sort', sort)
		})
	}

	handleFilter(type: string, options: AllOptions) {
		const { filters } = this.state

		filters[type] = options

		this.setState({ filters }, () => {
			this.filter()
		})
	}

	handleSort(key: SortOptionsKeys) {
		this.setState({ sort: key }, () => {
			this.sort()
		})
	}

	handleFavorite(id: string, isFavorite: boolean) {
		const { filteredItems, originalItems, favoriteItemsQuantity, isAnimated, filters } = this.state

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

		this.setState({ originalItems: updatedOriginalItems, filteredItems: updatedFilteredItems, favoriteItemsQuantity: updatedFavoriteItemsQuantity, isAnimated: !isAnimated })

		if (filters.areOnlyFavorite) {
			const filterd = updatedFilteredItems.filter(item => item.isFavorite === true)
			this.setState({ filteredItems: filterd, isAnimated: !isAnimated })
		}
	}

	focusInput() {
		this.searchInput.current?.focus()
	}

	filter() {
		const { filters, isAnimated } = this.state
		const { originalItems } = this.state
		const filtered = filterArray(originalItems, filters)
		this.setState({ filteredItems: filtered, isAnimated: !isAnimated })
	}

	sort() {
		const { filteredItems, sort, isAnimated } = this.state
		const sorted = sortArray(filteredItems, sort)
		this.setState({ filteredItems: sorted!, isAnimated: !isAnimated })
	}

	search(e: React.SyntheticEvent) {
		const { isAnimated } = this.state
		const { value } = e.target as HTMLInputElement
		this.setState({ search: value, isAnimated: !isAnimated })
	}

	clear() {
		const { originalItems, isAnimated } = this.state
		this.setState({ filters: { ...defaultFilters }, filteredItems: originalItems, isAnimated: !isAnimated })
	}

	// eslint-disable-next-line class-methods-use-this
	changeView(viewType: string) {
		const isExpanded = viewType === 'list'
		this.setState({ isCardExpanded: isExpanded })
	}

	render() {
		const { isLoaded, filteredItems, filters, sort, search, favoriteItemsQuantity, isPopupHidden, isAnimated, isCardExpanded } = this.state
		const hasMatches = searchArray(filteredItems, search).length > 0
		const springConfig = { stiffness: 1900, damping: 500, mass: 3 }

		if (!isLoaded) {
			return <div>Loading....</div>
		}

		return (
			<div className="catalog">
				<Popup text="Sorry, all slots are full!" isHidden={isPopupHidden} />
				<div className="search-bar">
					<input onInput={e => this.search(e)} type="search" placeholder="Search..." className="search-bar__input" ref={this.searchInput} autoComplete="off" />
				</div>

				<SearchPanel
					onFilter={(type: string, options) => this.handleFilter(type, options)}
					filters={filters}
					sort={sort}
					favoriteItemsQuantity={favoriteItemsQuantity}
					onSort={(key: SortOptionsKeys) => this.handleSort(key)}
					onClear={() => this.clear()}
				/>

				<div className="items">
					<div className="additional-panel">
						<div className="additional-panel__change-view">
							<Btn onClick={() => this.changeView('grid')} icon="grid_view" />
							<Btn onClick={() => this.changeView('list')} icon="view_list" />
						</div>
						<div className="additional-panel__text">Toys found: {filteredItems.length}</div>
					</div>
					<div className={`no-matches-message ${hasMatches ? 'hidden' : null}`}>
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
