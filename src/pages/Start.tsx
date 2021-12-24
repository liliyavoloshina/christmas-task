import { Link } from 'react-router-dom'
import Btn from '../components/Btn'
import '../styles/pages/__start.scss'

function Start() {
	return (
		<div className="start-page fullpage">
			<div className="start-page__logo">Decorate a Christmas tree</div>
			<div className="start-page__info">
				How long has it been since the last time you decorated the tree for the new year? Or maybe you don&rsquo;t have time to sort out unnecessary stuff? You have a unique
				opportunity to deal with all the old Christmas tree grandma&rsquo;s toys, decorate the Christmas tree of your dreams and finally get the New Year&rsquo;s mood!
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
