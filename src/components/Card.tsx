import { Component } from 'react'
import BtnFavorite from './BtnFavorite'
import Item from '../types/Item'
import '../styles/components/__card.scss'

class Card extends Component<Item> {
	constructor(props: Item) {
		super(props)
		this.state = {}
	}

	render() {
		const { id, name, amount, year, shape, color, size, isFavorite } = this.props
		const imageSrc = `images/${id}.png`

		return (
			<div className="card">
				<div className="card__header">
					<h3 className="card__title">{name}</h3>
					<BtnFavorite isFavorite={isFavorite} />
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
