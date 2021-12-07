import '../styles/components/__multiselect.scss'
import React, { Component } from 'react'
import { firstToUpperCase, searchOptions } from '../utils/utils'

interface MultiselectProps {
	type: 'shape' | 'color' | 'size'
	initialFilter: string[]
	onFilter(options: string[]): void
}

interface MultiselectState {
	options: string[]
	isOpen: boolean
	activeIndex: number
	ignoreBlur: boolean
	filteredOptions: string[]
	selected: string[]
}

class Multiselect extends Component<MultiselectProps, MultiselectState> {
	private list: React.RefObject<HTMLDivElement>

	private inputEl: React.RefObject<HTMLInputElement>

	private selectedEl: React.RefObject<HTMLUListElement>

	constructor(props: MultiselectProps) {
		super(props)
		this.state = {
			options: [],
			isOpen: false,
			activeIndex: 0,
			ignoreBlur: true,
			filteredOptions: [],
			selected: [],
		}
		this.list = React.createRef()
		this.inputEl = React.createRef()
		this.selectedEl = React.createRef()
	}

	componentDidMount() {
		const { initialFilter } = this.props

		this.setState({ selected: initialFilter })
		this.getOptions()
	}

	onBlur() {
		const { isOpen, ignoreBlur } = this.state

		if (ignoreBlur) {
			this.setState({ ignoreBlur: false })
			return
		}

		if (isOpen) {
			this.updateMenuState(false, false)
		}
	}

	onOptionMouseDown() {
		this.setState({ ignoreBlur: true })
	}

	onInput(e: React.SyntheticEvent) {
		const curValue = (e.target as HTMLInputElement).value
		this.filterOptions(curValue)
	}

	onOptionChange(index: number) {
		const multiselectList = this.list.current as HTMLInputElement
		this.setState({ activeIndex: index })

		const options = multiselectList.querySelectorAll('.multiselect-option')

		options.forEach(optionEl => {
			optionEl.classList.remove('option-current')
		})

		options[index].classList.add('option-current')
	}

	onOptionClick(index: number) {
		const inputEl = this.inputEl.current as HTMLInputElement
		this.onOptionChange(index)
		this.updateOption(index)
		inputEl.focus()
	}

	setOptions() {
		const { options } = this.state
		const { type, initialFilter } = this.props
		const multiselectList = this.list.current as HTMLInputElement

		options.forEach((option, index) => {
			const optionEl = document.createElement('div')
			optionEl.id = `${type}-${index}`
			optionEl.className = index === 0 ? 'multiselect-option option-current' : 'multiselect-option'
			optionEl.setAttribute('aria-selected', 'false')
			optionEl.innerText = option

			optionEl.addEventListener('click', () => {
				this.onOptionClick(index)
			})

			optionEl.addEventListener('mousedown', () => this.onOptionMouseDown())

			multiselectList.appendChild(optionEl)
		})

		if (initialFilter.length > 0) {
			initialFilter.forEach(optionName => {
				const idx = options.indexOf(optionName)

				this.selectOption(idx)
			})
		}
	}

	getOptions() {
		const { type } = this.props
		let arr: string[] = []

		if (type === 'shape') {
			arr = ['ball', 'figure', 'bell', 'cone', 'snowflake']
		} else if (type === 'color') {
			arr = ['green', 'white', 'red', 'blue', 'yellow']
		} else {
			arr = ['large', 'medium', 'small']
		}

		this.setState({ options: arr }, () => this.setOptions())
	}

	updateActiveOption() {
		const { options, filteredOptions, activeIndex, isOpen } = this.state

		if (filteredOptions.indexOf(options[activeIndex]) < 0) {
			const firstFilteredIndex = options.indexOf(filteredOptions[0])

			this.onOptionChange(firstFilteredIndex)
		}

		const menuState = filteredOptions.length > 0
		if (isOpen !== menuState) {
			this.updateMenuState(menuState, false)
		}
	}

	updateOption(index: number) {
		const { options } = this.state
		const selectedOptionName = options[index]
		const multiselectList = this.list.current as HTMLInputElement
		const optionEls = multiselectList.querySelectorAll('.multiselect-option')
		const optionEl = optionEls[index]
		const isSelected = optionEl.classList.contains('option-selected')

		if (isSelected) {
			this.removeOption(index, selectedOptionName)
		} else {
			this.selectOption(index)
		}

		const inputEl = this.inputEl.current as HTMLInputElement
		inputEl.value = ''
		this.filterOptions('')
	}

	selectOption(index: number) {
		const { options, selected } = this.state
		const { type } = this.props
		const multiselectList = this.list.current as HTMLInputElement
		const selectedEl = this.selectedEl.current as HTMLUListElement
		const selectedOptionName = options[index]

		const updatedSelected = [...selected]
		if (!updatedSelected.includes(selectedOptionName)) {
			updatedSelected.push(selectedOptionName)
		}

		this.setState({ activeIndex: index, selected: updatedSelected })

		const updatedOptions = multiselectList.querySelectorAll('.multiselect-option')

		updatedOptions[index].classList.add('option-selected')

		const buttonEl = document.createElement('button')
		const listItem = document.createElement('li')
		buttonEl.className = 'remove-option'
		buttonEl.type = 'button'
		buttonEl.id = `${type}-remove-${index}`
		buttonEl.addEventListener('click', () => {
			this.removeOption(index, selectedOptionName)
		})

		buttonEl.innerHTML = `${selectedOptionName} `

		listItem.appendChild(buttonEl)
		selectedEl.appendChild(listItem)

		this.valueChange()
	}

	removeOption(index: number, selectedOptionName: string) {
		const { type } = this.props
		const { selected } = this.state
		const multiselectList = this.list.current as HTMLInputElement
		const selectedEl = this.selectedEl.current as HTMLUListElement

		const options = multiselectList.querySelectorAll('.multiselect-option')
		options[index].classList.remove('option-selected')

		const updatedSelected = selected.filter((option: string) => option !== selectedOptionName)

		this.setState({ selected: updatedSelected }, () => {
			this.valueChange()
		})

		const buttonEl = selectedEl.querySelector<HTMLElement>(`#${type}-remove-${index}`)
		const toDelete = buttonEl!.parentElement as HTMLLIElement
		selectedEl.removeChild(toDelete)
	}

	filterOptions(value: string) {
		const multiselectList = this.list.current as HTMLInputElement
		const optionsEls = multiselectList.querySelectorAll('.multiselect-option')
		const { options } = this.state
		const filtered = searchOptions(value, options)
		this.setState({ filteredOptions: filtered }, () => {
			optionsEls.forEach(optionEl => {
				const optionValue = optionEl.innerHTML
				if (filtered.indexOf(optionValue) > -1) {
					optionEl.classList.remove('hidden')
				} else {
					optionEl.classList.add('hidden')
				}
			})
			this.updateActiveOption()
		})
	}

	updateMenuState(open: boolean, callFocus: boolean = true) {
		this.setState({ isOpen: open })

		if (callFocus) {
			const inputEl = this.inputEl.current as HTMLInputElement
			inputEl.focus()
		}
	}

	valueChange() {
		const { selected } = this.state

		const { onFilter } = this.props
		onFilter(selected)
	}

	render() {
		// console.log('multiselect render')

		const { type } = this.props
		const { isOpen } = this.state
		const optionsId = `multiselect-${type}-selected`
		const inputId = `multiselect-${type}`
		const listId = `listbox-${type}`
		const name = firstToUpperCase(type)

		return (
			<div className={`multiselect ${isOpen ? 'open' : ''}`}>
				<h3 className="search-panel-label">{name}</h3>
				<div className="multiselect__box">
					<ul className="selected-options" id={optionsId} ref={this.selectedEl as React.RefObject<HTMLUListElement>} />
					<input
						onInput={e => this.onInput(e)}
						onBlur={() => this.onBlur()}
						onClick={() => this.updateMenuState(true)}
						autoComplete="off"
						ref={this.inputEl as React.RefObject<HTMLInputElement>}
						id={inputId}
						className="multiselect__input"
						type="text"
					/>
				</div>
				<div className="multiselect__list" ref={this.list} id={listId} />
			</div>
		)
	}
}

export default Multiselect
