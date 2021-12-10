/* eslint-disable react/no-unused-state */
import '../styles/pages/__play.scss'
import { Component } from 'react'
import PlayOptions from '../components/PlayOptions'
import { getData } from '../utils/utils'
import { PlayOptionsObject } from '../types/Play'
import Item from '../types/Item'

interface PlayState {
	options: PlayOptionsObject
	items: Item[]
}

class Play extends Component<{}, PlayState> {
	constructor(props: Readonly<{}>) {
		super(props)
		this.state = {
			options: {
				scene: {
					className: 'scene',
					active: 1,
					quantity: 6,
				},
				tree: {
					className: 'tree',
					active: 2,
					quantity: 6,
				},
				lights: {
					className: 'lights',
					active: 3,
					quantity: 5,
				},
			},
			items: [],
		}
	}

	async componentDidMount() {
		const storedItems = await getData('originalItems')
		const storedFavoriteItems = storedItems.filter((item: Item) => item.isFavorite)
		if (storedFavoriteItems.length === 0) {
			const firstTwentyItems = storedItems.slice(0, 20)
			this.setState({ items: firstTwentyItems })
		} else {
			this.setState({ items: storedFavoriteItems })
		}
	}

	render() {
		const { options, items } = this.state

		return (
			<div className="play-container fullpage">
				<aside className="aside">
					<PlayOptions title="Background" options={options.scene} />
					<PlayOptions title="Tree" options={options.tree} />
					<PlayOptions title="Lights" options={options.lights} isLights />
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
					<div className="items-play">
						{items.map(item => (
							<div key={item.id} className="item-play">
								<img src={`images/${item.id}.png`} alt={item.name} className="item-play__img" />
								<div className="item-play__amount">{item.amount}</div>
							</div>
						))}
					</div>
				</aside>
			</div>
		)
	}
}

export default Play
