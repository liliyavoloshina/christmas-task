import '../styles/pages/__catalog.scss'
import React, { Component } from 'react'
import SearchPanel from '../layout/SearchPanel'
import Card from '../components/Card'
import Item from '../types/Item'
import { Filters, AllOptions, SortOptionsKeys } from '../types/Filter'
import { filterArray, getFromStorage, setToStorage, sortArray, searchArray, defaultFilters } from '../utils/utils'

interface CatalogState {
	isLoaded: boolean
	filteredItems: Item[]
	originalItems: Item[]
	filters: Filters
	sort: SortOptionsKeys
	search: string
}

class Catalog extends Component<{}, CatalogState> {
	private searchInput: React.RefObject<HTMLInputElement> = React.createRef()

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
		}
	}

	async componentDidMount() {
		const storedItems = getFromStorage('originalItems')
		const storedFilters = getFromStorage('filters')
		const storedSort = getFromStorage('sort')

		this.setState({ isLoaded: true, originalItems: storedItems, filters: storedFilters, sort: storedSort }, () => {
			this.filter()
		})
		this.searchInput.current?.focus()

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
		const { filteredItems, originalItems } = this.state
		const updatedOriginalItems = originalItems.map(item => (item.id === id ? { ...item, isFavorite } : item))
		const updatedFilteredItems = filteredItems.map(item => (item.id === id ? { ...item, isFavorite } : item))
		this.setState({ originalItems: updatedOriginalItems, filteredItems: updatedFilteredItems })
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
		const { isLoaded, filteredItems, filters, sort, search } = this.state
		const hasMatches = searchArray(filteredItems, search).length > 0

		if (!isLoaded) {
			return <div>Loading....</div>
		}

		return (
			<div className="catalog">
				<div className="search-bar">
					<input
						onInput={e => this.search(e)}
						type="search"
						placeholder="Search..."
						className="search-bar__input"
						ref={this.searchInput as React.RefObject<HTMLInputElement>}
						autoComplete="off"
					/>
				</div>

				<SearchPanel
					onFilter={(type: string, options) => this.handleFilter(type, options)}
					filters={filters}
					sort={sort}
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
