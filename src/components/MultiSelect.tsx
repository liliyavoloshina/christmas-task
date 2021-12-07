import '../styles/components/__multiselect.scss'
import React, { Component } from 'react'
import { MultiselectOptions } from '../types/Filter'
import { firstToUpperCase } from '../utils/utils'

interface MultiselectProps {
	type: 'shape' | 'color' | 'size'
	options: MultiselectOptions
	initialFilter: string[]
	onFilter(options: string[]): void
}

interface MultiselectState {
	isOpen: boolean
	ignoreBlur: boolean
}

class Multiselect extends Component<MultiselectProps, MultiselectState> {
	private inputEl: React.RefObject<HTMLInputElement>

	private selectedEl: React.RefObject<HTMLUListElement>

	constructor(props: MultiselectProps) {
		super(props)
		this.state = {
			isOpen: false,
			ignoreBlur: true,
		}
		this.inputEl = React.createRef()
		this.selectedEl = React.createRef()
	}

	// eslint-disable-next-line react/no-unused-class-component-methods
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

	// eslint-disable-next-line react/no-unused-class-component-methods
	onOptionMouseDown() {
		this.setState({ ignoreBlur: true })
	}

	toggleOption(optionName: string, isSelected: boolean) {
		const inputEl = this.inputEl.current as HTMLInputElement
		inputEl.focus()
		if (isSelected) {
			this.removeOption(optionName)
		} else {
			this.addOption(optionName)
		}
	}

	addOption(optionName: string) {
		const { initialFilter, onFilter } = this.props
		const updatedOptions = [...initialFilter, optionName]
		onFilter(updatedOptions)
	}

	removeOption(optionName: string) {
		const { initialFilter, onFilter } = this.props
		const updatedOptions = initialFilter.filter((option: string) => option !== optionName)
		onFilter(updatedOptions)
	}

	updateMenuState(open: boolean, callFocus: boolean = true) {
		this.setState({ isOpen: open })

		if (callFocus) {
			const inputEl = this.inputEl.current as HTMLInputElement
			inputEl.focus()
		}
	}

	render() {
		const { type, initialFilter, options } = this.props
		const { isOpen } = this.state
		const optionsId = `multiselect-${type}-selected`
		const inputId = `multiselect-${type}`
		const listId = `listbox-${type}`
		const name = firstToUpperCase(type)

		return (
			<div className={`multiselect ${isOpen ? 'open' : ''}`}>
				<h3 className="search-panel-label">{name}</h3>
				<div className="multiselect__box">
					<ul className="selected-options" id={optionsId} ref={this.selectedEl as React.RefObject<HTMLUListElement>}>
						{initialFilter.map((option, index) => (
							<li key={option}>
								<button onClick={() => this.removeOption(option)} type="button" className="remove-option" id={`${type}-remove-${index}`}>
									{option}
								</button>
							</li>
						))}
					</ul>
					<input
						// onBlur={() => this.onBlur()}
						onClick={() => this.updateMenuState(true)}
						autoComplete="off"
						ref={this.inputEl as React.RefObject<HTMLInputElement>}
						id={inputId}
						className="multiselect__input"
						type="text"
					/>
				</div>
				<ul className="multiselect__list" id={listId}>
					{options.map((option, index) => {
						const isSelected = initialFilter.includes(option)

						return (
							<li
								key={option}
								onClick={() => this.toggleOption(option, isSelected)}
								role="presentation"
								id={`${type}-${index}`}
								className={`multiselect-option ${isSelected ? 'option-selected' : null}`}
							>
								{option}
							</li>
						)
					})}
				</ul>
			</div>
		)
	}
}

export default Multiselect
