import { Component } from 'react'
import { SortKeys, SortOptions } from '../types/Catalog'
import '../styles/components/__select.scss'

interface SelectProps {
	initialSort: SortKeys
	onSelect(key: string): void
}

interface SelectState {
	isActive: boolean
	options: SortOptions[]
	innerText: string
}

class Select extends Component<SelectProps, SelectState> {
	constructor(props: SelectProps) {
		super(props)
		this.state = {
			isActive: false,
			options: [
				{ key: 'az', text: 'by name from A to Z' },
				{ key: 'za', text: 'by name from Z to A' },
				{ key: 'asc', text: 'by year ascending' },
				{ key: 'desc', text: 'by year descending' },
			],
			innerText: '',
		}
	}

	componentDidMount() {
		const { initialSort } = this.props
		const { options } = this.state
		const initialText = options.find(option => option.key === initialSort)
		this.setState({ innerText: initialText!.text })
	}

	toggleSelect() {
		const { isActive } = this.state
		this.setState({ isActive: !isActive })
	}

	chooseOption(e: React.SyntheticEvent) {
		const { onSelect } = this.props
		const { key } = (e.target as HTMLInputElement).dataset
		const text = (e.target as HTMLInputElement).innerHTML
		this.setState({ isActive: false, innerText: text })
		onSelect(key!)
	}

	render() {
		const { isActive, innerText, options } = this.state

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
