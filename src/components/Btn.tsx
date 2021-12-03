import { Component } from 'react'
import '../styles/components/__btn.scss'

interface BtnProps {
	text: string
	size?: 'md'
	action?: 'save' | 'clear'
	accented?: boolean
}

class Btn extends Component<BtnProps> {
	constructor(props: BtnProps) {
		super(props)
		this.state = {}
	}

	render() {
		const { text, size, action, accented } = this.props

		const classes = ['btn', size, action, accented].join(' ').trim()
		return (
			<button type="button" className={classes}>
				{text}
			</button>
		)
	}
}

// function Btn({ size = 'md' }) {
// 	return <button type="button" className="btn" />
// }

export default Btn
