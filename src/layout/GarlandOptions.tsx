import '../styles/layout/__garland.scss'
import '../styles/components/__switch.scss'
import { Component } from 'react'
import { GarlandColor, GarlandStatus } from '../types/Play'

interface LightItem {
	id: number
	name: GarlandColor
}

interface GarlandOptionsProps {
	garlandStatus: GarlandStatus
	activeLight: GarlandColor
	toggleGarland(garlandStatus: GarlandStatus): void
	switchGarlandLight(garlandColor: GarlandColor): void
}

interface GarlandOptionsState {
	lights: LightItem[]
}

class GarlandOptions extends Component<GarlandOptionsProps, GarlandOptionsState> {
	constructor(props: GarlandOptionsProps) {
		super(props)
		this.state = {
			lights: [
				{ id: 1, name: GarlandColor.Multicolor },
				{ id: 2, name: GarlandColor.Yellow },
				{ id: 3, name: GarlandColor.Pink },
				{ id: 4, name: GarlandColor.Green },
				{ id: 5, name: GarlandColor.Red },
			],
		}
	}

	calculateGarland() {
		const { toggleGarland, garlandStatus } = this.props

		let tempStatus = garlandStatus

		if (garlandStatus === GarlandStatus.Off) {
			tempStatus = GarlandStatus.On
		}
		if (garlandStatus === GarlandStatus.On) {
			tempStatus = GarlandStatus.Flicker
		}
		if (garlandStatus === GarlandStatus.Flicker) {
			tempStatus = GarlandStatus.Off
		}

		toggleGarland(tempStatus)
	}

	render() {
		const { switchGarlandLight, garlandStatus, activeLight } = this.props
		const { lights } = this.state

		return (
			<div className="garland-options">
				<div className="lights">
					{lights.map(light => (
						<button
							key={light.id}
							type="button"
							onClick={() => switchGarlandLight(light.name)}
							className={`light ${light.name} ${activeLight === light.name ? `${light.name}-active` : ''}`}
							aria-label="switch light"
						/>
					))}
				</div>
				<label htmlFor="garland-switch" className="switch">
					<input onChange={() => this.calculateGarland()} checked={garlandStatus !== GarlandStatus.Off} type="checkbox" id="garland-switch" />
					<i className={garlandStatus} />
				</label>
			</div>
		)
	}
}

export default GarlandOptions
