import React from 'react'
import ReactSlider from 'react-slider'
import '../styles/components/__range.scss'
import { firstToUpperCase } from '../utils/utils'
import { RangeOptions } from '../types/Filter'

interface RangeProps {
	type: 'amount' | 'year'
	initialFilter: RangeState
	onFilter(options: RangeOptions): void
}

interface RangeState {
	min: number
	max: number
}

class Range extends React.Component<RangeProps, RangeState> {
	constructor(props: RangeProps) {
		super(props)
		this.state = {
			min: 0,
			max: 0,
		}
	}

	valueChange(value: number[]) {
		this.setState({ min: value[0], max: value[1] }, () => {
			const { min, max } = this.state

			const { onFilter } = this.props
			onFilter({ min, max })
		})
	}

	render() {
		const { initialFilter, type } = this.props

		const max = type === 'year' ? 2020 : 12
		const min = type === 'year' ? 1940 : 1

		const name = firstToUpperCase(type)
		return (
			<div className="range">
				<div className="search-panel-label">{name} :</div>
				<div className="range__slider">
					<ReactSlider
						key="aaa"
						min={min}
						max={max}
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
