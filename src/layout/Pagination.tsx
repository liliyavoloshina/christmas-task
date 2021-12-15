/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unused-state */
import '../styles/layout/__pagination.scss'
import { Component } from 'react'

interface PaginationProps {
	totalItems: number
	itemsPerPage: number
	onPageChanged(pageNum: number): void
}

interface PaginationState {
	btnsCount: number[]
}

class Pagination extends Component<PaginationProps, PaginationState> {
	constructor(props: PaginationProps) {
		super(props)
		this.state = {
			btnsCount: [],
		}
	}

	render() {
		const { totalItems, itemsPerPage, onPageChanged } = this.props
		const pageAmount = Math.ceil(totalItems / itemsPerPage)

		if (pageAmount === 1) return null

		const btnsAmount = []

		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < pageAmount; i++) {
			btnsAmount.push(i)
		}

		return (
			<div className="pagination">
				{btnsAmount.map(pageNum => (
					<button key={pageNum} onClick={() => onPageChanged(pageNum)} type="button" className="pagination__btn">
						{pageNum + 1}
					</button>
				))}
			</div>
		)
	}
}

export default Pagination
