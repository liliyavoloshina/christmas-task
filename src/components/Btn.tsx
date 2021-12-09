import { Component } from 'react'
import '../styles/components/__btn.scss'

interface BtnProps {
	text?: string
	size?: 'md'
	action?: 'save' | 'clear'
	accented?: boolean
	icon?: string
	onClick?(): void
}

class Btn extends Component<BtnProps> {
	constructor(props: BtnProps) {
		super(props)
		this.state = {}
	}

	handleClick() {
		const { onClick } = this.props

		if (onClick) {
			onClick()
		}
	}

	render() {
		const { text, size, action, accented, icon } = this.props
		const classes = ['btn', size, action, accented].join(' ').trim()

		return (
			<button onClick={() => this.handleClick()} type="button" className={classes}>
				{text}
				<span className="material-icons">{icon}</span>
			</button>
		)
	}
}

export default Btn
