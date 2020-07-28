import React from 'react';

const UserText = ({ input, theme }) => <div>
	<div id="query">➜ ~</div>
	<span>{input}</span>
	<div id="cursor" style={theme}></div>
</div>


export default UserText;