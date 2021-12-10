/* eslint-disable react/no-unused-state */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import '../styles/pages/__play.scss'
import React, { Component } from 'react'
import PlayOptions from '../components/PlayOptions'
import { getData } from '../utils/utils'
import { PlayOptionsObject, TreePaths } from '../types/Play'
import Item from '../types/Item'
import tree1 from '../img/tree/1.png'
import tree2 from '../img/tree/2.png'
import tree3 from '../img/tree/3.png'
import tree4 from '../img/tree/4.png'
import tree5 from '../img/tree/5.png'
import tree6 from '../img/tree/6.png'

interface PlayState {
	options: PlayOptionsObject
	items: Item[]
	treesPaths: TreePaths
	draggableTarget: HTMLImageElement | null
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
					active: 1,
					quantity: 6,
				},
				lights: {
					className: 'lights',
					active: 1,
					quantity: 5,
				},
			},
			treesPaths: {
				1: tree1,
				2: tree2,
				3: tree3,
				4: tree4,
				5: tree5,
				6: tree6,
			},
			items: [],
			draggableTarget: null,
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

	onDragOver(e: React.DragEvent<HTMLAreaElement>) {
		e.preventDefault()
	}

	onDragStart(e: React.DragEvent<HTMLImageElement>, id: string) {
		const target = e.target as HTMLImageElement
		e.dataTransfer.setData('id', id)
		this.setState({ draggableTarget: target })
	}

	onDrop(e: React.DragEvent<HTMLAreaElement>) {
		const { draggableTarget } = this.state
		const { pageX, pageY } = e
		// const id = e.dataTransfer.getData('id')

		draggableTarget!.style.position = 'fixed'
		draggableTarget!.style.width = `${30}px`
		draggableTarget!.style.height = `${30}px`
		draggableTarget!.style.left = `${pageX - draggableTarget!.offsetWidth / 2}px`
		draggableTarget!.style.top = `${pageY - draggableTarget!.offsetHeight / 2}px`
	}

	render() {
		const { options, items, treesPaths } = this.state
		const { tree } = options

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
				<div className="play-main">
					<map name="tree-map">
						<area
							coords="365,699,189,706,113,683,31,608,2,555,2,539,18,437,73,351,106,224,161,134,243,-1,306,75,353,144,399,221,424,359,452,459,496,550,444,664"
							alt="tree-area"
							shape="poly"
							onDragOver={e => this.onDragOver(e)}
							onDrop={e => this.onDrop(e)}
						/>
					</map>
					<img src={treesPaths[tree.active]} className="tree-main-image" useMap="#tree-map" alt="tree" />
				</div>
				<aside className="aside">
					<div className="items-play">
						{items.map(item => (
							<div key={item.id} className="item-play">
								<img src={`images/${item.id}.png`} alt={item.name} className="item-play__img" draggable role="presentation" onDragStart={e => this.onDragStart(e, item.id)} />
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
