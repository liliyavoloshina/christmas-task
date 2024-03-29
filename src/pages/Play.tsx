import '../styles/pages/__play.scss'
import React, { Component } from 'react'
import html2canvas from 'html2canvas'
import PlayOptions from '../components/PlayOptions'
import Countdown from '../layout/Countdown'
import Btn from '../components/Btn'
import Loader from '../components/Loader'
import GarlandOptions from '../layout/GarlandOptions'
import Checkbox from '../components/Checkbox'
import Garland from '../layout/Garland'
import Snowflakes from '../layout/Snowflakes'
import { idToInitial, loadResources } from '../utils/utils'
import { getData, removeData, setData } from '../utils/data'
import { LocalStorage } from '../types/utils'
import { ObjectIndexNumber, PlaySelectedItem, PlaySelectedItemCopy, PlaySettings, GarlandColor, PlayOptionName, PlayCheckboxName, PreviousWork, GarlandStatus } from '../types/Play'
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
	settings: PlaySettings
	playSelectedItems: PlaySelectedItem[]
	itemsSetted: PlaySelectedItemCopy[]
	itemsNotSetted: PlaySelectedItemCopy[]
	previousWorks: PreviousWork[]
	treesPaths: ObjectIndexNumber
	scenePaths: ObjectIndexNumber
	draggableId: string
	isAlreadyOnTheTree: boolean
	isLoaded: boolean
	leftAsideHidden: boolean
	rightAsideHidden: boolean
	isCountdownHidden: boolean
}

class Play extends Component<Record<string, unknown>, PlayState> {
	private audio: HTMLAudioElement

	constructor(props: Record<string, unknown>) {
		super(props)
		this.state = {
			settings: {
				scene: 1,
				tree: 1,
				isSnow: false,
				isMusic: false,
				garlandStatus: GarlandStatus.Off,
				garlandColor: GarlandColor.Multicolor,
			},
			playSelectedItems: [],
			previousWorks: [],
			itemsSetted: [],
			itemsNotSetted: [],
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
			draggableId: '',
			isAlreadyOnTheTree: false,
			isLoaded: false,
			leftAsideHidden: false,
			rightAsideHidden: false,
			isCountdownHidden: true,
		}

		this.audio = new Audio('/audio/1.mp3')
		this.audio.loop = true
		this.audio.volume = 0.1
		this.save = this.save.bind(this)
		this.clear = this.clear.bind(this)
	}

	async componentDidMount() {
		const { treesPaths, scenePaths } = this.state
		const playSelectedItems = await getData(LocalStorage.PlaySelectedItems)
		const storedPlaySettings = await getData(LocalStorage.PlaySettings)
		const storedPreviousWorks = await getData(LocalStorage.PreviousWorks)

		let setted: PlaySelectedItemCopy[] = []
		let notSetted: PlaySelectedItemCopy[] = []

		playSelectedItems.forEach((item: PlaySelectedItem) => {
			setted = [...setted, ...item.itemsSetted]
			notSetted = [...notSetted, ...item.itemsNotSetted]
		})

		this.setState({
			settings: storedPlaySettings,
			playSelectedItems,
			itemsSetted: setted,
			itemsNotSetted: notSetted,
			previousWorks: storedPreviousWorks,
		})

		this.checkMusic()

		window.addEventListener('beforeunload', () => {
			const { settings } = this.state

			setData<PlaySettings>(LocalStorage.PlaySettings, settings)
		})

		const treeImages = Object.keys(treesPaths).map(key => treesPaths[key])
		const sceneImages = Object.keys(scenePaths).map(key => scenePaths[key])
		await loadResources(treeImages)
		await loadResources(sceneImages)
		await loadResources([mainBg])
		this.setState({ isLoaded: true })
	}

	componentWillUnmount() {
		this.audio.pause()
	}

	handleCheckbox(type: PlayCheckboxName) {
		const { settings } = this.state

		if (type === PlayCheckboxName.Snow) {
			settings.isSnow = !settings.isSnow
			this.setState({ settings })
		} else {
			const { isMusic } = settings

			if (!isMusic) {
				this.audio.play()
			} else {
				this.audio.pause()
			}

			settings.isMusic = !settings.isMusic
			this.setState({ settings })
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
		const { settings } = this.state

		settings[optionType] = optionIndex
		this.setState({ settings })
	}

	onDragStart(id: string) {
		const { itemsSetted } = this.state
		const isAlreadyOnTheTree = itemsSetted.findIndex(item => item.id === id) !== -1

		this.setState({ draggableId: id, isAlreadyOnTheTree })
	}

	onDrop(e: React.DragEvent<HTMLAreaElement>) {
		e.stopPropagation()
		const { draggableId, itemsNotSetted, itemsSetted, isAlreadyOnTheTree } = this.state

		if (!draggableId) return

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

	toggleGarland(garlandStatus: GarlandStatus) {
		const { settings } = this.state
		settings.garlandStatus = garlandStatus

		this.setState({ settings })
	}

	switchGarlandLight(light: GarlandColor) {
		const { settings } = this.state
		settings.garlandColor = light
		this.setState({ settings })
	}

	clear() {
		const { settings } = this.state

		this.audio.pause()
		this.audio = new Audio('/audio/1.mp3')

		settings.scene = 1
		settings.tree = 1
		settings.isSnow = false
		settings.isMusic = false
		settings.garlandStatus = GarlandStatus.Off
		settings.garlandColor = GarlandColor.Multicolor

		this.setState({ settings })
		removeData(LocalStorage.PlaySettings)
	}

	checkMusic() {
		const { settings } = this.state
		const { isMusic } = settings

		this.audio.pause()

		this.audio = new Audio('/audio/1.mp3')
		this.audio.loop = true
		this.audio.volume = 0.1

		if (isMusic) {
			const playMusicOnClick = (e: MouseEvent) => {
				const element = e.target as HTMLElement

				if (element.id === 'music-toggle' || element.classList.contains('nav__link') || element.classList.contains('previous-work__btn')) {
					return
				}

				if (element.classList.contains('previous-work')) {
					document.addEventListener(
						'click',
						ev => {
							playMusicOnClick(ev)
						},
						{ once: true }
					)
					return
				}

				this.audio.play()
			}

			document.addEventListener(
				'click',
				e => {
					playMusicOnClick(e)
				},
				{ once: true }
			)
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

	async save() {
		const { settings, previousWorks, itemsSetted, itemsNotSetted, playSelectedItems } = this.state

		this.setState({ isCountdownHidden: false })

		html2canvas(document.querySelector('.tree-container')!).then(canvas => {
			const tempcanvas = document.createElement('canvas')
			tempcanvas.width = 200
			tempcanvas.height = 250
			const context = tempcanvas.getContext('2d')!
			context.drawImage(canvas, 0, 0, tempcanvas.width, tempcanvas.height)
			const imageUrl = tempcanvas.toDataURL('image/jpg')

			const lastPreviousWork = previousWorks[0]
			let id

			if (lastPreviousWork) {
				id = lastPreviousWork.id + 1
			} else {
				id = previousWorks.length + 1
			}

			const newPreviousWork: PreviousWork = {
				id,
				imageUrl,
				playSettings: { ...settings },
				itemsSetted,
				itemsNotSetted,
				playSelectedItems,
			}

			const updatedPreviousWorks = [newPreviousWork, ...previousWorks]

			this.setState({ previousWorks: updatedPreviousWorks }, () => {
				setData<PreviousWork[]>(LocalStorage.PreviousWorks, updatedPreviousWorks)
			})
		})
	}

	restorePreviousWork(id: number) {
		const { previousWorks } = this.state
		const selectedWork = previousWorks.find(work => work.id === id)

		this.setState(
			{
				settings: { ...selectedWork!.playSettings },
				itemsSetted: selectedWork!.itemsSetted,
				itemsNotSetted: selectedWork!.itemsNotSetted,
				playSelectedItems: [...selectedWork!.playSelectedItems],
			},
			() => {
				this.checkMusic()
			}
		)
	}

	deletePreviousWork(id: number) {
		const { previousWorks } = this.state
		const updatedPreviousWorks = previousWorks.filter(work => work.id !== id)

		this.setState({ previousWorks: updatedPreviousWorks }, () => {
			setData<PreviousWork[]>(LocalStorage.PreviousWorks, updatedPreviousWorks)
		})
	}

	closeCountdown() {
		this.setState({ isCountdownHidden: true })
	}

	render() {
		const { settings, playSelectedItems, treesPaths, itemsSetted, itemsNotSetted, isLoaded, leftAsideHidden, rightAsideHidden, previousWorks, isCountdownHidden } = this.state
		const { isSnow, isMusic, garlandColor, garlandStatus, scene, tree } = settings
		const treeContainerClass = `tree-container scene-${scene}`

		if (!isLoaded) {
			return <Loader />
		}

		return (
			<div className="play-container fullpage">
				<aside className={`aside aside-left${leftAsideHidden ? ' hidden' : ''}`}>
					<div className="aside__header">
						<Btn onClick={() => this.toggleAside(AsideName.Left)} additionalClass="aside__toggler" icon={leftAsideHidden ? 'chevron_right' : 'chevron_left'} form="square" />
					</div>

					<div className="aside__container">
						<PlayOptions
							title="Background"
							active={scene}
							className={PlayOptionName.Scene}
							quantity={9}
							onSelect={(optionType: string, optionIndex: number) => this.handleSelectOption(optionType, optionIndex)}
						/>
						<PlayOptions
							title="Tree"
							active={tree}
							className={PlayOptionName.Tree}
							quantity={6}
							onSelect={(optionType: string, optionIndex: number) => this.handleSelectOption(optionType, optionIndex)}
						/>
						<GarlandOptions
							garlandStatus={garlandStatus}
							activeLight={garlandColor}
							toggleGarland={status => this.toggleGarland(status)}
							switchGarlandLight={(light: GarlandColor) => this.switchGarlandLight(light)}
						/>
						<div className="settings">
							<Checkbox label="Music" name="music-toggle" isChecked={isMusic} onChange={() => this.handleCheckbox(PlayCheckboxName.Music)} />
							<Checkbox label="Snow" name="snow-toggle" isChecked={isSnow} onChange={() => this.handleCheckbox(PlayCheckboxName.Snow)} />
						</div>
						<div className="actions">
							<Btn onClick={this.clear} text="Clear" />
							<Btn onClick={this.save} text="Save" accented />
						</div>
					</div>
				</aside>
				<div className={treeContainerClass}>
					<Garland garlandStatus={garlandStatus} garlandColor={garlandColor} />
					<Snowflakes isHidden={isSnow} />
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
					<img src={treesPaths[tree]} className="tree-main-image" useMap="#tree-map" alt="tree" draggable="false" />
				</div>
				<aside className={`aside aside-right${rightAsideHidden ? ' hidden' : ''}`}>
					<div className="aside__header">
						<Btn onClick={() => this.toggleAside(AsideName.Right)} additionalClass="aside__toggler" icon={rightAsideHidden ? 'chevron_left' : 'chevron_right'} form="square" />
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
									<div className="previous-works__empty">
										<div className="first">Let&apos;s Decorate</div>
										<div className="second">your first tree!</div>
									</div>
								) : (
									previousWorks.map(previousWork => (
										<div className="previous-work" key={previousWork.id}>
											<Btn onClick={() => this.deletePreviousWork(previousWork.id)} additionalClass="previous-work__btn" icon="delete" size="sm" action="delete" title="delete" />
											<img
												className="previous-work__image"
												onClick={() => this.restorePreviousWork(previousWork.id)}
												role="presentation"
												src={previousWork.imageUrl}
												alt="previous work"
												draggable="false"
											/>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</aside>
				<Countdown onClose={() => this.closeCountdown()} isHidden={isCountdownHidden} />
			</div>
		)
	}
}

export default Play
