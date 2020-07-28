import React from 'react';
import Text from '../Text';

const MultiText = ({ input, isError, hasBuffer }) => (<>
	{input.map(s => <Text input={s} isError={isError}/>)}
	{hasBuffer && <div></div>}
</>)

export default MultiText;