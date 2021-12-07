import '../styles/layout/__nav.scss'
import { NavLink } from 'react-router-dom'

function Nav() {
	return (
		<nav className="nav">
			<ul className="nav__list">
				<li className="nav__item">
					<NavLink to="/" className="nav__link home" title="Home">
						<span className="material-icons">home</span>
					</NavLink>
				</li>
				<li className="nav__item">
					<NavLink to="/catalog" className="nav__link catalog" title="Catalog">
						<span className="material-icons">filter_vintage</span>
					</NavLink>
				</li>
				<li className="nav__item park">
					<NavLink to="/play" className="nav__link play" title="Play">
						<span className="material-icons">park</span>
					</NavLink>
				</li>
			</ul>
		</nav>
	)
}

export default Nav
