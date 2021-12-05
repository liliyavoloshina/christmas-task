// import * as React from 'react'
// import { Range } from 'react-range'

// interface RangeProps {
// 	type: 'amount' | 'year'
// }

// interface RangeState {
// 	values: number[]
// }

// class SuperSimple extends React.Component<RangeProps, RangeState> {
// 	constructor(props: RangeProps) {
// 		super(props)
// 		this.state = { values: [50] }
// 	}

// 	render() {
// 		const { values } = this.state
// 		return (
// 			<div
// 				style={{
// 					display: 'flex',
// 					justifyContent: 'center',
// 					flexWrap: 'wrap',
// 				}}
// 			>
// 				<Range
// 					values={values}
// 					step={STEP}
// 					min={MIN}
// 					max={MAX}
// 					rtl={rtl}
// 					onChange={value => setValues(values: value)}
// 					renderTrack={({ props, children }) => (
// 						<div
// 							role="presentation"
// 							onMouseDown={props.onMouseDown}
// 							onTouchStart={props.onTouchStart}
// 							style={{
// 								...props.style,
// 								height: '36px',
// 								display: 'flex',
// 								width: '100%',
// 							}}
// 						>
// 							<div
// 								ref={props.ref}
// 								style={{
// 									height: '5px',
// 									width: '100%',
// 									borderRadius: '4px',
// 									background: getTrackBackground({
// 										values,
// 										colors: ['#ccc', '#548BF4', '#ccc'],
// 										min: MIN,
// 										max: MAX,
// 										rtl,
// 									}),
// 									alignSelf: 'center',
// 								}}
// 							>
// 								{children}
// 							</div>
// 						</div>
// 					)}
// 					renderThumb={({ index, props, isDragged }) => (
// 						<div
// 							{...props}
// 							style={{
// 								...props.style,
// 								height: '42px',
// 								width: '42px',
// 								borderRadius: '4px',
// 								backgroundColor: '#FFF',
// 								display: 'flex',
// 								justifyContent: 'center',
// 								alignItems: 'center',
// 								boxShadow: '0px 2px 6px #AAA',
// 							}}
// 						>
// 							<div
// 								style={{
// 									position: 'absolute',
// 									top: '-28px',
// 									color: '#fff',
// 									fontWeight: 'bold',
// 									fontSize: '14px',
// 									fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
// 									padding: '4px',
// 									borderRadius: '4px',
// 									backgroundColor: '#548BF4',
// 								}}
// 							>
// 								{values[index].toFixed(1)}
// 							</div>
// 							<div
// 								style={{
// 									height: '16px',
// 									width: '5px',
// 									backgroundColor: isDragged ? '#548BF4' : '#CCC',
// 								}}
// 							/>
// 						</div>
// 					)}
// 				/>
// 			</div>
// 		)
// 	}
// }

// export default SuperSimple
