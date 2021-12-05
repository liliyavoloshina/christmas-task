import { Component } from 'react'
import SearchPanel from '../layout/SearchPanel'
import Card from '../components/Card'
import Item from '../types/Item'
import '../styles/pages/__catalog.scss'
import RangeOptions from '../types/Filter'

interface CatalogState {
	items: Item[]
	original: Item[]
}

class Catalog extends Component<{}, CatalogState> {
	constructor(props: Readonly<{}>) {
		super(props)
		this.state = {
			items: [] as Item[],
			original: [] as Item[],
		}
	}

	async componentDidMount() {
		const req = await fetch('data.json')
		const res = await req.json()
		this.setState({ items: res, original: res })
	}

	handleFilter(options: RangeOptions, type: string) {
		const { original } = this.state
		const filtered = original.filter(item => item[type] >= options.min && item[type] <= options.max)
		this.setState({ items: filtered })
	}

	render() {
		const { items } = this.state
		return (
			<div className="catalog">
				<div className="search-bar">
					<input type="text" placeholder="Search..." className="search-bar__input" />
					<button type="button" className="search-bar__expand-btn">
						<span className="material-icons">search</span>
					</button>
				</div>

				<SearchPanel onFilter={(options: RangeOptions, type: string) => this.handleFilter(options, type)} />

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
