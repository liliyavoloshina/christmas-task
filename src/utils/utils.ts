const firstToUpperCase = (string: string) => {
	const first = string.charAt(0).toUpperCase()
	return first + string.slice(1)
}

function filterOptions(filter: string, options: string[] = [], exclude: string[] = []) {
	return options.filter((option: string) => {
		const matches = option.toLowerCase().indexOf(filter.toLowerCase()) === 0
		return matches && exclude.indexOf(option) < 0
	})
}

export { firstToUpperCase, filterOptions }
