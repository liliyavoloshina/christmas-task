import React from 'react'
import Nouislider from 'nouislider-react'
import { firstToUpperCase } from '../utils/utils'
import 'nouislider/dist/nouislider.css'
import '../styles/components/__range.scss'

interface RangeProps {
	type: 'amount' | 'year'
}

interface IProps {
	value: number[]
}

interface RangeState {
	value: string
}

class Range extends React.Component<RangeProps, RangeState> {
	constructor(props: RangeProps) {
		super(props)
		this.state = {
			value: '',
		}
	}

	onSlide = ({ value }: IProps) => {
		this.setState({
			value: value[0].toFixed(2),
		})
	}

	render() {
		const { value } = this.state
		const { type } = this.props
		const name = firstToUpperCase(type)
		return (
			<div className="range">
				<div className="range__label">
					{name}: {value}
				</div>
				<div className="range__slider">
					<Nouislider
						connect
						start={[500, 4000]}
						behaviour="tap"
						range={{
							min: [0],
							'10%': [500, 500],
							'50%': [4000, 1000],
							max: [10000],
						}}
						onSlide={() => this.onSlide}
					/>
					{/* <Nouislider range={{ min: 0, max: 100 }} start={[20, 80]} connect /> */}
				</div>
			</div>
		)
	}
}

export default Range
