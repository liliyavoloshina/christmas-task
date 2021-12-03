import { Component } from 'react'
import Item from '../types/Item'
import '../styles/components/__btn.scss'

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
				<button type="button" className={`card__favorite ${isFavorite ? 'active' : ''}`}>
					<span className="material-icons">favorite</span>
				</button>
				<div className="card__img">
					<img src={imageSrc} alt={name} />
				</div>
				<div className="card__title">
					<span className="card__name">{name}</span>
					<span className="card__amount">({amount})</span>
				</div>
				<ul className="card__info">
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
