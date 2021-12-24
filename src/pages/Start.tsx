import { Link } from 'react-router-dom'
import Btn from '../components/Btn'
import '../styles/pages/__start.scss'

function Start() {
	return (
		<div className="start-page fullpage">
			<div className="start-page__logo">Decorate a Christmas tree</div>
			<div className="start-page__info">
				Lorem, ipsum dolor sit amet consectetur adipisicing elit. Numquam vero, consequatur quidem ad animi officia eligendi adipisci. In exercitationem doloremque hic repellat
				nobis veniam impedit delectus quas quidem ut? Magni modi atque quibusdam tempore minus ea voluptatibus soluta accusantium, aliquid consequatur! Veritatis, aspernatur quidem
				unde sequi laudantium eligendi eum labore nemo ipsam fuga iusto nisi illo quisquam. Officia aspernatur asperiores iste repellat.
			</div>
			<div className="start-page__action">
				<Link to="/catalog">
					<Btn text="Start" accented size="lg" />
				</Link>
			</div>
		</div>
	)
}

export default Start
