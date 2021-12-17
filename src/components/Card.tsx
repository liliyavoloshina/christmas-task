import '../styles/components/__card.scss'
import { Component } from 'react'
import BtnSelected from './BtnSelected'
import { FlippedProps } from '../types/utils'

interface ItemProps {
	id: string
	name: string
	amount: number
	year: number
	shape: 'ball' | 'figure' | 'bell' | 'cone' | 'snowflake'
	color: 'green' | 'white' | 'red' | 'blue' | 'yellow'
	size: 'large' | 'medium' | 'small'
	isFavorite: boolean
	isSelected: boolean
	flippedProps: FlippedProps
	isCardExpanded: boolean
	onSelect(id: string, isSelected: boolean): void
}

class Card extends Component<ItemProps> {
	constructor(props: ItemProps) {
		super(props)
		this.state = {}
	}

	handleSelect(isSelected: boolean) {
		const { id, onSelect } = this.props
		onSelect(id, isSelected)
	}

	render() {
		const { id, name, amount, year, shape, color, size, isFavorite, isSelected, flippedProps, isCardExpanded } = this.props
		const imageSrc = `images/${id}.png`

		return (
			<div className={`card${isCardExpanded ? ' expanded' : ''}`} {...flippedProps}>
				<div className="card__header">
					<h3 className="card__title">{name}</h3>
					<BtnSelected onSelect={props => this.handleSelect(props)} isSelected={isSelected} />
				</div>
				<div className="card__img">
					<img src={imageSrc} alt={name} />
				</div>
				<ul className="card__info">
					<li className="info">
						Amount: <span className="info__value">{amount}</span>
					</li>
					<li className="info">
						Year: <span className="info__value">{year}</span>
					</li>
					<li className="info">
						Shape: <span className="info__value">{shape}</span>
					</li>
					<li className="info">
						Color:<span className="info__value">{color}</span>
					</li>
					<li className="info">
						Size: <span className="info__value">{size}</span>
					</li>
					<li className="info">
						Granny favorite: <span className="info__value">{`${isFavorite ? 'yes' : 'no'}`}</span>
					</li>
				</ul>
			</div>
		)
	}
}

export default Card
