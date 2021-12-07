import './styles/base/base-dir.scss'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import Main from './layout/Main'
import Footer from './layout/Footer'
import Nav from './layout/Nav'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
	<BrowserRouter>
		<Main />
		<Nav />
		<Footer />
	</BrowserRouter>,
	document.getElementById('root')
)
reportWebVitals()
