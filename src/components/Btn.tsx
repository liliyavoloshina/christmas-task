import { Component } from 'react'
import '../styles/components/__btn.scss'

interface BtnProps {
	text?: string
	size?: 'md' | 'lg'
	action?: 'reset' | 'clear'
	accented?: boolean
	icon?: string
	form?: 'square'
	title?: string
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
		const { text, size, action, icon, form, title, accented } = this.props
		const options = ['btn', size, action, form]

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
