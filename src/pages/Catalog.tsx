import '../styles/pages/__catalog.scss'
import React, { Component } from 'react'
import SearchPanel from '../layout/SearchPanel'
import Card from '../components/Card'
import Item from '../types/Item'
import Popup from '../components/Popup'
import { Filters, AllOptions, SortOptionsKeys } from '../types/Filter'
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
		const { filteredItems, originalItems, favoriteItemsQuantity } = this.state

		if (favoriteItemsQuantity === FAVORITE_MAX_QUANTITY && isFavorite === true) {
			this.setState({ isPopupHidden: false })
			setTimeout(() => {
				this.setState({ isPopupHidden: true })
			}, 4000)
			return
		}

		const updatedOriginalItems = originalItems.map(item => (item.id === id ? { ...item, isFavorite } : item))
		const updatedFilteredItems = filteredItems.map(item => (item.id === id ? { ...item, isFavorite } : item))
		const updatedFavoriteItemsQuantity = isFavorite ? favoriteItemsQuantity + 1 : favoriteItemsQuantity - 1
		this.setState({ originalItems: updatedOriginalItems, filteredItems: updatedFilteredItems, favoriteItemsQuantity: updatedFavoriteItemsQuantity })
	}

	focusInput() {
		this.searchInput.current?.focus()
	}

	filter() {
		const { filters } = this.state
		const { originalItems } = this.state
		const filtered = filterArray(originalItems, filters)
		this.setState({ filteredItems: filtered })
	}

	sort() {
		const { filteredItems, sort } = this.state
		const sorted = sortArray(filteredItems, sort)
		this.setState({ filteredItems: sorted! })
	}

	search(e: React.SyntheticEvent) {
		const { value } = e.target as HTMLInputElement
		this.setState({ search: value })
	}

	clear() {
		const { originalItems } = this.state
		this.setState({ filters: defaultFilters, filteredItems: originalItems })
	}

	render() {
		const { isLoaded, filteredItems, filters, sort, search, favoriteItemsQuantity, isPopupHidden } = this.state
		const hasMatches = searchArray(filteredItems, search).length > 0

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
					<div className={`no-matches-message ${hasMatches ? 'hidden' : null}`}>
						<div className="no-matches-message__first">No matches found!</div>
						<div className="no-matches-message__second">Try something else</div>
					</div>

					<div className="items__list">
						{searchArray(filteredItems, search).map(item => (
							<Card onFavorite={(id, isFavorite) => this.handleFavorite(id, isFavorite)} key={item.id} {...item} />
						))}
					</div>
				</div>
			</div>
		)
	}
}

export default Catalog
