import '../styles/pages/__play.scss'
import React, { Component } from 'react'
import PlayOptions from '../components/PlayOptions'
import { getData, idToInitial } from '../utils/utils'
import { PlayOptionsObject, ObjectIndexNumber, FavoriteItem, FavoriteItemCopy } from '../types/Play'
import tree1 from '../img/tree/1.png'
import tree2 from '../img/tree/2.png'
import tree3 from '../img/tree/3.png'
import tree4 from '../img/tree/4.png'
import tree5 from '../img/tree/5.png'
import tree6 from '../img/tree/6.png'

interface PlayState {
	options: PlayOptionsObject
	favoriteItems: FavoriteItem[]
	itemsSetted: FavoriteItemCopy[]
	itemsNotSetted: FavoriteItemCopy[]
	treesPaths: ObjectIndexNumber
	draggableId: string
	isAlreadyOnTheTree: boolean
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
			itemsSetted: [],
			itemsNotSetted: [],
			draggableId: '',
			favoriteItems: [],
			isAlreadyOnTheTree: false,
		}
	}

	async componentDidMount() {
		const favoriteItems = await getData('favoriteItems')

		let setted: FavoriteItemCopy[] = []
		let notSetted: FavoriteItemCopy[] = []

		favoriteItems.forEach((item: FavoriteItem) => {
			setted = item.itemsSetted
			notSetted = [...notSetted, ...item.itemsNotSetted]
		})

		this.setState({ favoriteItems, itemsSetted: setted, itemsNotSetted: notSetted })
	}

	handleDragEnd(e: React.DragEvent<HTMLImageElement>, id: string) {
		e.preventDefault()
		const { itemsNotSetted, itemsSetted, isAlreadyOnTheTree } = this.state
		const currentDroppable = e.target
		const elemBelow = document.elementFromPoint(e.clientX, e.clientY)

		if (currentDroppable !== elemBelow && !elemBelow?.classList.contains('droppable') && isAlreadyOnTheTree) {
			const itemToUnset = itemsSetted.find(item => item.id === id)
			const updatedItemsNotSetted = [...itemsNotSetted, itemToUnset!]
			const updatedItemsSetted = itemsSetted.filter(item => item.id !== id)

			this.setState({ itemsSetted: updatedItemsSetted, itemsNotSetted: updatedItemsNotSetted })
		}
	}

	// eslint-disable-next-line class-methods-use-this
	handleSelectOption(optionType: string, optionIndex: number) {
		const { options } = this.state
		options[optionType].active = optionIndex
		this.setState({ options })
	}

	onDrop(e: React.DragEvent<HTMLAreaElement>) {
		e.stopPropagation()
		const { draggableId, itemsNotSetted, itemsSetted, isAlreadyOnTheTree } = this.state

		// TODO: how to access element in dom without querySelector ???
		const draggableTarget = document.querySelector<HTMLElement>(`[id="${draggableId}"]`)
		const { pageX, pageY } = e

		const leftCoord = pageX - draggableTarget!.offsetWidth / 2
		const rightCoord = pageY - draggableTarget!.offsetHeight / 2
		let itemToReplace: FavoriteItemCopy

		if (isAlreadyOnTheTree) {
			itemToReplace = itemsSetted.find(item => item.id === draggableId)!

			// TODO: just fire rereder, so coords change (is it possible to avoid this???)
			const updatedItemsSetted = itemsSetted
			this.setState({ itemsSetted: updatedItemsSetted })
		} else {
			itemToReplace = itemsNotSetted.find(item => item.id === draggableId)!
			const updatedItemsNotSetted = itemsNotSetted.filter(item => item.id !== draggableId)
			const updatedItemsSetted = [...itemsSetted, itemToReplace]
			this.setState({ itemsSetted: updatedItemsSetted, itemsNotSetted: updatedItemsNotSetted })
		}

		itemToReplace!.coords[0] = `${leftCoord}px`
		itemToReplace!.coords[1] = `${rightCoord}px`
	}

	onDragStart(id: string) {
		const { itemsSetted } = this.state
		const isAlreadyOnTheTree = itemsSetted.findIndex(item => item.id === id) !== -1

		this.setState({ draggableId: id, isAlreadyOnTheTree })
	}

	render() {
		const { options, favoriteItems, treesPaths, itemsSetted, itemsNotSetted } = this.state
		const { tree, scene } = options
		const treeContainerClass = `tree-container scene-${scene.active}`

		return (
			<div className="play-container fullpage">
				<aside className="aside">
					<PlayOptions title="Background" options={options.scene} onSelect={(optionType: string, optionIndex: number) => this.handleSelectOption(optionType, optionIndex)} />
					<PlayOptions title="Tree" options={options.tree} onSelect={(optionType: string, optionIndex: number) => this.handleSelectOption(optionType, optionIndex)} />
					<PlayOptions title="Lights" options={options.lights} isLights onSelect={(optionType: string, optionIndex: number) => this.handleSelectOption(optionType, optionIndex)} />
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
				<div className={treeContainerClass}>
					<map name="tree-map">
						<area
							className="droppable"
							coords="365,699,189,706,113,683,31,608,2,555,2,539,18,437,73,351,106,224,161,134,243,-1,306,75,353,144,399,221,424,359,452,459,496,550,444,664"
							alt="tree-area"
							shape="poly"
							onDragOver={e => e.preventDefault()}
							onDrop={e => this.onDrop(e)}
						/>
						{itemsSetted.map(toy => {
							const id = idToInitial(toy.id)
							return (
								<img
									key={toy.id}
									src={`images/${id}.png`}
									alt="lll"
									className="item-play__img setted"
									style={{ left: toy.coords[0], top: toy.coords[1] }}
									draggable
									onDragStart={() => this.onDragStart(toy.id)}
									onDragEnd={e => this.handleDragEnd(e, toy.id)}
									id={toy.id}
								/>
							)
						})}
					</map>
					<img src={treesPaths[tree.active]} className="tree-main-image" useMap="#tree-map" alt="tree" />
				</div>
				<aside className="aside">
					<div className="items-play">
						{favoriteItems.map(item => {
							const displayInCard = itemsNotSetted.filter(notSettedItem => idToInitial(notSettedItem.id) === item.id)
							return (
								<div key={item.id} className="item-play">
									{displayInCard.map(toy => (
										<img
											key={toy.id}
											src={`images/${item.id}.png`}
											alt="nnn"
											className="item-play__img not-setted"
											draggable
											onDragStart={() => this.onDragStart(toy.id)}
											onDragEnd={e => this.handleDragEnd(e, toy.id)}
											id={toy.id}
										/>
									))}

									<div className="item-play__amount">{displayInCard.length}</div>
								</div>
							)
						})}
					</div>
				</aside>
			</div>
		)
	}
}

export default Play
