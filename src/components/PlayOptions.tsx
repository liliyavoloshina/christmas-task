/* eslint-disable react/no-array-index-key */
import '../styles/layout/__play-options.scss'
import { Component } from 'react'
import { PlayOptionItem } from '../types/Play'

interface PlayOptionsProps {
	title: string
	options: PlayOptionItem
	onSelect(optionType: string, optionIndex: number): void
}

class PlayOptions extends Component<PlayOptionsProps, {}> {
	constructor(props: PlayOptionsProps) {
		super(props)
		this.state = {}
	}

	selectOption(optionType: string, optionIndex: number) {
		const { onSelect } = this.props
		onSelect(optionType, optionIndex)
	}

	render() {
		const { title, options } = this.props
		const { quantity, active, className } = options

		return (
			<section className="options-section">
				<h3 className="options-section__title">{title}</h3>
				<div className="options">
					{Array(quantity)
						.fill(null)
						.map((value, index) => (
							<div
								key={index}
								className={`options__option ${active === index + 1 ? `options__option_active` : ''} options__option-${className} options__option-${className}-${index + 1}`}
								onClick={() => this.selectOption(className, index + 1)}
								onKeyPress={() => this.selectOption(className, index + 1)}
								role="button"
								tabIndex={0}
								aria-label="select option"
							/>
						))}
				</div>
			</section>
		)
	}
}

export default PlayOptions
