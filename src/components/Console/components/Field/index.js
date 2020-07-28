import React from 'react';
import Text from '../Text';
import UserText from '../UserText';
import MultiText from '../MultiText';
import { ABOUT, RECOGNIZED_COMMANDS } from '../../information';

class Field extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			commandHistory: [],
			commandHistoryIndex: 0,
			fieldHistory: [{text: `Last login: Thu Jul 23 2020 22:04:32 on console`}],
			userInput: '',
			isMobile: false
		}
		this.recognizedCommands = RECOGNIZED_COMMANDS;
		this.handleTyping = this.handleTyping.bind(this)
		this.handleInputEvaluation = this.handleInputEvaluation.bind(this)
		this.handleInputExecution = this.handleInputExecution.bind(this)
		this.handleContextMenuPaste = this.handleContextMenuPaste.bind(this)
	}
	componentDidMount() {
		if (typeof window.orientation !== "undefined" || navigator.userAgent.indexOf('IEMobile') !== -1) {
			this.setState(state => ({
				isMobile: true,
				fieldHistory: [...state.fieldHistory, {isCommand: true}, {
					text: `Unfortunately due to this application being an 'input-less' environment, mobile is not supported. I'm working on figuring out how to get around this, so please bear with me! In the meantime, come on back if you're ever on a desktop.`,
					isError: true,
					hasBuffer: true
				}]
			}))
		} else {
			const userElem = document.querySelector('#field')
			const themePref = window.localStorage.getItem('reactTerminalThemePref')

			// Disable this if you're working on a fork with auto run enabled... trust me.
			userElem.focus()

			document.querySelector('#useless-btn').addEventListener('click', () => this.setState(state => ({
				fieldHistory: [...state.fieldHistory, {isCommand: true}, {text: 'SYS >> That button doesn\'t do anything.', hasBuffer: true}]
			})))
			
			if (themePref) {
				this.props.setTheme(themePref)
			}
		}
	}
	componentDidUpdate() {
		const userElem = document.querySelector('#field')
		
		userElem.scrollTop = userElem.scrollHeight
	}
	handleTyping(e) {
		e.preventDefault()
		
		const { key, ctrlKey, altKey } = e
		const forbidden = [
			...Array.from({length: 12}, (x, y) => `F${y + 1}`),
			'ContextMenu', 'Meta', 'NumLock', 'Shift', 'Control', 'Alt',
			'CapsLock', 'Tab', 'ScrollLock', 'Pause', 'Insert', 'Home',
			'PageUp', 'Delete', 'End', 'PageDown'
		]

		if (!forbidden.some(s => s === key) && !ctrlKey && !altKey) {
			if (key === 'Backspace') {
				this.setState(state => state.userInput = state.userInput.slice(0, -1))
			} else if (key === 'Escape') {
				this.setState({ userInput: '' })
			} else if (key === 'ArrowUp' || key === 'ArrowLeft') {
				const { commandHistory, commandHistoryIndex } = this.state
				const upperLimit = commandHistoryIndex >= commandHistory.length
				
				if (!upperLimit) {
					this.setState(state => ({
						commandHistoryIndex: state.commandHistoryIndex += 1,
						userInput: state.commandHistory[state.commandHistoryIndex - 1]
					}))
				}
			} else if (key === 'ArrowDown' || key === 'ArrowRight') {
				const { commandHistory, commandHistoryIndex } = this.state
				const lowerLimit = commandHistoryIndex === 0
				
				if (!lowerLimit) {
					this.setState(state => ({
						commandHistoryIndex: state.commandHistoryIndex -= 1,
						userInput: state.commandHistory[state.commandHistoryIndex - 1] || ''
					}))
				}
			} else if (key === 'Enter') {
				const { userInput } = this.state
				
				if (userInput.length) {
					this.setState(state => ({
						commandHistory: userInput === '' ? state.commandHistory : [userInput, ...state.commandHistory],
						commandHistoryIndex: 0,
						fieldHistory: [...state.fieldHistory, {text: userInput, isCommand: true}],
						userInput: ''
					}), () => this.handleInputEvaluation(userInput))
				} else {
					this.setState(state => ({
						fieldHistory: [...state.fieldHistory, {isCommand: true}]
					}))
				}				
			} else {
				this.setState(state => ({
					commandHistoryIndex: 0,
					userInput: state.userInput += key
				}))
			}
		}
	}
	handleInputEvaluation(input) {
		try {
			const evaluatedForArithmetic = math.evaluate(input)

			if (!isNaN(evaluatedForArithmetic)) {
				return this.setState(state => ({fieldHistory: [...state.fieldHistory, {text: evaluatedForArithmetic}]}))
			}

			throw Error
		} catch (err) {
			const { recognizedCommands, giveError, handleInputExecution } = this
			const cleanedInput = input.toLowerCase().trim()
			const dividedInput = cleanedInput.split(' ')
			const parsedCmd = dividedInput[0]
			const parsedParams = dividedInput.slice(1).filter(s => s[0] !== '-')
			const parsedFlags = dividedInput.slice(1).filter(s => s[0] === '-')
			const isError = !recognizedCommands.some(s => s.command === parsedCmd)

			if (isError) {
				return this.setState(state => ({fieldHistory: [...state.fieldHistory, giveError('nr', input)]}))
			}

			return handleInputExecution(parsedCmd, parsedParams, parsedFlags)
		}
	}
	handleInputExecution(cmd, params = [], flags = []) {
		if (cmd === 'help') {
			if (params.length) {
				if (params.length > 1) {
					return this.setState(state => ({
						fieldHistory: [...state.fieldHistory, this.giveError('bp', {cmd: 'HELP', noAccepted: 1})]
					}))
				}
				
				const cmdsWithHelp = this.recognizedCommands.filter(s => s.help)
				
				if (cmdsWithHelp.filter(s => s.command === params[0]).length) {
					return this.setState(state => ({
						fieldHistory: [...state.fieldHistory, {
							text: cmdsWithHelp.filter(s => s.command === params[0])[0].help,
							hasBuffer: true
						}]
					}))
				} else if (this.recognizedCommands.filter(s => s.command === params[0]).length) {
					return this.setState(state => ({
						fieldHistory: [...state.fieldHistory, {
							text: [
								`No additional help needed for ${this.recognizedCommands.filter(s => s.command === params[0])[0].command.toUpperCase()}`,
								this.recognizedCommands.filter(s => s.command === params[0])[0].purpose
							],
							hasBuffer: true
						}]
					}))
				}
				
				return this.setState(state => ({
					fieldHistory: [...state.fieldHistory, this.giveError('up', params[0].toUpperCase())]
				}))
			}
			
			return this.setState(state => ({
				fieldHistory: [...state.fieldHistory, {
					text: [
						'Main commands:',
						...this.recognizedCommands
							.sort((a, b) => a.command.localeCompare(b.command))
							.filter(({ isMain }) => isMain)
							.map(({ command, purpose }) => `${command.toUpperCase()}${Array.from({length: 15 - command.length}, x => '.').join('')}${purpose}`),
						'',
						'All commands:',
						...this.recognizedCommands
							.sort((a, b) => a.command.localeCompare(b.command))
							.map(({ command, purpose }) => `${command.toUpperCase()}${Array.from({length: 15 - command.length}, x => '.').join('')}${purpose}`),
						'',
					],
					hasBuffer: true
				}]
			}))
		} else if (cmd === 'clear') {
			return this.setState({fieldHistory: []})
		} else if (cmd === 'date') {
			return this.setState(state => ({
				fieldHistory: [...state.fieldHistory, {text: `The current date is: ${new Date(Date.now()).toLocaleDateString()}`, hasBuffer: true}]
			}))
		} else if (cmd === 'lean') {
			return this.setState(state => ({
				fieldHistory: [...state.fieldHistory, {text: 'Opening Lean Tech Website...', hasBuffer: true}]
			}), () => window.open('https://www.lean-tech.io/'))
		} else if (cmd === 'about') {
			return this.setState(state => ({
				fieldHistory: [...state.fieldHistory, {text: ABOUT, hasBuffer: true}]
			}))
		} else if (cmd === 'experience') {
			return this.setState(state => ({
				fieldHistory: [...state.fieldHistory, {text: [
					'Certificates:',
					'ReactJS...............................Udacity',
					'Front-end Development.................freeCodeCamp',
					'JS Algorithms and Data Structures.....freeCodeCamp',
					'Front-end Libraries...................freeCodeCamp',
					'Responsive Web Design.................freeCodeCamp',
					'',
					'Work:',
					'Shugoll Research',
					'Database Technician',
					'June 2015 - Present'
				], hasBuffer: true}]
			}))
		} else if (cmd === 'skills') {
			return this.setState(state => ({
				fieldHistory: [...state.fieldHistory, {text: [
					'Languages:',
					'Bash',
					'Golang',
					'JavaScript',
					'',
					'Libraries/Frameworks:',
					'Node',
					'Express',
					'React',
					'Next',
					'React Native',
					'Redux',
					'Gatsby',
					'',
					'Other:',
					'Now',
					'GraphQL',
					'Prisma',
					'Postgresql',
					'Firebase',
				], hasBuffer: true}]
			}))
		} else if (cmd === 'contact') {
			return this.setState(state => ({
				fieldHistory: [...state.fieldHistory, {text: [
					'Email: nicolasreyesbejarano@gmail.com',
					'Website: acnicolasdc.com',
					'LinkedIn: /nicolasreyesb',
					'GitHub: @acnicolasdc',
					'Twitter: @acnicolasdc'
				], hasBuffer: true}]
			}))
		} else if (cmd === 'projects') {
			return this.setState(state => ({
				fieldHistory: [...state.fieldHistory, {text: [
					'To view any of these projects live or their source files, type PROJECT <TITLE>, e.g. PROJECT Minesweeper.',
					'',
					'Minesweeper',
					'Built with React',
					`Some time ago I because increasingly addicted to minesweeper, specifically the version offered by Google. In fact, I was so addicted that I decided to build the damn thing.`,
					'',
					'PuniUrl',
					'Built with Express, Firebase',
					'Ever heard of TinyUrl? Ever been to their website? Atrocious. So I made my own version of it.',
					'',
					'Taggen',
					'Built with Node',
					`I was building a MS Excel spreadsheet parser (haven't finished it, imagine my stove has 10 rows of backburners) and needed a way to generate non-opinionated XML files. There were projects out there that came close, but I decided it would be fun to build it on my own.`,
					'',
					'Forum',
					'Built with React, Redux, Bootstrap',
					`This was a project I had to build for my final while taking Udacity's React Nanodegree certification course. It's an app that tracks posts and comments, likes, etc. Nothing too complicated, except for Redux... God I hate Redux.`,
					'',
					'Simon',
					'Built with vanilla ice cream',
					'The classic Simon memory game. I originally built this for the freeCodeCamp legacy certification, but later came back to it because I hated how bad I was with JavaScript at the time. I also wanted to see how well I could build it during a speed-coding session. Just over an hour.',
				], hasBuffer: true}]
			}))
		} else if (['google', 'duckduckgo', 'bing'].some(s => s === cmd)) {
			return this.setState(state => ({
				fieldHistory: [...state.fieldHistory, {
					text: params.length ? `Searching ${cmd.toUpperCase()} for ${params.join(' ')}...` : `Launching ${cmd.toUpperCase()}...`,
					hasBuffer: true
				}]
			}), () => window.open(params.length ? `https://${cmd}.com/${cmd === 'google' ? 'search' : ''}?q=${params.join('+')}` : `https://${cmd}.com/`, '_blank'))
		}
	}
	handleContextMenuPaste(e) {
		e.preventDefault()
		
		if ('clipboard' in navigator) {
			navigator.clipboard.readText().then(clipboard => this.setState(state => ({
				userInput: `${state.userInput}${clipboard}`
			})))
		}
	}
	giveError(type, extra) {
		const err = { text: '', isError: true, hasBuffer: true}
		
		if (type === 'nr') {
			err.text = `zsh : command not found: ${extra}.`
		} else if (type === 'nf') {
			err.text = `The ${extra} command requires the use of flags. If you don't know what flags can be used, type HELP ${extra}.`
		} else if (type === 'bf') {
			err.text = `The flags you provided for ${extra} are not valid. If you don't know what flags can be used, type HELP ${extra}.`
		} else if (type === 'bp') {
			err.text = `The ${extra.cmd} command requires ${extra.noAccepted} parameter(s). If you don't know what parameters to use, type HELP ${extra.cmd}.`
		} else if (type === 'up') {
			err.text = `The command ${extra} is not supported by the HELP utility.`
		}
		
		return err
	}
	render() {
		const { theme } = this.props
		const { fieldHistory, userInput } = this.state
		
		return <div
					 id="field"
					 className={'light'}
					 style={theme.field}
					 onKeyDown={e => this.handleTyping(e)}
					 tabIndex={0}
					 onContextMenu={e => this.handleContextMenuPaste(e)}
					 >
			{fieldHistory.map(({ text, isCommand, isError, hasBuffer }) => {
				if (Array.isArray(text)) {
					return <MultiText input={text} isError={isError} hasBuffer={hasBuffer}/>
				}
				
				return <Text input={text} isCommand={isCommand} isError={isError} hasBuffer={hasBuffer}/>
			})}
			<UserText input={userInput} theme={theme.cursor}/>
		</div>
	}
}


export default Field;