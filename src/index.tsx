import './styles/base/base-dir.scss'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import Main from './layout/Main'
import Footer from './layout/Footer'
import Nav from './layout/Nav'
import { logging } from './utils/utils'
import reportWebVitals from './reportWebVitals'

logging()

ReactDOM.render(
	<BrowserRouter>
		<Nav />
		<Main />
		<Footer />
	</BrowserRouter>,
	document.getElementById('root')
)
reportWebVitals()
