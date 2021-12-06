import { Component } from 'react'
import Multiselect from '../components/MultiSelect'
import Select from '../components/Select'
import Range from '../components/Range'
import '../styles/layout/__searchPanel.scss'
import { RangeOptions, Filters, AllOptions, Colors, Sizes, Shapes } from '../types/Filter'

interface SearchPanelProps {
	filters: Filters
	onFilter(options: AllOptions, type: string): void
}

class SearchPanel extends Component<SearchPanelProps> {
	constructor(props: SearchPanelProps) {
		super(props)
		this.state = {}
	}

	handleFilter(prop: AllOptions, type: string) {
		const { onFilter } = this.props

		onFilter(prop, type)
	}

	render() {
		const { filters } = this.props
		const { year, amount, shape, color, size } = filters

		return (
			<div className="search-panel">
				<Select />
				<div className="selecting">
					{/* how to type props more explicitly? */}
					<Multiselect type="shape" onFilter={(prop: Shapes[]) => this.handleFilter(prop, 'shape')} initialFilter={shape} />
					<Multiselect type="color" onFilter={(prop: Colors[]) => this.handleFilter(prop, 'color')} initialFilter={color} />
					<Multiselect type="size" onFilter={(prop: Sizes[]) => this.handleFilter(prop, 'size')} initialFilter={size} />
				</div>

				<div className="filtering">
					<Range type="year" onFilter={(prop: RangeOptions) => this.handleFilter(prop, 'year')} initialFilter={year} />
					<Range type="amount" onFilter={(prop: RangeOptions) => this.handleFilter(prop, 'amount')} initialFilter={amount} />
				</div>

				<div className="only-favorite">
					<input className="checkbox" type="checkbox" id="only-favorite" name="only-favorite" value="Only favorite" />
					<label htmlFor="only-favorite">Only favorite</label>
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
