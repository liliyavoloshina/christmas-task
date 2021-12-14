import '../styles/components/__loader.scss'
import { Component } from 'react'

class Loader extends Component<{}> {
	constructor(props: Readonly<{}>) {
		super(props)
		this.state = {}
	}

	render() {
		return (
			<div className="loader">
				&#10052;
				{/* <div>&#10052;</div> */}
			</div>
		)
	}
}

export default Loader
