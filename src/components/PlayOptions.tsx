/* eslint-disable react/no-array-index-key */

import '../styles/layout/__playOptions.scss'
import { Component } from 'react'
import Switch from './Switch'
import { PlayOptionItem } from '../types/Play'

// const ThemeContext = React.createContext('light');

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
							/>
						))}
					{isLights ? <Switch /> : null}
				</div>
			</section>
		)
	}
}

export default PlayOptions
