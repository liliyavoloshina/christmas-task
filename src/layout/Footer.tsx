import '../styles/layout/__footer.scss'

function Footer() {
	return (
		<footer className="footer">
			<div className="container">
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
