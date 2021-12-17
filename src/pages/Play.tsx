/* eslint-disable react/no-unused-state */
import '../styles/pages/__play.scss'
import React, { Component } from 'react'
import PlayOptions from '../components/PlayOptions'
import Btn from '../components/Btn'
import Loader from '../components/Loader'
import Garland from '../layout/GarlandOptions'
import Checkbox from '../components/Checkbox'
import { getData, idToInitial, setData, getSnowflakes, calculateGarlandOffset, loadResources } from '../utils/utils'
import { LocalStorage } from '../types/utils'
import { PlayOptionsObject, ObjectIndexNumber, PlaySelectedItem, PlaySelectedItemCopy, PlaySettings } from '../types/Play'
// TODO: is there another way to load images from src folder ???
import mainBg from '../img/wallpaper/main.jpg'
import tree1 from '../img/tree/1.png'
import tree2 from '../img/tree/2.png'
import tree3 from '../img/tree/3.png'
import tree4 from '../img/tree/4.png'
import tree5 from '../img/tree/5.png'
import tree6 from '../img/tree/6.png'
import scene1 from '../img/scene/1.jpg'
import scene2 from '../img/scene/2.jpg'
import scene3 from '../img/scene/3.jpg'
import scene4 from '../img/scene/4.jpg'
import scene5 from '../img/scene/5.jpg'
import scene6 from '../img/scene/6.jpg'
import scene7 from '../img/scene/7.jpg'
import scene8 from '../img/scene/8.jpg'
import scene9 from '../img/scene/9.jpg'

interface PlayState {
	options: PlayOptionsObject
	playSelectedItems: PlaySelectedItem[]
	itemsSetted: PlaySelectedItemCopy[]
	itemsNotSetted: PlaySelectedItemCopy[]
	treesPaths: ObjectIndexNumber
	scenePaths: ObjectIndexNumber
	draggableId: string
	isAlreadyOnTheTree: boolean
	isSnow: boolean
	isMusic: boolean
	isLoaded: boolean
	isGarland: boolean
	garlandColor: 'multicolor' | 'yellow' | 'red' | 'pink' | 'green'
}

class Play extends Component<{}, PlayState> {
	private audio: HTMLAudioElement

	constructor(props: Readonly<{}>) {
		super(props)
		this.state = {
			options: {
				scene: {
					className: 'scene',
					active: 1,
					quantity: 9,
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
			scenePaths: {
				1: scene1,
				2: scene2,
				3: scene3,
				4: scene4,
				5: scene5,
				6: scene6,
				7: scene7,
				8: scene8,
				9: scene9,
			},
			itemsSetted: [],
			itemsNotSetted: [],
			draggableId: '',
			playSelectedItems: [],
			isAlreadyOnTheTree: false,
			isSnow: false,
			isMusic: false,
			isLoaded: false,
			isGarland: false,
			garlandColor: 'multicolor',
		}

		this.audio = new Audio('/audio/1.mp3')
		this.audio.loop = true
	}

	async componentDidMount() {
		const { options, treesPaths, scenePaths } = this.state
		const playSelectedItems = await getData(LocalStorage.PlaySelectedItems)
		const storedPlaySettings = await getData(LocalStorage.PlaySettings)

		let setted: PlaySelectedItemCopy[] = []
		let notSetted: PlaySelectedItemCopy[] = []

		playSelectedItems.forEach((item: PlaySelectedItem) => {
			setted = [...setted, ...item.itemsSetted]
			notSetted = [...notSetted, ...item.itemsNotSetted]
		})

		options.scene.active = storedPlaySettings.activeScene
		options.tree.active = storedPlaySettings.activeTree
		options.lights.active = storedPlaySettings.activeLights

		this.setState({
			playSelectedItems,
			itemsSetted: setted,
			itemsNotSetted: notSetted,
			options,
			isSnow: storedPlaySettings.isSnow,
			isMusic: storedPlaySettings.isMusic,
			isGarland: storedPlaySettings.isGarland,
			garlandColor: storedPlaySettings.garlandColor,
		})

		this.checkMusic()

		window.addEventListener('beforeunload', () => {
			const { isSnow, isMusic, isGarland, garlandColor } = this.state
			// const { itemsSetted, itemsNotSetted, isSnow, isMusic, isGarland, garlandColor } = this.state
			const { scene, tree, lights } = options

			// TODO: saving toys position
			// const updatedFavoriteItems = favoriteItems.map((item: FavoriteItem) => ({ id: item.id, amount: item.amount, itemsSetted, itemsNotSetted }))
			const playSettings: PlaySettings = { activeScene: scene.active, activeTree: tree.active, activeLights: lights.active, isSnow, isMusic, isGarland, garlandColor }

			// setData<FavoriteItem[]>('favoriteItems', updatedFavoriteItems)
			setData<PlaySettings>(LocalStorage.PlaySettings, playSettings)
		})

		const treeImages = Object.keys(treesPaths).map(key => treesPaths[key])
		const sceneImages = Object.keys(scenePaths).map(key => scenePaths[key])
		await loadResources(treeImages)
		await loadResources(sceneImages)
		await loadResources([mainBg])
		this.setState({ isLoaded: true })
	}

	handleCheckbox(type: 'snow' | 'music') {
		if (type === 'snow') {
			const { isSnow } = this.state
			this.setState({ isSnow: !isSnow })
		} else {
			const { isMusic } = this.state

			if (!isMusic) {
				this.audio.play()
			} else {
				this.audio.pause()
			}

			this.setState({ isMusic: !isMusic })
		}
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

	handleSelectOption(optionType: string, optionIndex: number) {
		const { options } = this.state
		options[optionType].active = optionIndex
		this.setState({ options })
	}

	// handleGarland(checked: boolean) {
	// 	this.setState({ isGarland: checked })
	// }

	onDragStart(id: string) {
		const { itemsSetted } = this.state
		const isAlreadyOnTheTree = itemsSetted.findIndex(item => item.id === id) !== -1

		this.setState({ draggableId: id, isAlreadyOnTheTree })
	}

	onDrop(e: React.DragEvent<HTMLAreaElement>) {
		e.stopPropagation()
		const { draggableId, itemsNotSetted, itemsSetted, isAlreadyOnTheTree } = this.state

		// TODO: how to access element in dom without querySelector ???
		const draggableTarget = document.querySelector<HTMLElement>(`[id="${draggableId}"]`)
		const { pageX, pageY } = e

		const leftCoord = pageX - draggableTarget!.offsetWidth / 2
		const rightCoord = pageY - draggableTarget!.offsetHeight / 2
		let itemToReplace: PlaySelectedItemCopy

		if (isAlreadyOnTheTree) {
			itemToReplace = itemsSetted.find(item => item.id === draggableId)!

			// TODO: just fire rerender, so coords change (is it possible to fire rerender without set unchanged property???)
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

	toggleGarlandOptions(checked: boolean) {
		this.setState({ isGarland: checked })
	}

	clear() {
		const { options } = this.state

		options.scene.active = 1
		options.tree.active = 1
		options.lights.active = 1

		this.audio.pause()
		this.audio = new Audio('/audio/1.mp3')
		this.setState({ options, isSnow: false, isMusic: false })
		window.localStorage.removeItem(LocalStorage.PlaySettings)
	}

	checkMusic() {
		const { isMusic } = this.state

		if (isMusic) {
			const playMusicOnClick = () => {
				this.audio.play()
				document.removeEventListener('click', playMusicOnClick)
			}

			document.addEventListener('click', playMusicOnClick)
		}
	}

	render() {
		const { options, playSelectedItems, treesPaths, itemsSetted, itemsNotSetted, isSnow, isMusic, isLoaded, isGarland, garlandColor } = this.state
		const { tree, scene } = options
		const treeContainerClass = `tree-container scene-${scene.active}`

		if (!isLoaded) {
			return <Loader />
		}

		return (
			<div className="play-container fullpage">
				<aside className="aside">
					<PlayOptions title="Background" options={options.scene} onSelect={(optionType: string, optionIndex: number) => this.handleSelectOption(optionType, optionIndex)} />
					<PlayOptions title="Tree" options={options.tree} onSelect={(optionType: string, optionIndex: number) => this.handleSelectOption(optionType, optionIndex)} />
					<Garland toggleGarlandOptions={checked => this.toggleGarlandOptions(checked)} />
					<div className="settings">
						<Checkbox label="Music" name="music-toggle" isChecked={isMusic} onChange={() => this.handleCheckbox('music')} />
						<Checkbox label="Snow" name="snow-toggle" isChecked={isSnow} onChange={() => this.handleCheckbox('snow')} />
					</div>
					<div className="actions">
						<Btn onClick={() => this.clear()} text="Clear" />
						<Btn text="Shine Christmas Tree!" accented />
					</div>
				</aside>
				<div className={treeContainerClass}>
					<ul className={`garland ${isGarland ? `${garlandColor}` : 'hidden'}`}>
						{Array(80)
							.fill(null)
							.map((light, index) => {
								const topOffset = calculateGarlandOffset('top', index)
								const leftOffset = calculateGarlandOffset('left', index)
								const gap = index % 2 === 0 ? index + 1 : index
								return <li key={index} className="garland__light" style={{ top: `${topOffset + gap}%`, left: `${leftOffset + index * 3.5}%` }} />
							})}
					</ul>
					<div className="snowflakes">
						{isSnow
							? getSnowflakes().map(snowflake => (
									<div
										key={snowflake.id}
										style={{ right: snowflake.paddingLeft, opacity: snowflake.opacity, animationDuration: snowflake.animationDuration, fontSize: snowflake.fontSize }}
										className="snowflake"
									/>
							  ))
							: null}
					</div>
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
									alt="drag me"
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
						{playSelectedItems.map(item => {
							const displayInCard = itemsNotSetted.filter(notSettedItem => idToInitial(notSettedItem.id) === item.id)
							return (
								<div key={item.id} className="item-play">
									{displayInCard.map(toy => (
										<img
											key={toy.id}
											src={`images/${item.id}.png`}
											alt="drag me"
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
