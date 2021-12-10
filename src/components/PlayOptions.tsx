/* eslint-disable react/no-array-index-key */
import { Component } from 'react'
import Switch from './Switch'
import { PlayOptionItem } from '../types/Play'

interface PlayOptionsProps {
	title: string
	options: PlayOptionItem
	isLights?: boolean
}

class PlayOptions extends Component<PlayOptionsProps, {}> {
	constructor(props: PlayOptionsProps) {
		super(props)
		this.state = {}
	}

	render() {
		const { title, options, isLights } = this.props
		const { quantity, className } = options

		return (
			<section className="options-section">
				<h3 className="options-section__title">{title}</h3>
				<div className="options">
					{Array(quantity)
						.fill(null)
						.map((value, index) => (
							<div key={index} className={`options__option options__option_active options__option_${className} ${className}-${index + 1}`} />
						))}
					{isLights ? <Switch /> : null}
				</div>
			</section>
		)
	}
}

export default PlayOptions
