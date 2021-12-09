import { Component } from 'react'
import { PlayOption } from '../types/Play'

interface AsideSectionProps {
	title: string
	optionClass: string
	options: PlayOption[]
}

class AsideSection extends Component<AsideSectionProps, {}> {
	constructor(props: AsideSectionProps) {
		super(props)
		this.state = {}
	}

	render() {
		const { title, options } = this.props
		return (
			<section className="aside-section">
				<h3 className="aside-section__title">{title}</h3>
				<div className="options">
					{options.map((option, index) => {
						;<div className="options__option options__option_scene scene-2" />
					})}
					{/* <div className="options__option options__option_active  options__option_scene scene-1" />
					<div className="options__option options__option_scene scene-2" />
					<div className="options__option options__option_scene scene-3" />
					<div className="options__option options__option_scene scene-4" /> */}
				</div>
			</section>
		)
	}
}

export default AsideSection
