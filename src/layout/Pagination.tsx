import '../styles/layout/__pagination.scss'
import { Component } from 'react'

interface PaginationProps {
	totalItems: number
	itemsPerPage: number
	currentPage: number
	onPageChanged(pageNum: number): void
}

class Pagination extends Component<PaginationProps, Record<string, never>> {
	constructor(props: PaginationProps) {
		super(props)
		this.state = {}
	}

	render() {
		const { totalItems, itemsPerPage, onPageChanged, currentPage } = this.props
		const pageAmount = Math.ceil(totalItems / itemsPerPage)

		if (pageAmount === 1) return null

		const btnsAmount = []

		for (let i = 0; i < pageAmount; i++) {
			btnsAmount.push(i)
		}

		return (
			<div className="pagination">
				<div className="pagination__wrapper">
					{btnsAmount.map(pageNum => (
						<button key={pageNum} onClick={() => onPageChanged(pageNum)} type="button" className={`pagination__btn${currentPage === pageNum ? ' active' : ''}`}>
							{pageNum + 1}
						</button>
					))}
				</div>
			</div>
		)
	}
}

export default Pagination
