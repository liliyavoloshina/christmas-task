const firstToUpperCase = (string: string) => {
	const first = string.charAt(0).toUpperCase()
	return first + string.slice(1)
}

function searchOptions(value: string, options: string[] = [], exclude: string[] = []) {
	return options.filter((option: string) => {
		const matches = option.toLowerCase().indexOf(value.toLowerCase()) === 0
		return matches && exclude.indexOf(option) < 0
	})
}

// function filter(yearRange,) {

// }

export { firstToUpperCase, searchOptions }
