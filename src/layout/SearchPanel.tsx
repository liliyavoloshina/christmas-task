import { Component } from 'react'
import Multiselect from '../components/MultiSelect'
import Select from '../components/Select'
import Range from '../components/Range'
import '../styles/layout/__searchPanel.scss'

class SearchPanel extends Component {
	constructor(props: Readonly<{}>) {
		super(props)
		this.state = {}
	}

	render() {
		return (
			<div className="search-panel">
				<Select />
				<div className="selecting">
					<Multiselect type="shape" />
					<Multiselect type="color" />
					<Multiselect type="size" />
				</div>

				<div className="filtering">
					<Range type="amount" />
					{/* <div className="filter">
						<div className="filter__label">
							Amount: <span id="filter-amount-range" />
						</div>
						<div className="filter__slider">
							<div id="filter-amount" />
						</div>
					</div>
					<div className="filter">
						<div className="filter__label">
							Year: <span id="filter-year-range" />
						</div>
						<div className="filter__slider">
							<div id="filter-year" />
						</div>
					</div> */}
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
