import React from 'react'
import ReactSlider from 'react-slider'
import '../styles/components/__range.scss'
import { firstToUpperCase } from '../utils/utils'
import { RangeOptions } from '../types/Filter'

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
		const name = firstToUpperCase(type)

		return (
			<div className="range">
				<div className="search-panel-label">
					{name} : {initialFilter.min} - {initialFilter.max}
				</div>
				<div className="range__slider">
					<ReactSlider
						min={rangeMin}
						max={rangeMax}
						thumbClassName="range-thumb"
						trackClassName="range-track"
						defaultValue={[initialFilter.min, initialFilter.max]}
						renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
						pearling
						onChange={value => this.valueChange(value)}
					/>
				</div>
			</div>
		)
	}
}

export default Range
