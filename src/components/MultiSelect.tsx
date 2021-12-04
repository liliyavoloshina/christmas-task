import React, { Component } from 'react'
import { firstToUpperCase, filterOptions } from '../utils/utils'
import '../styles/components/__multiselect.scss'

interface MultiselectProps {
	type: 'shape' | 'color' | 'size'
}

interface MultiselectState {
	options: string[]
}

class Multiselect extends Component<MultiselectProps, MultiselectState> {
	private list: React.RefObject<HTMLInputElement>

	constructor(props: MultiselectProps) {
		super(props)
		this.state = {
			options: [],
			// filteredOptions: [],
		}
		this.list = React.createRef()
	}

	componentDidMount() {
		this.getOptions()
	}

	onInput(e: React.SyntheticEvent) {
		const curValue = (e.target as HTMLInputElement).value
		this.filterOptions(curValue)

		// this.filterOptions(curValue)

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

	setOptions() {
		const { options } = this.state
		const { type } = this.props

		const multiselectList = this.list.current as HTMLInputElement

		options.forEach((option, index) => {
			const optionEl = document.createElement('div')
			optionEl.setAttribute('role', 'option')
			optionEl.id = `${type}-${index}`
			optionEl.className = index === 0 ? 'multiselect-option option-current' : 'multiselect-option'
			optionEl.setAttribute('aria-selected', 'false')
			optionEl.innerText = option

			// optionEl.addEventListener('click', () => {
			//   this.onOptionClick(index)
			// })
			// optionEl.addEventListener('mousedown', this.onOptionMouseDown.bind(this))

			multiselectList.appendChild(optionEl)
		})
		console.log(this)
	}

	getOptions() {
		const { type } = this.props
		let arr: string[] = []

		if (type === 'shape') {
			arr = ['ball', 'figure', 'bell', 'cone', 'snowflake']
		}

		this.setState({ options: arr }, () => this.setOptions())
	}

	filterOptions(value: string) {
		const { options } = this.state
		const filtered = filterOptions(value, options)

		console.log(filtered)
	}

	updateMenuState(open: boolean, callFocus = true) {
		this.open = open

		this.selectEl.setAttribute('aria-expanded', `${open}`)
		open ? this.el.classList.add('open') : this.el.classList.remove('open')
		callFocus && this.inputEl.focus()
	}

	render() {
		const { type } = this.props
		const optionsId = `multiselect-${type}-selected`
		const inputId = `multiselect-${type}`
		const listId = `listbox-${type}`
		const name = firstToUpperCase(type)

		return (
			<div className="multiselect">
				<h3 className="multiselect__label">{name}</h3>
				<div className="multiselect__box">
					<ul className="selected-options" id={optionsId} />
					<input onInput={e => this.onInput(e)} aria-autocomplete="list" id={inputId} className="multiselect__input" type="text" />
				</div>
				<div className="multiselect__list" ref={this.list} id={listId} />
			</div>
		)
	}
}

export default Multiselect
