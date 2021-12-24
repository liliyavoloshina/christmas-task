import '../styles/layout/__countdown.scss'
import { Component } from 'react'
import Btn from '../components/Btn'

interface CountdownProps {
	isHidden: boolean
	onClose(): void
}

interface CountdownState {
	timeNextYear: Date
	days: number
	hours: number
	minutes: number
	seconds: number
}

class Countdown extends Component<CountdownProps, CountdownState> {
	private currentYear: number = new Date().getFullYear()

	private timerID: ReturnType<typeof setTimeout> | null

	constructor(props: CountdownProps) {
		super(props)
		this.state = {
			timeNextYear: new Date(`January 01 ${this.currentYear + 1} 00:00:00`),
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
		}
		this.timerID = null
	}

	componentDidMount() {
		this.timerID = setInterval(() => this.updateClock(), 1000)
	}

	componentWillUnmount() {
		clearInterval(this.timerID!)
	}

	handleClose() {
		const { onClose } = this.props
		clearInterval(this.timerID!)
		onClose()
	}

	updateClock() {
		const { timeNextYear } = this.state
		const timeNow = new Date()
		const result = timeNextYear.getTime() - timeNow.getTime()

		const seconds = Math.floor(result / 1000) % 60
		const minutes = Math.floor(result / 1000 / 60) % 60
		const hours = Math.floor(result / 1000 / 60 / 60) % 24
		const days = Math.floor(result / 1000 / 60 / 60 / 24)

		this.setState({
			days,
			hours,
			minutes,
			seconds,
		})
	}

	render() {
		const { isHidden } = this.props
		const { days, hours, minutes, seconds } = this.state

		return (
			<div className={`countdown${isHidden ? ' hidden' : ''}`}>
				<Btn onClick={() => this.handleClose()} icon="close" title="close" />
				<div className="countdown__title">New Year Is Coming!</div>
				<div className="countdown__counter">
					<div className="countdown__display">
						{days} {days > 1 ? 'days' : 'day'}
					</div>
					<div className="countdown__display">
						{hours} {hours > 1 ? 'hours' : 'hour'}
					</div>
					<div className="countdown__display">
						{minutes} {minutes > 1 ? 'minutes' : 'minute'}
					</div>
					<div className="countdown__display">
						{seconds} {seconds > 1 ? 'seconds' : 'second'}
					</div>
				</div>
			</div>
		)
	}
}

export default Countdown
