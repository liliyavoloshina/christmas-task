import '../styles/components/__card.scss'
import { Component } from 'react'
import BtnFavorite from './BtnFavorite'
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
	flippedProps: FlippedProps
	onFavorite(id: string, isFavorite: boolean): void
}

// {
//   "flippedProps": {
//     "data-flip-config": "{\"translate\":true,\"scale\":true,\"opacity\":true}",
//     "data-flip-id": "1",
//     "data-portal-key": "portal"
//   },

class Card extends Component<ItemProps> {
	constructor(props: ItemProps) {
		super(props)
		this.state = {}
	}

	handleFavorite(isFavorite: boolean) {
		const { id, onFavorite } = this.props
		onFavorite(id, isFavorite)
	}

	render() {
		const { id, name, amount, year, shape, color, size, isFavorite, flippedProps } = this.props
		const imageSrc = `images/${id}.png`

		return (
			<div className="card" {...flippedProps}>
				<div className="card__header">
					<h3 className="card__title">{name}</h3>
					<BtnFavorite onFavorite={props => this.handleFavorite(props)} isFavorite={isFavorite} />
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
				</ul>
			</div>
		)
	}
}

export default Card
