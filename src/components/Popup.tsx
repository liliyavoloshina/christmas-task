import '../styles/components/__popup.scss'
import { Component } from 'react'

interface PopupProps {
	text: string
	isHidden: boolean
}

class Popup extends Component<PopupProps> {
	constructor(props: PopupProps) {
		super(props)
		this.state = {}
	}

	render() {
		const { text, isHidden } = this.props

		return (
			<div className={`popup ${isHidden ? 'hidden' : null}`}>
				<div className="popup__content">{text}</div>
			</div>
		)
	}
}

export default Popup
