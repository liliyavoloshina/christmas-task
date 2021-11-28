// options for all examples
const options = ['Apple', 'Apricot', 'Banana', 'Blackberry', 'Blueberry', 'Cantaloupe', 'Cherry', 'Date', 'Durian', 'Eggplant', 'Fig', 'Grape', 'Guava', 'Huckleberry']

function filterOptions(options = [], filter, exclude = []) {
  return options.filter(option => {
    const matches = option.toLowerCase().indexOf(filter.toLowerCase()) === 0
    return matches && exclude.indexOf(option) < 0
  })
}

class MultiselectButtons {
  constructor(el, options) {
    this.el = el
    this.selectEl = el.querySelector('.select__box')
    this.inputEl = el.querySelector('input')
    this.listboxEl = el.querySelector('.select__list')

    this.idBase = this.inputEl.id
    this.selectedEl = document.getElementById(`${this.idBase}-selected`)

    // data
    this.options = options
    this.filteredOptions = options

    // state
    this.activeIndex = 0
    this.open = false
  }
  init() {
    this.inputEl.addEventListener('input', this.onInput.bind(this))
    this.inputEl.addEventListener('blur', this.onInputBlur.bind(this))
    this.inputEl.addEventListener('click', () => this.updateMenuState(true))

    this.options.map((option, index) => {
      const optionEl = document.createElement('div')
      optionEl.setAttribute('role', 'option')
      optionEl.id = `${this.idBase}-${index}`
      optionEl.className = index === 0 ? 'select-option option-current' : 'select-option'
      optionEl.setAttribute('aria-selected', 'false')
      optionEl.innerText = option

      optionEl.addEventListener('click', () => {
        this.onOptionClick(index)
      })
      optionEl.addEventListener('mousedown', this.onOptionMouseDown.bind(this))

      this.listboxEl.appendChild(optionEl)
    })
  }
  filterOptions(value) {
    this.filteredOptions = filterOptions(this.options, value)

    // hide/show options based on filtering
    const options = this.el.querySelectorAll('[role=option]')
    ;[...options].forEach(optionEl => {
      const value = optionEl.innerText
      if (this.filteredOptions.indexOf(value) > -1) {
        optionEl.style.display = 'block'
      } else {
        optionEl.style.display = 'none'
      }
    })
  }
  onInput() {
    const curValue = this.inputEl.value
    this.filterOptions(curValue)

    // if active option is not in filtered options, set it to first filtered option
    if (this.filteredOptions.indexOf(this.options[this.activeIndex]) < 0) {
      const firstFilteredIndex = this.options.indexOf(this.filteredOptions[0])
      this.onOptionChange(firstFilteredIndex)
    }

    const menuState = this.filteredOptions.length > 0
    if (this.open !== menuState) {
      this.updateMenuState(menuState, false)
    }
  }
  onInputBlur() {
    if (this.ignoreBlur) {
      this.ignoreBlur = false
      return
    }

    if (this.open) {
      this.updateMenuState(false, false)
    }
  }
  onOptionChange(index) {
    this.activeIndex = index
    this.inputEl.setAttribute('aria-activedescendant', `${this.idBase}-${index}`)

    // update active style
    const options = this.el.querySelectorAll('[role=option]')
    ;[...options].forEach(optionEl => {
      optionEl.classList.remove('option-current')
    })
    options[index].classList.add('option-current')
  }
  onOptionClick(index) {
    this.onOptionChange(index)
    this.updateOption(index)
    this.inputEl.focus()
  }
  onOptionMouseDown() {
    this.ignoreBlur = true
  }
  removeOption(index) {
    const option = this.options[index]

    // update aria-selected
    const options = this.el.querySelectorAll('[role=option]')
    options[index].setAttribute('aria-selected', 'false')
    options[index].classList.remove('option-selected')

    // remove button
    const buttonEl = document.getElementById(`${this.idBase}-remove-${index}`)
    this.selectedEl.removeChild(buttonEl.parentElement)
  }
  selectOption(index) {
    const selected = this.options[index]
    this.activeIndex = index

    // update aria-selected
    const options = this.el.querySelectorAll('[role=option]')
    options[index].setAttribute('aria-selected', 'true')
    options[index].classList.add('option-selected')

    // add remove option button
    const buttonEl = document.createElement('button')
    const listItem = document.createElement('li')
    buttonEl.className = 'remove-option'
    buttonEl.type = 'button'
    buttonEl.id = `${this.idBase}-remove-${index}`
    buttonEl.addEventListener('click', () => {
      this.removeOption(index)
    })
    buttonEl.innerHTML = selected + ' '

    listItem.appendChild(buttonEl)
    this.selectedEl.appendChild(listItem)
  }
  updateOption(index) {
    const option = this.options[index]
    const optionEls = this.el.querySelectorAll('[role=option]')
    const optionEl = optionEls[index]
    const isSelected = optionEl.getAttribute('aria-selected') === 'true'

    if (isSelected) {
      this.removeOption(index)
    } else {
      this.selectOption(index)
    }

    this.inputEl.value = ''
    this.filterOptions('')
  }
  updateMenuState(open, callFocus = true) {
    this.open = open

    this.selectEl.setAttribute('aria-expanded', `${open}`)
    open ? this.el.classList.add('open') : this.el.classList.remove('open')
    callFocus && this.inputEl.focus()
  }
}

const selects = document.querySelectorAll('.select')

selects.forEach(select => {
  const selectComponent = new MultiselectButtons(select, options)
  selectComponent.init()
})
