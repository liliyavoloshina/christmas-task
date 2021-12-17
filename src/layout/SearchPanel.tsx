import '../styles/layout/__search-panel.scss'
import '../styles/components/__checkbox.scss'
import { Component } from 'react'
import Multiselect from '../components/Multiselect'
import Select from '../components/Select'
import Btn from '../components/Btn'
import Range from '../components/Range'
import { RangeOptions, CatalogFilters, CatalogFiltersValues, Colors, Sizes, Shapes, SortKeys, MultiselectOptions } from '../types/Catalog'

interface SearchPanelProps {
	filters: CatalogFilters
	sort: SortKeys
	selectedItemsQuantity: number
	onFilter(type: string, options: CatalogFiltersValues): void
	onSort(key: string): void
	onReset(): void
	onClear(): void
}

class SearchPanel extends Component<SearchPanelProps> {
	constructor(props: SearchPanelProps) {
		super(props)
		this.state = {}
	}

	handleFilter(type: string, prop: CatalogFiltersValues) {
		const { onFilter } = this.props
		onFilter(type, prop)
	}

	handleSort(key: SortKeys) {
		const { onSort } = this.props
		onSort(key)
	}

	render() {
		const shapeOptions = ['ball', 'figure', 'bell', 'cone', 'snowflake'] as MultiselectOptions
		const colorOptions = ['green', 'white', 'red', 'blue', 'yellow'] as MultiselectOptions
		const sizeOptions = ['large', 'medium', 'small'] as MultiselectOptions
		const { filters, sort, onReset, onClear, selectedItemsQuantity } = this.props
		const { year, amount, shape, color, size, areOnlySelected } = filters

		return (
			<div className="search-panel">
				<div className="selecting">
					<Select onSelect={(key: SortKeys) => this.handleSort(key)} initialSort={sort} type="sort" />
					<Multiselect type="shape" onFilter={(prop: Shapes[]) => this.handleFilter('shape', prop)} initialFilter={shape} options={shapeOptions} />
					<Multiselect type="color" onFilter={(prop: Colors[]) => this.handleFilter('color', prop)} initialFilter={color} options={colorOptions} />
					<Multiselect type="size" onFilter={(prop: Sizes[]) => this.handleFilter('size', prop)} initialFilter={size} options={sizeOptions} />
				</div>

				<div className="filtering">
					<Range type="year" onFilter={(prop: RangeOptions) => this.handleFilter('year', prop)} initialFilter={year} />
					<Range type="amount" onFilter={(prop: RangeOptions) => this.handleFilter('amount', prop)} initialFilter={amount} />
				</div>

				<div className="checkbox-only">
					<input
						onChange={() => this.handleFilter('areOnlySelected', !areOnlySelected)}
						className="checkbox"
						type="checkbox"
						id="only-selected"
						name="only-selected"
						value="Only selected"
						checked={areOnlySelected}
					/>
					<label className="checkbox-only__label search-panel-label" htmlFor="only-selected">
						Only selected ({selectedItemsQuantity})
					</label>
				</div>

				<div className="search-panel__actions">
					<Btn onClick={() => onReset()} text="Reset filters" size="lg" action="reset" />
					<Btn onClick={() => onClear()} text="Clear all" size="lg" action="clear" />
				</div>
			</div>
		)
	}
}

export default SearchPanel
