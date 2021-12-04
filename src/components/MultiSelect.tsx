import React, { Component } from 'react'
import { firstToUpperCase, filterOptions } from '../utils/utils'
import '../styles/components/__multiselect.scss'

interface MultiselectProps {
	type: 'shape' | 'color' | 'size'
}

interface MultiselectState {
	options: string[]
	isOpen: boolean
	activeIndex: number
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
			// filteredOptions: [],
		}
		this.list = React.createRef()
		this.inputEl = React.createRef()
		this.selectedEl = React.createRef()
		// this.selectedEl = document.getElementById(`${this.idBase}-selected`)
	}

	componentDidMount() {
		this.getOptions()
	}

	onInput(e: React.SyntheticEvent) {
		const curValue = (e.target as HTMLInputElement).value
		this.filterOptions(curValue)
		this.updateMenuState(true)

		// // if active option is not in filtered options, set it to first filtered option
		// if (this.filteredOptions.indexOf(this.options[this.activeIndex]) < 0) {
		//   const firstFilteredIndex = this.options.indexOf(this.filteredOptions[0])
		//   this.onOptionChange(firstFilteredIndex)
		// }

		// const menuState = this.filteredOptions.length > 0
		// if (this.open !== menuState) {
		//   this.updateMenuState(menuState, false)
		// }
	}

	onOptionChange(index: number) {
		const multiselectList = this.list.current as HTMLInputElement
		this.setState({ activeIndex: index })

		// update active style
		const options = multiselectList.querySelectorAll('.multiselect-option')

		;[...options].forEach(optionEl => {
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
		const { options, activeIndex } = this.state
		const { type } = this.props

		const multiselectList = this.list.current as HTMLInputElement
		console.log(activeIndex)

		options.forEach((option, index) => {
			const optionEl = document.createElement('div')
			optionEl.id = `${type}-${index}`
			optionEl.className = index === 0 ? 'multiselect-option option-current' : 'multiselect-option'
			optionEl.setAttribute('aria-selected', 'false')
			optionEl.innerText = option

			optionEl.addEventListener('click', () => {
				this.onOptionClick(index)
			})

			// optionEl.addEventListener('mousedown', this.onOptionMouseDown.bind(this))

			multiselectList.appendChild(optionEl)
		})
	}

	getOptions() {
		const { type } = this.props
		let arr: string[] = []

		if (type === 'shape') {
			arr = ['ball', 'figure', 'bell', 'cone', 'snowflake']
		}

		this.setState({ options: arr }, () => this.setOptions())
	}

	updateOption(index: number) {
		const multiselectList = this.list.current as HTMLInputElement
		const optionEls = multiselectList.querySelectorAll('.multiselect-option')
		const optionEl = optionEls[index]
		const isSelected = optionEl.classList.contains('option-selected')

		if (isSelected) {
			this.removeOption(index)
		} else {
			this.selectOption(index)
		}

		const inputEl = this.inputEl.current as HTMLInputElement
		inputEl.value = ''
		this.filterOptions('')
	}

	selectOption(index: number) {
		const { options } = this.state
		const { type } = this.props
		const multiselectList = this.list.current as HTMLInputElement
		const selectedEl = this.selectedEl.current as HTMLUListElement
		const selected = options[index]
		this.setState({ activeIndex: index })

		// update aria-selected
		const updatedOptions = multiselectList.querySelectorAll('.multiselect-option')
		updatedOptions[index].classList.add('option-selected')

		// add remove option button
		const buttonEl = document.createElement('button')
		const listItem = document.createElement('li')
		buttonEl.className = 'remove-option'
		buttonEl.type = 'button'
		buttonEl.id = `${type}-remove-${index}`
		buttonEl.addEventListener('click', () => {
			this.removeOption(index)
		})

		buttonEl.innerHTML = `${selected} `

		listItem.appendChild(buttonEl)
		selectedEl.appendChild(listItem)
	}

	removeOption(index: number) {
		const multiselectList = this.list.current as HTMLInputElement
		const selectedEl = this.selectedEl.current as HTMLUListElement
		const { type } = this.props

		// update active style
		const options = multiselectList.querySelectorAll('.multiselect-option')
		options[index].classList.remove('option-selected')

		// remove button
		const buttonEl = selectedEl.querySelector<HTMLElement>(`#${type}-remove-${index}`)
		const toDelete = buttonEl!.parentElement as HTMLLIElement
		selectedEl.removeChild(toDelete)
	}

	filterOptions(value: string) {
		const { options } = this.state
		const filtered = filterOptions(value, options)

		console.log(filtered)
	}

	updateMenuState(open: boolean, callFocus: boolean = true) {
		this.setState({ isOpen: open })

		if (callFocus) {
			const inputEl = this.inputEl.current as HTMLInputElement
			inputEl.focus()
		}
	}

	render() {
		const { type } = this.props
		const optionsId = `multiselect-${type}-selected`
		const inputId = `multiselect-${type}`
		const listId = `listbox-${type}`
		const name = firstToUpperCase(type)
		const { isOpen } = this.state

		return (
			<div className={`multiselect ${isOpen ? 'open' : ''}`}>
				<h3 className="multiselect__label">{name}</h3>
				<div className="multiselect__box">
					<ul className="selected-options" id={optionsId} ref={this.selectedEl as React.RefObject<HTMLUListElement>} />
					<input
						onInput={e => this.onInput(e)}
						aria-autocomplete="list"
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