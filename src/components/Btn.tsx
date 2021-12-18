import '../styles/components/__btn.scss'
import { Component } from 'react'

interface BtnProps {
	text?: string
	size?: 'md' | 'lg'
	action?: 'reset' | 'clear'
	accented?: boolean
	icon?: string
	form?: 'square'
	title?: string
	additionalClass?: string
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
		const { text, size, action, icon, form, title, accented, additionalClass } = this.props
		const options = ['btn', size, action, form, additionalClass]

		if (accented) {
			options.push('accented')
		}

		const classes = options.join(' ').trim()

		return (
			<button onClick={() => this.handleClick()} type="button" className={classes} title={title}>
				{text}
				<span className="material-icons">{icon}</span>
			</button>
		)
	}
}

export default Btn
