import { Component } from 'react'
import Multiselect from '../components/Multiselect'
import Select from '../components/Select'
import Range from '../components/Range'
import { RangeOptions, CatalogFilters, CatalogFiltersValues, Colors, Sizes, Shapes, SortKeys, MultiselectOptions } from '../types/Catalog'
import '../styles/layout/__searchPanel.scss'
import '../styles/components/__checkbox.scss'
import Btn from '../components/Btn'

interface SearchPanelProps {
	filters: CatalogFilters
	sort: SortKeys
	favoriteItemsQuantity: number
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

	handleSort(key: string) {
		const { onSort } = this.props
		onSort(key)
	}

	render() {
		const shapeOptions = ['ball', 'figure', 'bell', 'cone', 'snowflake'] as MultiselectOptions
		const colorOptions = ['green', 'white', 'red', 'blue', 'yellow'] as MultiselectOptions
		const sizeOptions = ['large', 'medium', 'small'] as MultiselectOptions
		const { filters, sort, onReset, onClear, favoriteItemsQuantity } = this.props
		const { year, amount, shape, color, size, areOnlyFavorite } = filters

		return (
			<div className="search-panel">
				<div className="selecting">
					<Select onSelect={(key: string) => this.handleSort(key)} initialSort={sort} />
					<Multiselect type="shape" onFilter={(prop: Shapes[]) => this.handleFilter('shape', prop)} initialFilter={shape} options={shapeOptions} />
					<Multiselect type="color" onFilter={(prop: Colors[]) => this.handleFilter('color', prop)} initialFilter={color} options={colorOptions} />
					<Multiselect type="size" onFilter={(prop: Sizes[]) => this.handleFilter('size', prop)} initialFilter={size} options={sizeOptions} />
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
						Only favorite ({favoriteItemsQuantity})
					</label>
				</div>

				<div className="search-panel__actions">
					<Btn onClick={() => onReset()} text="Reset" size="lg" action="reset" />
					<Btn onClick={() => onClear()} text="Clear" size="lg" action="clear" />
				</div>
			</div>
		)
	}
}

export default SearchPanel
