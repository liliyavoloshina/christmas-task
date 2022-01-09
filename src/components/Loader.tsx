import '../styles/components/__loader.scss'
import { Component } from 'react'

class Loader extends Component<Record<string, never>> {
	constructor(props: Readonly<Record<string, never>>) {
		super(props)
		this.state = {}
	}

	render() {
		return <div className="loader">&#10052;</div>
	}
}

export default Loader
