import '../styles/layout/__nav.scss'
import { NavLink } from 'react-router-dom'

function Nav() {
	return (
		<nav className="nav">
			<div className="nav__wrapper">
				<ul className="nav__list">
					<li className="nav__item">
						<NavLink to="/" className="nav__link home" title="home">
							<span className="material-icons">home</span>
						</NavLink>
					</li>
					<li className="nav__item">
						<NavLink to="/catalog" className="nav__link catalog" title="catalog">
							<span className="material-icons">filter_vintage</span>
						</NavLink>
					</li>
					<li className="nav__item park">
						<NavLink to="/play" className="nav__link play" title="play">
							<span className="material-icons">park</span>
						</NavLink>
					</li>
				</ul>
			</div>
		</nav>
	)
}

export default Nav
