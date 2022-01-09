import { Component } from 'react'
import { GarlandColor, GarlandStatus, LightsOffsetType } from '../types/Play'
import { calculateGarlandOffset } from '../utils/utils'

interface GarlandProps {
	garlandStatus: GarlandStatus
	garlandColor: GarlandColor
}

class Garland extends Component<GarlandProps> {
	constructor(props: Readonly<GarlandProps>) {
		super(props)
		this.state = {}
	}

	render() {
		const { garlandStatus, garlandColor } = this.props
		return (
			<ul className={`garland ${garlandStatus !== GarlandStatus.Off ? `${garlandColor} ${garlandStatus}` : 'hidden'}`}>
				{Array(80)
					.fill(null)
					.map((light, index) => {
						const topOffset = calculateGarlandOffset(LightsOffsetType.Top, index)
						const leftOffset = calculateGarlandOffset(LightsOffsetType.Left, index)
						const gap = index % 2 === 0 ? index + 2 : index
						return <li key={index} className="garland__light" style={{ top: `${topOffset + gap}%`, left: `${leftOffset + index * 3.5}%` }} />
					})}
			</ul>
		)
	}
}

export default Garland
