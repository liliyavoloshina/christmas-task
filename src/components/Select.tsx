import '../styles/components/__select.scss'
import { Component } from 'react'
import { SortKeys, SortOptions, RadiusKeys } from '../types/Catalog'

interface SelectProps {
	initialSort: SortKeys | RadiusKeys
	type: 'sort' | 'pagination'
	onSelect(key: SortKeys | RadiusKeys): void
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
			options: [],
			innerText: 'by name from A to Z',
		}
	}

	componentDidMount() {
		const { initialSort, type } = this.props
		let options: SortOptions[] = []

		if (type === 'pagination') {
			options = [
				{ key: 5, text: '5' },
				{ key: 10, text: '10' },
				{ key: 20, text: '20' },
				{ key: 30, text: '30' },
				{ key: 60, text: '60' },
			]
		} else {
			options = [
				{ key: 'az', text: 'by name from A to Z' },
				{ key: 'za', text: 'by name from Z to A' },
				{ key: 'asc', text: 'by year ascending' },
				{ key: 'desc', text: 'by year descending' },
			]
		}

		this.setState({ options }, () => {
			const initialText = options.find(option => `${option.key}` === `${initialSort}`)

			this.setState({ innerText: initialText!.text })
		})
	}

	toggleSelect() {
		const { isActive } = this.state
		this.setState({ isActive: !isActive })
	}

	chooseOption(e: React.SyntheticEvent) {
		const { onSelect, type } = this.props
		const { key } = (e.target as HTMLInputElement).dataset
		const text = (e.target as HTMLInputElement).innerHTML
		this.setState({ isActive: false, innerText: text })

		if (type === 'pagination') {
			onSelect(+key! as RadiusKeys)
		} else {
			onSelect(key! as SortKeys)
		}
	}

	render() {
		const { type } = this.props
		const { isActive, innerText, options } = this.state

		const label = type === 'sort' ? 'Sort' : 'Toys per page'

		return (
			<div className="select-wrapper">
				<h3 className="search-panel-label">{label}</h3>
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
