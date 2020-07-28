export const ABOUT = [
    'Hi There 👋',
    `I’ve been a software developer for over 5 years.

     I'm a multimedia engineer with strong knowledge in software architecture and UX, specialized in Web Frontend and Backend Development.`,
    `I grew up looking to my dad play the drums, and before I became a Software Developer, I dreamed to be a Rock Star like Angus Young from AC/DC 🤘, but after maybe two years of playing the drums, I knew the software world and I fell in love!. Now I'm Rock Star but of the Software world 💻 ! and the music, my hobby and my soothing when the bugs🐞 are very strangers!`
];


export const RECOGNIZED_COMMANDS =[{
    command: 'help',
    purpose: 'Provides help information for React Terminal commands.'
}, {
    command: 'date',
    purpose: 'Displays the current date.'
}, {
    command: 'clear',
    purpose: 'Clears the screen.'
}, {
    command: 'lean',
    purpose: 'Open current Job.'
}, {
    command: 'theme',
    purpose: 'Sets the color scheme of the React Terminal.',
    help: [
        'THEME <L|LIGHT|D|DARK> [-s, -save]',
        'Sets the color scheme of the React Terminal.',
        '',
        'L, LIGHT.................Sets the color scheme to light mode.',
        'D, DARK..................Sets the color scheme to dark mode.',
        '',
        '-s, -save................Saves the setting to localStorage.'
    ]
}, {
    command: 'time',
    purpose: 'Displays the current time.'
}, {
    command: 'about',
    isMain: true,
    purpose: 'Displays basic information about acnicolasdc.'
}, {
    command: 'experience',
    isMain: true,
    purpose: 'Displays information about acnicolasdc\'s experience.'
}, {
    command: 'skills',
    isMain: true,
    purpose: 'Displays information about acnicolasdc\'s skills as a developer.'
}, {
    command: 'contact',
    isMain: true,
    purpose: 'Displays contact information for acnicolasdc.'
}, {
    command: 'projects',
    isMain: true,
    purpose: 'Displays information about what projects acnicolasdc has done in the past.'
}, ...['google', 'duckduckgo', 'bing'].map(cmd => {
    const properCase = cmd === 'google' ? 'Google' : cmd === 'duckduckgo' ? 'DuckDuckGo' : 'Bing'
    
    return {
        command: cmd,
        purpose: `Searches a given query using ${properCase}.`,
        help: [
            ` ${cmd.toLowerCase()} <QUERY>`,
            `Searches a given query using ${properCase}. If no query is provided, simply launches ${properCase}.`,
            '',
            `QUERY....................It\'s the same as if you were to type inside the ${properCase} search bar.`
        ]
    }
})]