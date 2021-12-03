import { NavLink } from 'react-router-dom'
import '../styles/layout/__footer.scss'

function Footer() {
	return (
		<footer className="footer">
			<div className="container">
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

				<div className="copyright">
					<a href="https://rs.school/js/" className="copyright__school" title="RS">
						{' '}
					</a>
					<a href="https://github.com/liliyavoloshina" className="copyright__github">
						liliyavoloshina
					</a>
					<div className="copyright__year">2021</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
