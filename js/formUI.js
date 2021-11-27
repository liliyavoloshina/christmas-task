const selects = document.querySelectorAll('.select')

const toggleSelect = (target, select) => {
  if (
    !target.parentNode.classList.contains('select') &&
    !target.parentNode.classList.contains('select__field') &&
    target.nodeName !== 'OPTION' &&
    !select.classList.contains('hidden')
  ) {
    select.classList.add('hidden')
    console.log('remove')
    document.removeEventListener('click', toggleSelect)
  }
}

selects.forEach(parent => {
  const label = parent.querySelector('.select__inner')
  const select = parent.querySelector('.select__field')
  const text = label.innerHTML

  select.addEventListener('click', function() {
    console.log('select clicked')
    select.classList.remove('hidden')

    document.addEventListener('click', e => toggleSelect(e.target, select))

    let selectedOptions = this.selectedOptions
    label.innerHTML = ''
    for (let option of selectedOptions) {
      let button = document.createElement('button')
      button.type = 'button'
      button.className = 'select__btn'
      button.textContent = option.value

      button.addEventListener('click', e => {
        console.log(e)
        e.stopPropagation()
        option.selected = false
        button.remove()
        if (!select.selectedOptions.length) label.innerHTML = text
      })
      label.append(button)
    }
  })
})
