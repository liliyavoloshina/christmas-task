import { Component } from 'react'
import '../styles/components/__btn.scss'

interface CardProps {
	isFavorite: boolean
	imageSrc: string
	title: string
	amount: number
	year: number
	shape: 'ball' | 'figure' | 'bell' | 'cone' | 'snowflake'
	color: 'green' | 'white' | 'red' | 'blue'
	size: 'large' | 'medium' | 'small'
}

class Card extends Component<CardProps> {
	constructor(props: CardProps) {
		super(props)
		this.state = {}
	}

	render() {
		// const { text, size, action, accented } = this.props
		// const classes = ['btn', size, action, accented].join(' ').trim()

		return (
			<div className="card">
				<button type="button" className="card__favorite active">
					<span className="material-icons">favorite</span>
				</button>
				<div className="card__img">
					<img
						src="https://images.unsplash.com/photo-1581557991964-125469da3b8a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=833&q=80"
						alt=""
					/>
				</div>
				<div className="card__title">
					<span className="card__name">Buzz Lightyear</span>
					<span className="card__amount">(2)</span>
				</div>
				<ul className="card__info">
					<li className="info">
						Year: <span className="info__value">2000</span>
					</li>
					<li className="info">
						Shape: <span className="info__value">round</span>
					</li>
					<li className="info">
						Color:<span className="info__value">white</span>
					</li>
					<li className="info">
						Size: <span className="info__value">medium</span>
					</li>
				</ul>
			</div>
		)
	}
}

export default Card
