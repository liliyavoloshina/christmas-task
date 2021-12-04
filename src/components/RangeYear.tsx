import React from 'react'
import Nouislider from 'nouislider-react'

class RangeYear extends React.Component {
	state = {
		textValue: null,
		percent: null,
	}

	onSlide = (render, handle, value, un, percent) => {
		this.setState({
			textValue: value[0].toFixed(2),
			percent: percent[0].toFixed(2),
		})
	}

	render() {
		const { textValue, percent } = this.state
		return (
			<div>
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
					onSlide={this.onSlide}
				/>
				{textValue && percent && (
					<div>
						Value: {textValue}, {percent} %
					</div>
				)}
			</div>
		)
	}
}
