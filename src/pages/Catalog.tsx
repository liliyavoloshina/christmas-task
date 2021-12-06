import { Component } from 'react'
import SearchPanel from '../layout/SearchPanel'
import Card from '../components/Card'
import Item from '../types/Item'
import '../styles/pages/__catalog.scss'
import { Filters, RangeOptions } from '../types/Filter'
// import { filterArray, setToStorage } from '../utils/utils'
import { filterArray, getFromStorage, setToStorage } from '../utils/utils'

interface CatalogState {
	isLoaded: boolean
	items: Item[]
	original: Item[]
	filters: Filters
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
			},
			// eslint-disable-next-line react/no-unused-state
			items: [] as Item[],
			original: [] as Item[],
		}
	}

	async componentDidMount() {
		const req = await fetch('data.json')
		const res = await req.json()
		const storedFilters = await getFromStorage('filters')
		this.setState({ isLoaded: true, items: res, original: res, filters: storedFilters })

		window.addEventListener('beforeunload', () => {
			const { filters } = this.state

			setToStorage<Filters>('filters', filters)
		})
	}

	handleFilter(options: RangeOptions, type: string) {
		const { filters } = this.state
		filters[type] = options
		this.setState({ filters }, () => {
			this.filter()
		})
	}

	filter() {
		const { filters } = this.state
		const { original } = this.state
		const filtered = filterArray(original, filters)
		this.setState({ items: filtered })
	}

	render() {
		const { isLoaded, items, filters } = this.state

		if (!isLoaded) {
			return <div>Loading....</div>
		}
		return (
			<div className="catalog">
				<div className="search-bar">
					<input type="text" placeholder="Search..." className="search-bar__input" />
					<button type="button" className="search-bar__expand-btn">
						<span className="material-icons">search</span>
					</button>
				</div>

				<SearchPanel onFilter={(options: RangeOptions, type: string) => this.handleFilter(options, type)} filters={filters} />

				<div className="items">
					<div className="items__title">Christmas Toys</div>
					<div className="items__list">
						{items.map(item => (
							<Card key={item.id} {...item} />
						))}
					</div>
				</div>
			</div>
		)
	}
}

export default Catalog
