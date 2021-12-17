import '../styles/components/__btn-selected.scss'
import { Component } from 'react'

interface BtnSelectedProps {
	isSelected: boolean
	onSelect(isSelected: boolean): void
}

class BtnSelected extends Component<BtnSelectedProps, {}> {
	constructor(props: BtnSelectedProps) {
		super(props)
		this.state = {}
	}

	toggleSelect() {
		const { onSelect, isSelected } = this.props
		onSelect(!isSelected)
	}

	render() {
		const { isSelected } = this.props

		let className = 'btn-selected'
		if (isSelected) {
			className += ' on'
		}

		return (
			<button className={className} onClick={() => this.toggleSelect()} type="button">
				<svg viewBox="0 0 24 24">
					<use xlinkHref="#heart" />
					<use xlinkHref="#heart" />
				</svg>

				<svg className="hide" viewBox="0 0 24 24">
					<defs>
						<path id="heart" d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z" />
					</defs>
				</svg>
			</button>
		)
	}
}

export default BtnSelected
