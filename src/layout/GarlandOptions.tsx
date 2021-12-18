import '../styles/layout/__garland-options.scss'
import '../styles/components/__switch.scss'
import { Component } from 'react'
import { GarlandColor } from '../types/Play'

interface LightItem {
	id: number
	name: GarlandColor
}

interface GarlandOptionsProps {
	isGarland: boolean
	activeLight: GarlandColor
	toggleGarland(checked: boolean): void
	switchGarlandLight(checked: GarlandColor): void
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

	render() {
		const { toggleGarland, switchGarlandLight, isGarland, activeLight } = this.props
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
					<input onChange={e => toggleGarland(e.target.checked)} checked={isGarland} type="checkbox" id="garland-switch" />
					<i />
				</label>
			</div>
		)
	}
}

export default GarlandOptions
