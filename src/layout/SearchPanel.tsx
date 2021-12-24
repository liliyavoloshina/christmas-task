import '../styles/layout/__search-panel.scss'
import { Component } from 'react'
import Multiselect from '../components/Multiselect'
import Select from '../components/Select'
import Btn from '../components/Btn'
import Range from '../components/Range'
import Checkbox from '../components/Checkbox'
import { RangeOptions, CatalogFilters, CatalogFiltersValues, SortKey, MultiselectOption } from '../types/Catalog'
import { ItemColor, ItemShape, ItemSize } from '../types/Item'

interface SearchPanelProps {
	filters: CatalogFilters
	sort: SortKey
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

	handleSort(key: SortKey) {
		const { onSort } = this.props
		onSort(key)
	}

	render() {
		const shapeOptions = [ItemShape.Ball, ItemShape.Figure, ItemShape.Bell, ItemShape.Cone, ItemShape.Snowflake]
		const colorOptions = [ItemColor.Green, ItemColor.White, ItemColor.Red, ItemColor.blue, ItemColor.Yellow]
		const sizeOptions = [ItemSize.Large, ItemSize.Medium, ItemSize.Small]
		const { filters, sort, onReset, onClear, selectedItemsQuantity } = this.props
		const { year, amount, shape, color, size, areOnlySelected, areOnlyFavorite } = filters

		return (
			<div className="search-panel">
				<div className="selecting">
					<Select onSelect={(key: SortKey) => this.handleSort(key)} initialSort={sort} type="sort" />
					<Multiselect
						type={MultiselectOption.Shape}
						onFilter={(prop: ItemShape[]) => this.handleFilter(MultiselectOption.Shape, prop)}
						initialFilter={shape}
						options={shapeOptions}
					/>
					<Multiselect
						type={MultiselectOption.Color}
						onFilter={(prop: ItemColor[]) => this.handleFilter(MultiselectOption.Color, prop)}
						initialFilter={color}
						options={colorOptions}
					/>
					<Multiselect type={MultiselectOption.Size} onFilter={(prop: ItemSize[]) => this.handleFilter(MultiselectOption.Size, prop)} initialFilter={size} options={sizeOptions} />
				</div>

				<div className="filtering">
					<Range type="year" onFilter={(prop: RangeOptions) => this.handleFilter('year', prop)} initialFilter={year} />
					<Range type="amount" onFilter={(prop: RangeOptions) => this.handleFilter('amount', prop)} initialFilter={amount} />
				</div>

				<Checkbox
					label={`Only selected (${selectedItemsQuantity})`}
					name="only-selected"
					isChecked={areOnlySelected}
					onChange={() => this.handleFilter('areOnlySelected', !areOnlySelected)}
				/>
				<Checkbox label="Only granny's favorite" name="only-favorite" isChecked={areOnlyFavorite} onChange={() => this.handleFilter('areOnlyFavorite', !areOnlyFavorite)} />

				<div className="search-panel__actions">
					<Btn onClick={() => onReset()} text="Reset filters" action="reset" />
					<Btn onClick={() => onClear()} text="Clear all" action="clear" />
				</div>
			</div>
		)
	}
}

export default SearchPanel
