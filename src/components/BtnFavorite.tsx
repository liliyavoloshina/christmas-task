import { Component } from 'react'
import '../styles/components/__btnFavorite.scss'

interface BtnFavoriteProps {
	isFavorite: boolean
}

class BtnFavorite extends Component<BtnFavoriteProps, BtnFavoriteProps> {
	constructor(props: BtnFavoriteProps) {
		super(props)
		this.toggleClass = this.toggleClass.bind(this)
		this.state = {
			isFavorite: props.isFavorite,
		}
	}

	toggleClass() {
		const { isFavorite: currentState } = this.state
		this.setState({ isFavorite: !currentState })
	}

	render() {
		const { isFavorite } = this.state
		let className = 'btn-favorite'
		if (isFavorite) {
			className += ' on'
		}

		return (
			<button className={className} onClick={this.toggleClass} type="button">
				<svg viewBox="0 0 24 24">
					<use xlinkHref="#heart" />
					<use xlinkHref="#heart" />
				</svg>

				<svg className="hide" viewBox="0 0 24 24">
					<defs>
						<path id="heart" d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z" />
					</defs>
				</svg>
			</button>
		)
	}
}

export default BtnFavorite
