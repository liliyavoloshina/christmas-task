import '../styles/layout/__garland-options.scss'
import '../styles/components/__switch.scss'
import { Component } from 'react'

interface GarlandOptionsProps {
	toggleGarlandOptions(checked: boolean): void
}

class GarlandOptions extends Component<GarlandOptionsProps, {}> {
	constructor(props: GarlandOptionsProps) {
		super(props)
		this.state = {}
	}

	render() {
		const { toggleGarlandOptions } = this.props
		return (
			<div className="garland-options">
				<div className="lights">
					<button type="button" className="light multicolor" aria-label="switch light" />
					<button type="button" className="light yellow" aria-label="switch light" />
					<button type="button" className="light pink" aria-label="switch light" />
					<button type="button" className="light green" aria-label="switch light" />
					<button type="button" className="light red" aria-label="switch light" />
				</div>
				<label className="switch">
					<input onChange={e => toggleGarlandOptions(e.target.checked)} type="checkbox" />
					<i />
				</label>
			</div>
		)
	}
}

export default GarlandOptions
