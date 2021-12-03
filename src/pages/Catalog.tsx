import { Component } from 'react'
import Card from '../components/Card'
import Item from '../types/Item'
import '../styles/pages/__catalog.scss'

class Catalog extends Component<{}, { items: Item[] }> {
	constructor(props: Readonly<{}>) {
		super(props)
		this.state = {
			items: [] as Item[],
		}
	}

	async componentDidMount() {
		const req = await fetch('data.json')
		const res = await req.json()
		this.setState({ items: res })
	}

	render() {
		const { items } = this.state
		return (
			<div className="catalog">
				<div className="search-bar">
					<input type="text" placeholder="Search..." className="search-bar__input" />
					<button type="button" className="search-bar__expand-btn">
						<span className="material-icons">tune</span>
					</button>
				</div>

				<div className="search-panel">
					{/* <div className="sorting">
                <div className="sorting__group">
                  <div className="sorting__label">Name:</div>
                  <div className="sorting__field">
                    <div>
                      <input id="sort-name-asc" className="radio" name="radio-name" type="radio" checked>
                      <label for="sort-name-asc" className="radio-label">Ascending</label>
                    </div>
                    <div>
                      <input id="sort-name-desc" className="radio" name="radio-name" type="radio">
                      <label for="sort-name-desc" className="radio-label">Descending</label>
                    </div>
                  </div>
                </div>
  
                <div className="sorting__group">
                  <div className="sorting__label">Year:</div>
                  <div className="sorting__field">
                    <div>
                      <input id="sort-year-asc" className="radio" name="radio-year" type="radio" checked>
                      <label for="sort-year-asc" className="radio-label">Ascending</label>
                    </div>
                    <div>
                      <input id="sort-year-desc" className="radio" name="radio-year" type="radio">
                      <label for="sort-year-desc" className="radio-label">Descending</label>
                    </div>
                  </div>
                </div>
              </div> */}

					<div className="selecting">
						<div className="select">
							<h3 className="select__label">Shape</h3>
							<div className="select__box">
								<ul className="selected-options" id="selectShape-selected" />
								<input aria-autocomplete="list" id="selectShape" className="select__input" type="text" />
							</div>
							<div className="select__list" id="listboxShape" />
						</div>

						<div className="select">
							<h3 className="select__label">Color</h3>
							<div className="select__box">
								<ul className="selected-options" id="selectColor-selected" />
								<input aria-autocomplete="list" id="selectColor" className="select__input" type="text" />
							</div>
							<div className="select__list" id="listboxColor" />
						</div>

						<div className="select">
							<h3 className="select__label">Size</h3>
							<div className="select__box">
								<ul className="selected-options" id="selectSize-selected" />
								<input aria-autocomplete="list" id="selectSize" className="select__input" type="text" />
							</div>
							<div className="select__list" id="listboxSize" />
						</div>
					</div>

					<div className="filtering">
						<div className="filter">
							<div className="filter__label">
								Amount: <span id="filter-amount-range" />
							</div>
							<div className="filter__slider">
								<div id="filter-amount" />
							</div>
						</div>
						<div className="filter">
							<div className="filter__label">
								Year: <span id="filter-year-range" />
							</div>
							<div className="filter__slider">
								<div id="filter-year" />
							</div>
						</div>
					</div>

					<div className="only-favorite">
						<input className="checkbox" type="checkbox" id="only-favorite" name="only-favorite" value="Only favorite" />
						<label htmlFor="only-favorite">Only favorite</label>
					</div>

					<div className="search-panel__actions">
						<button type="button" className="btn clear-filter">
							Clear
						</button>
						<button type="button" className="btn save-filter">
							Save
						</button>
					</div>
				</div>

				<div className="items">
					<div className="items__title">Christmas Toys</div>
					<div className="items__list">
						{items.map(item => (
							<Card key={item.id} {...item} />
						))}
					</div>
				</div>
			</div>
		)
	}
}

export default Catalog
