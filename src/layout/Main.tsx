import { Routes, Route } from 'react-router-dom'
import Start from '../pages/Start'
import Catalog from '../pages/Catalog'
import Play from '../pages/Play'
import '../styles/layout/__main.scss'

function Main() {
	return (
		<main className="main">
			<div className="container">
				<Routes>
					<Route path="/" element={<Start />} />
					<Route path="/catalog" element={<Catalog />} />
					<Route path="/play" element={<Play />} />
				</Routes>
			</div>
		</main>
	)
}

export default Main
