import '../styles/components/__switch.scss'
import { Component } from 'react'

class Switch extends Component {
	constructor(props: boolean) {
		super(props)
		this.state = {}
	}

	render() {
		return (
			<label className="switch">
				<input type="checkbox" />
				<i />
			</label>
		)
	}
}

export default Switch
