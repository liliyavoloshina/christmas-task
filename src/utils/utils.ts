import { Item } from '../types/Item'
import { LightsOffsetType } from '../types/Play'
import { SNOWFLAKES_COUNT } from './constants'

const firstToUpperCase = (string: string) => {
	const first = string.charAt(0).toUpperCase()
	return first + string.slice(1)
}

const mergeSelectedAndOriginal = (selected: Item[], original: Item[]): Item[] => {
	const resettedOriginal = original.map(item => ({ ...item, isSelected: false }))

	const merged = [...resettedOriginal]

	if (selected.length > 0) {
		selected.forEach((selectedItem: Item) => {
			const selectedItemIndex = merged.findIndex((item: Item) => item.id === selectedItem.id)

			if (selectedItemIndex !== -1) {
				merged[selectedItemIndex].isSelected = true
			}
		})
	}

	return merged
}

const idToInitial = (id: string) => id.split('-').slice(0, 1).join('')

const getSnowflakes = () =>
	Array(SNOWFLAKES_COUNT)
		.fill(null)
		.map((value, index) => {
			const randomPaddingLeft = `${Math.random() * 10}px`
			const randomAnimationDuration = `${Math.random() * 5 + 3}s`
			const randomOpacity = Math.random() * 1
			const randomFontSize = `${Math.random() * (1 - 1.4) + 1.4}rem`
			const snowflake = { id: index, paddingLeft: randomPaddingLeft, animationDuration: randomAnimationDuration, opacity: randomOpacity, fontSize: randomFontSize }
			return snowflake
		})

const calculateGarlandOffset = (type: LightsOffsetType, index: number) => {
	if (type === LightsOffsetType.Top) {
		if (index <= 4) {
			return 5
		}
		if (index > 4 && index <= 12) {
			return 10
		}
		if (index > 12 && index <= 24) {
			return 15
		}
		if (index > 24 && index <= 38) {
			return 20
		}
		if (index > 38 && index <= 58) {
			return 22
		}
		if (index > 58 && index <= 80) {
			return 23
		}
	}

	if (index <= 4) {
		return 40
	}
	if (index > 4 && index <= 12) {
		return 20
	}
	if (index > 12 && index <= 24) {
		return -15
	}
	if (index > 24 && index <= 38) {
		return -60
	}
	if (index > 38 && index <= 58) {
		return -120
	}
	if (index > 58 && index <= 80) {
		return -200
	}

	return 0
}

const loadResources = async (arr: string[]) => {
	const loadResource = async (resource: string) => {
		const img = new Image()
		img.src = resource
		await img.decode()
	}

	await Promise.all(
		arr.map(async resource => {
			await loadResource(resource)
		})
	)
}

export { firstToUpperCase, idToInitial, getSnowflakes, mergeSelectedAndOriginal, calculateGarlandOffset, loadResources }
