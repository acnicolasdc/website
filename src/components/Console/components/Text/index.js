import React from 'react';

const Text = ({ input, isCommand, isError, hasBuffer }) => (<>
	<div>
		{isCommand && <div id="query">➜ ~</div>}
		<span className={!isCommand && isError ? 'error' : ''}>{input}</span>
	</div>
	{hasBuffer && <div></div>}
</>)

export default Text;