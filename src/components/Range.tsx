import '../styles/components/__range.scss'
import React from 'react'
import ReactSlider from 'react-slider'
import { firstToUpperCase } from '../utils/utils'
import { RangeOptions } from '../types/Catalog'

interface RangeValues {
	min: number
	max: number
}

interface RangeProps {
	type: 'amount' | 'year'
	initialFilter: RangeValues
	onFilter(options: RangeOptions): void
}

class Range extends React.Component<RangeProps, Readonly<{}>> {
	constructor(props: RangeProps) {
		super(props)
		this.state = {}
	}

	valueChange(value: number[]) {
		const { onFilter } = this.props
		onFilter({ min: value[0], max: value[1] })
	}

	render() {
		const { initialFilter, type } = this.props
		const rangeMax = type === 'year' ? 2020 : 12
		const rangeMin = type === 'year' ? 1940 : 1
		const step = type === 'year' ? 10 : 1
		const name = firstToUpperCase(type)

		return (
			<div className="range">
				<h3 className="search-panel-label">{name}</h3>
				<div className="range__slider">
					<ReactSlider
						min={rangeMin}
						max={rangeMax}
						thumbClassName="range-thumb"
						trackClassName="range-track"
						value={[initialFilter.min, initialFilter.max]}
						renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
						pearling
						step={step}
						onChange={value => this.valueChange(value)}
					/>
				</div>
			</div>
		)
	}
}

export default Range
