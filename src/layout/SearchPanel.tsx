import { Component } from 'react'
import Multiselect from '../components/MultiSelect'
import Select from '../components/Select'
import Range from '../components/Range'
import { RangeOptions, Filters, AllOptions, Colors, Sizes, Shapes, SortOptionsKeys } from '../types/Filter'
import '../styles/layout/__searchPanel.scss'
import '../styles/components/__checkbox.scss'

interface SearchPanelProps {
	filters: Filters
	sort: SortOptionsKeys
	onFilter(type: string, options: AllOptions): void
	onSort(key: string): void
}

class SearchPanel extends Component<SearchPanelProps> {
	constructor(props: SearchPanelProps) {
		super(props)
		this.state = {}
	}

	handleFilter(type: string, prop: AllOptions) {
		const { onFilter } = this.props
		onFilter(type, prop)
	}

	handleSort(key: string) {
		const { onSort } = this.props
		onSort(key)
	}

	render() {
		const { filters, sort } = this.props
		const { year, amount, shape, color, size, areOnlyFavorite } = filters

		return (
			<div className="search-panel">
				<div className="selecting">
					<Select onSelect={(key: string) => this.handleSort(key)} initialSort={sort} />
					<Multiselect type="shape" onFilter={(prop: Shapes[]) => this.handleFilter('shape', prop)} initialFilter={shape} />
					<Multiselect type="color" onFilter={(prop: Colors[]) => this.handleFilter('color', prop)} initialFilter={color} />
					<Multiselect type="size" onFilter={(prop: Sizes[]) => this.handleFilter('size', prop)} initialFilter={size} />
				</div>

				<div className="filtering">
					<Range type="year" onFilter={(prop: RangeOptions) => this.handleFilter('year', prop)} initialFilter={year} />
					<Range type="amount" onFilter={(prop: RangeOptions) => this.handleFilter('amount', prop)} initialFilter={amount} />
				</div>

				<div className="only-favorite">
					<input
						onChange={() => this.handleFilter('areOnlyFavorite', !areOnlyFavorite)}
						className="checkbox"
						type="checkbox"
						id="only-favorite"
						name="only-favorite"
						value="Only favorite"
						checked={areOnlyFavorite}
					/>
					<label className="only-favorite__label search-panel-label" htmlFor="only-favorite">
						Only favorite
					</label>
				</div>

				<div className="search-panel__actions">
					<button type="button" className="btn clear-filter">
						Clear
					</button>
					<button type="button" className="btn save-filter">
						Save
					</button>
				</div>
			</div>
		)
	}
}

export default SearchPanel
