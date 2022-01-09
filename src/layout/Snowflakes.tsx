import '../styles/layout/__snowflakes.scss'
import { Component } from 'react'

interface SnowflakesProps {
	isHidden: boolean
}

class Snowflakes extends Component<SnowflakesProps> {
	constructor(props: Readonly<SnowflakesProps>) {
		super(props)
		this.state = {}
	}

	render() {
		const { isHidden } = this.props
		return (
			<div className={`snowflakes${isHidden ? '' : ' hidden'}`}>
				{Array(20)
					.fill(null)
					.map((light, index) => (
						<div key={index} className="snowflake" />
					))}
			</div>
		)
	}
}

export default Snowflakes
