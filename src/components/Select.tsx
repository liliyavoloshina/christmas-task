import { Component } from 'react'
import '../styles/components/__select.scss'

interface SelectProps {}

interface SelectState {
	isActive: boolean
	innerText: string
}

class Select extends Component<SelectProps, SelectState> {
	constructor(props: SelectProps) {
		super(props)
		this.state = {
			isActive: false,
			innerText: 'by name from A to Z',
		}
	}

	toggleSelect() {
		const { isActive } = this.state
		this.setState({ isActive: !isActive })
	}

	chooseOption(e: React.SyntheticEvent) {
		const { key } = (e.target as HTMLInputElement).dataset
		const text = (e.target as HTMLInputElement).innerHTML
		this.setState({ isActive: false, innerText: text })
		console.log(key)
	}

	render() {
		const options = [
			{ key: 'az', text: 'by name from A to Z' },
			{ key: 'za', text: 'by name from Z to A' },
			{ key: 'asc', text: 'by quantity ascending' },
			{ key: 'desc', text: 'by quantity descending' },
		]

		const { isActive, innerText } = this.state
		return (
			<div className="select-wrapper">
				<h3 className="search-panel-label">Sort</h3>
				<div className={`select ${isActive ? 'active' : ''}`} role="presentation" onClick={() => this.toggleSelect()}>
					{innerText}
				</div>
				<ul className="select-options">
					{options.map(option => (
						<li key={option.key} data-key={option.key} onClick={e => this.chooseOption(e)} role="presentation" className="select-options__option">
							{option.text}
						</li>
					))}
				</ul>
			</div>
		)
	}
}

export default Select
