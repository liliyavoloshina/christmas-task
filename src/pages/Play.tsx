import { Component } from 'react'
import '../styles/pages/__play.scss'

interface PlayProps {}

class Play extends Component<{}> {
	constructor(props: PlayProps) {
		super(props)
		this.state = {}
	}

	render() {
		return (
			<div className="play-container fullpage">
				<aside className="aside">
					<section className="aside-section">
						<h3 className="aside-section__title">Background</h3>
						<div className="options">
							<div className="options__option options__option_active  options__option_scene scene-1" />
							<div className="options__option options__option_scene scene-2" />
							<div className="options__option options__option_scene scene-3" />
							<div className="options__option options__option_scene scene-4" />
						</div>
					</section>
					<section className="aside-section">
						<h3 className="aside-section__title">Tree</h3>
						<div className="options">
							<div className="options__option options__option_active  options__option_tree tree-1" />
							<div className="options__option options__option_tree tree-2" />
							<div className="options__option options__option_tree tree-3" />
							<div className="options__option options__option_tree tree-4" />
						</div>
					</section>
					<section className="aside-section">
						<h3 className="aside-section__title">Lights</h3>
						<div className="lights">
							<span className="material-icons lights-1">lightbulb</span>
							<span className="material-icons lights-2">lightbulb</span>
							<span className="material-icons lights-3">lightbulb</span>
							<span className="material-icons lights-4">lightbulb</span>
							<span className="material-icons lights-5">lightbulb</span>
							<button type="button" className="lights-switcher" title="Switch Lights">
								<span className="material-icons">power_settings_new</span>
							</button>
						</div>
					</section>
					<div className="settings">
						<div className="settings__block">
							<input className="checkbox" type="checkbox" id="music-toggle" name="music-toggle" value="Music Toggle" />
							<label htmlFor="music-toggle">Music</label>
						</div>
						<div className="settings__block">
							<input className="checkbox" type="checkbox" id="snow-toggle" name="snow-toggle" value="Snow Toggle" />
							<label htmlFor="snow-toggle">Snow</label>
						</div>
					</div>
					<div className="actions">
						<button type="button" className="actions__btn btn">
							Clear
						</button>
						<button type="button" className="actions__btn btn btn_yellow">
							Shine Christmas Tree!
						</button>
					</div>
				</aside>
				<div className="play-main" />
				<aside className="aside">
					<div className="toys" />
				</aside>
			</div>
		)
	}
}

export default Play
