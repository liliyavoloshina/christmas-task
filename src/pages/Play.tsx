import '../styles/pages/__play.scss'
import { Component } from 'react'
import PlayOptions from '../components/PlayOptions'
import { PlayState } from '../types/Play'

class Play extends Component<{}, PlayState> {
	constructor(props: Readonly<{}>) {
		super(props)
		this.state = {
			// eslint-disable-next-line react/no-unused-state
			options: {
				scene: {
					className: 'scene',
					quantity: 4,
				},
				tree: {
					className: 'tree',
					quantity: 4,
				},
				lights: {
					className: 'lights',
					quantity: 5,
				},
			},
		}
	}

	render() {
		const { options } = this.state

		return (
			<div className="play-container fullpage">
				<aside className="aside">
					<PlayOptions title="Background" options={options.scene} />
					<PlayOptions title="Tree" options={options.tree} />
					<PlayOptions title="Lights" options={options.lights} isLights />
					{/* <section className="aside-section">
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
					</section> */}
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
