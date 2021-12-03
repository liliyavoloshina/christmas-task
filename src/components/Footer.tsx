import React from 'react'
import logo from './logo.svg'
import './Footer.css'

const Footer = function() {
	return (
		<footer className='footer'>
			<div className='container'>
				<nav className='nav'>
					<ul className='nav__list'>
						<li className='nav__item'>
							<a href='/start.html' className='nav__link home active' title='Home'>
								<span className='material-icons'>home</span>
							</a>
						</li>
						<li className='nav__item'>
							<a href='/main.html' className='nav__link decor' title='Decor'>
								<span className='material-icons'>filter_vintage</span>
							</a>
						</li>
						<li className='nav__item park'>
							<a href='play.html' className='nav__link trees' title='Play'>
								<span className='material-icons'>park</span>
							</a>
						</li>
						<li className='nav__item'>
							<a href='fav' className='nav__link favorite' title='Favorite'>
								<span className='material-icons'>favorite</span>
							</a>
						</li>
					</ul>
				</nav>

				<div className='copyright'>
					<a href='https://rs.school/js/' className='copyright__school' title='RS'>
						{' '}
					</a>
					<a href='https://github.com/liliyavoloshina' className='copyright__github'>
						liliyavoloshina
					</a>
					<div className='copyright__year'>2021</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
