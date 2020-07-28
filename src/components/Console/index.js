import React from 'react';
import Field from './components/Field';
import './styles.css'

const Console = ({ theme }) => {
	const [ maximized, setMaximized ] = React.useState(false)
	const [ title, setTitle ] = React.useState('')
	const handleMinMax = () => {
		setMaximized(!maximized)
		document.querySelector('#field').focus()
	}
	
	return <div id="terminal" style={maximized ? {height: '100vh', width: '100vw', maxWidth: '100vw'} : theme.terminal}>
		<div id="window" style={theme.window}>
			<button className="btn red"/>
			<button id="useless-btn" className="btn yellow"/>
			<button className="btn green" onClick={handleMinMax}/>
			<span id="title" style={{color: theme.window.color}}>{title}</span>
		</div>
		<Field theme={theme} setTitle={setTitle}/>
	</div>
}


export default Console
