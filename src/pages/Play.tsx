import '../styles/pages/__play.scss'
import React, { Component } from 'react'
import html2canvas, { Options } from 'html2canvas'
import PlayOptions from '../components/PlayOptions'
import Btn from '../components/Btn'
import Loader from '../components/Loader'
import Garland from '../layout/GarlandOptions'
import Checkbox from '../components/Checkbox'
import { idToInitial, getSnowflakes, calculateGarlandOffset, loadResources } from '../utils/utils'
import { getData, removeData, setData } from '../utils/data'
import { LocalStorage } from '../types/utils'
import {
	PlayOptionsObject,
	ObjectIndexNumber,
	PlaySelectedItem,
	PlaySelectedItemCopy,
	PlaySettings,
	LightsOffsetType,
	GarlandColor,
	PlayOptionName,
	PlayCheckboxName,
	PreviousWork,
} from '../types/Play'
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

enum AsideName {
	Left = 'left',
	Right = 'right',
}

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
	garlandColor: GarlandColor
	leftAsideHidden: boolean
	rightAsideHidden: boolean
	previousWorks: PreviousWork[]
}

class Play extends Component<Record<string, never>, PlayState> {
	private audio: HTMLAudioElement

	constructor(props: Readonly<Record<string, never>>) {
		super(props)
		this.state = {
			options: {
				scene: {
					className: PlayOptionName.Scene,
					active: 1,
					quantity: 9,
				},
				tree: {
					className: PlayOptionName.Tree,
					active: 1,
					quantity: 6,
				},
				lights: {
					className: PlayOptionName.Lights,
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
			garlandColor: GarlandColor.Multicolor,
			leftAsideHidden: false,
			rightAsideHidden: false,
			previousWorks: [],
		}

		this.audio = new Audio('/audio/1.mp3')
		this.audio.loop = true
	}

	async componentDidMount() {
		const { options, treesPaths, scenePaths } = this.state
		const playSelectedItems = await getData(LocalStorage.PlaySelectedItems)
		const storedPlaySettings = await getData(LocalStorage.PlaySettings)
		const storedPreviousWorks = await getData(LocalStorage.PreviousWorks)

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
			previousWorks: storedPreviousWorks,
		})

		this.checkMusic()

		window.addEventListener('beforeunload', () => {
			const { isSnow, isMusic, isGarland, garlandColor, previousWorks } = this.state
			// const { itemsSetted, itemsNotSetted, isSnow, isMusic, isGarland, garlandColor } = this.state
			const { scene, tree, lights } = options

			// TODO: saving toys position
			// const updatedFavoriteItems = favoriteItems.map((item: FavoriteItem) => ({ id: item.id, amount: item.amount, itemsSetted, itemsNotSetted }))
			const playSettings: PlaySettings = { activeScene: scene.active, activeTree: tree.active, activeLights: lights.active, isSnow, isMusic, isGarland, garlandColor }

			// setData<FavoriteItem[]>('favoriteItems', updatedFavoriteItems)
			setData<PlaySettings>(LocalStorage.PlaySettings, playSettings)
			setData<PreviousWork[]>(LocalStorage.PreviousWorks, previousWorks)
		})

		const treeImages = Object.keys(treesPaths).map(key => treesPaths[key])
		const sceneImages = Object.keys(scenePaths).map(key => scenePaths[key])
		await loadResources(treeImages)
		await loadResources(sceneImages)
		await loadResources([mainBg])
		this.setState({ isLoaded: true })
	}

	handleCheckbox(type: PlayCheckboxName) {
		if (type === PlayCheckboxName.Snow) {
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

	onDragStart(id: string) {
		const { itemsSetted } = this.state
		const isAlreadyOnTheTree = itemsSetted.findIndex(item => item.id === id) !== -1

		this.setState({ draggableId: id, isAlreadyOnTheTree })
	}

	onDrop(e: React.DragEvent<HTMLAreaElement>) {
		e.stopPropagation()
		const { draggableId, itemsNotSetted, itemsSetted, isAlreadyOnTheTree } = this.state

		// TODO: is there another way to access element without e.target ???
		const node = e.target as HTMLElement
		const rect = node.getBoundingClientRect()
		const leftCoord = e.clientX - rect.left - 20
		const rightCoord = e.clientY - rect.top - 20
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

	toggleGarland(checked: boolean) {
		this.setState({ isGarland: checked })
	}

	switchGarlandLight(light: GarlandColor) {
		this.setState({ garlandColor: light })
	}

	clear() {
		const { options } = this.state

		options.scene.active = 1
		options.tree.active = 1
		options.lights.active = 1

		this.audio.pause()
		this.audio = new Audio('/audio/1.mp3')
		this.setState({ options, isSnow: false, isMusic: false, isGarland: false, garlandColor: GarlandColor.Multicolor })
		removeData(LocalStorage.PlaySettings)
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

	toggleAside(type: AsideName) {
		const { leftAsideHidden, rightAsideHidden } = this.state
		if (type === AsideName.Left) {
			this.setState({ leftAsideHidden: !leftAsideHidden })
		} else {
			this.setState({ rightAsideHidden: !rightAsideHidden })
		}
	}

	// eslint-disable-next-line react/no-unused-class-component-methods, class-methods-use-this
	save() {
		const { previousWorks, isSnow, isMusic, isGarland, garlandColor, options, itemsSetted, itemsNotSetted } = this.state
		let newPreviousWork: PreviousWork
		const newPreviousWorkId = previousWorks.length + 2

		const playSettings: PlaySettings = {
			activeScene: options.scene.active,
			activeTree: options.tree.active,
			activeLights: options.lights.active,
			isSnow,
			isMusic,
			isGarland,
			garlandColor,
		}

		html2canvas(document.querySelector('.tree-container')!).then(canvas => {
			const tempcanvas = document.createElement('canvas')
			tempcanvas.width = 100
			tempcanvas.height = 100
			const context = tempcanvas.getContext('2d')!

			context.drawImage(canvas, 0, 0, 100, (100 * canvas.height) / canvas.width)
			// context.drawImage(canvas, 0, 0, 100, (100 * canvas.height) / canvas.width)

			const imageUrl = tempcanvas.toDataURL('image/jpg')

			newPreviousWork = {
				id: newPreviousWorkId,
				imageUrl,
				playSettings,
				itemsSetted,
				itemsNotSetted,
			}

			const updatedPreviousWorks = [...previousWorks, newPreviousWork]
			this.setState({ previousWorks: updatedPreviousWorks })
		})
	}

	restorePreviousWork(id: number) {
		const { previousWorks, options } = this.state
		const selectedWork = previousWorks.find(work => work.id === id)
		options.scene.active = selectedWork!.playSettings.activeScene
		options.tree.active = selectedWork!.playSettings.activeTree
		options.lights.active = selectedWork!.playSettings.activeLights

		this.setState({
			itemsSetted: selectedWork!.itemsSetted,
			itemsNotSetted: selectedWork!.itemsNotSetted,
			options,
			isSnow: selectedWork!.playSettings.isSnow,
			isMusic: selectedWork!.playSettings.isMusic,
			isGarland: selectedWork!.playSettings.isGarland,
			garlandColor: selectedWork!.playSettings.garlandColor,
		})
	}

	render() {
		const {
			options,
			playSelectedItems,
			treesPaths,
			itemsSetted,
			itemsNotSetted,
			isSnow,
			isMusic,
			isLoaded,
			isGarland,
			garlandColor,
			leftAsideHidden,
			rightAsideHidden,
			previousWorks,
		} = this.state
		const { tree, scene } = options
		const treeContainerClass = `tree-container scene-${scene.active}`

		if (!isLoaded) {
			return <Loader />
		}

		return (
			<div className="play-container fullpage">
				<aside className={`aside aside-left${leftAsideHidden ? ' hidden' : ''}`}>
					<div className="aside__header">
						<Btn
							onClick={() => {
								this.toggleAside(AsideName.Left)
							}}
							additionalClass="aside__toggler"
							icon={leftAsideHidden ? 'chevron_right' : 'chevron_left'}
							form="square"
						/>
					</div>

					<div className="aside__container">
						<PlayOptions title="Background" options={options.scene} onSelect={(optionType: string, optionIndex: number) => this.handleSelectOption(optionType, optionIndex)} />
						<PlayOptions title="Tree" options={options.tree} onSelect={(optionType: string, optionIndex: number) => this.handleSelectOption(optionType, optionIndex)} />
						<Garland
							toggleGarland={checked => this.toggleGarland(checked)}
							switchGarlandLight={(light: GarlandColor) => this.switchGarlandLight(light)}
							isGarland={isGarland}
							activeLight={garlandColor}
						/>
						<div className="settings">
							<Checkbox label="Music" name="music-toggle" isChecked={isMusic} onChange={() => this.handleCheckbox(PlayCheckboxName.Music)} />
							<Checkbox label="Snow" name="snow-toggle" isChecked={isSnow} onChange={() => this.handleCheckbox(PlayCheckboxName.Snow)} />
						</div>
						<div className="actions">
							<Btn onClick={() => this.clear()} text="Clear" />
							<Btn onClick={() => this.save()} text="Save" accented />
						</div>
					</div>
				</aside>
				<div className={treeContainerClass}>
					<ul className={`garland ${isGarland ? `${garlandColor}` : 'hidden'}`}>
						{Array(80)
							.fill(null)
							.map((light, index) => {
								const topOffset = calculateGarlandOffset(LightsOffsetType.Top, index)
								const leftOffset = calculateGarlandOffset(LightsOffsetType.Left, index)
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
					<map name="tree-map" className="tree-map">
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
				<aside className={`aside aside-right${rightAsideHidden ? ' hidden' : ''}`}>
					<div className="aside__header">
						<Btn
							onClick={() => {
								this.toggleAside(AsideName.Right)
							}}
							additionalClass="aside__toggler"
							icon={rightAsideHidden ? 'chevron_left' : 'chevron_right'}
							form="square"
						/>
					</div>
					<div className="aside__container">
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
						<div className="previous-works">
							<h3 className="previous-works__title">Previous works</h3>
							<div className="previous-works__content">
								{previousWorks.length === 0 ? (
									<div className="previous-works__empty">Decorate your first tree!</div>
								) : (
									previousWorks.map(previousWork => (
										<div onClick={() => this.restorePreviousWork(previousWork.id)} role="presentation" key={previousWork.id} className="previous-work">
											<img className="previous-work" src={previousWork.imageUrl} alt="previous work" />
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</aside>
			</div>
		)
	}
}

export default Play
