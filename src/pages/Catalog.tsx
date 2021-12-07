import '../styles/pages/__catalog.scss'
import { Component } from 'react'
import SearchPanel from '../layout/SearchPanel'
import Card from '../components/Card'
import Item from '../types/Item'
import { Filters, AllOptions, SortOptionsKeys } from '../types/Filter'
import { filterArray, getFromStorage, setToStorage, sortArray, searchArray } from '../utils/utils'

interface CatalogState {
	isLoaded: boolean
	items: Item[]
	original: Item[]
	filters: Filters
	sort: SortOptionsKeys
	search: string
}

class Catalog extends Component<{}, CatalogState> {
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
			items: [],
			original: [],
		}
	}

	async componentDidMount() {
		const req = await fetch('data.json')
		const res = await req.json()
		const storedFilters = getFromStorage('filters')
		const storedSort = getFromStorage('sort')

		this.setState({ isLoaded: true, original: res, filters: storedFilters, sort: storedSort })
		this.filter()

		window.addEventListener('beforeunload', () => {
			const { filters, sort } = this.state

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

	filter() {
		const { filters } = this.state
		const { original } = this.state
		const filtered = filterArray(original, filters)
		this.setState({ items: filtered })
	}

	sort() {
		const { items, sort } = this.state
		const sorted = sortArray(items, sort)
		this.setState({ items: sorted! })
	}

	search(e: React.SyntheticEvent) {
		const { value } = e.target as HTMLInputElement
		this.setState({ search: value })
	}

	render() {
		const { isLoaded, items, filters, sort, search } = this.state
		const hasMatches = searchArray(items, search).length > 0

		if (!isLoaded) {
			return <div>Loading....</div>
		}

		return (
			<div className="catalog">
				<div className="search-bar">
					<input onInput={e => this.search(e)} type="search" placeholder="Search..." className="search-bar__input" ref={input => input && input.focus()} autoComplete="off" />
				</div>

				<SearchPanel onFilter={(type: string, options) => this.handleFilter(type, options)} filters={filters} sort={sort} onSort={(key: SortOptionsKeys) => this.handleSort(key)} />

				<div className="items">
					<div className={`no-matches-message ${hasMatches ? 'hidden' : null}`}>
						<div className="no-matches-message__first">No matches found!</div>
						<div className="no-matches-message__second">Try something else</div>
					</div>

					<div className="items__list">
						{searchArray(items, search).map(item => (
							<Card key={item.id} {...item} />
						))}
					</div>
				</div>
			</div>
		)
	}
}

export default Catalog
