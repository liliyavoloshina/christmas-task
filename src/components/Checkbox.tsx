import '../styles/components/__checkbox.scss'
import { Component } from 'react'

interface CheckboxProps {
	label: string
	name: string
	isChecked: boolean
	onChange(isChecked: boolean): void
}

class Checkbox extends Component<CheckboxProps> {
	constructor(props: CheckboxProps) {
		super(props)
		this.state = {}
	}

	handleChange(isChecked: boolean) {
		const { onChange } = this.props

		onChange(isChecked)
	}

	render() {
		const { label, name, isChecked } = this.props

		return (
			<div className="checkbox">
				<input onChange={e => this.handleChange(e.target.checked)} checked={isChecked} className="checkbox__input" type="checkbox" id={name} name={name} value={name} />
				<label htmlFor={name} className="checkbox__label">
					{label}
				</label>
			</div>
		)
	}
}

export default Checkbox
