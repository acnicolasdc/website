import styled, { keyframes } from "styled-components";

const blink = keyframes`
    50% { color: transparent }
`
const bounceIn = keyframes`
  0% {
    transform: translateY(-1000px);
  }
  60% {
    transform: translateY(200px);
  }
  100% {
    transform: translateY(0px);
  }

`;
export const Window = styled.div`
	animation: ${bounceIn} 1s ease-in-out;
    width: 640px;
    textarea, input, button {
	    outline: none;
    }
	.handle {
		height: 22px;

		background: linear-gradient(0deg, rgb(216, 216, 216), rgb(236, 236, 236));

		border-top: 1px solid white;
		border-bottom: 1px solid rgb(179, 179, 179);
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;

		color: rgba(0, 0, 0, 0.7);

		font-family: Helvetica, sans-serif;
		font-size: 13px;

		line-height: 22px;
		text-align: center;
	}

	.buttons {
		position: absolute;
		float: left;

		margin: 0 calc(4px * 2);

		.close {
            padding: 0;
            margin: 0;
            margin-right: 4px;

            width: 12px;
            height: 12px;

            background-color: rgb(220, 220, 220);

            border: 1px solid rgba(0, 0, 0, 0.2);
            border-radius: calc(12px / 2);

            color: rgba(0, 0, 0, 0.5);
			background-color: rgb(255, 97, 89);
		}

		.minimize {
			padding: 0;
            margin: 0;
            margin-right: 4px;

            width: 12px;
            height: 12px;

            background-color: rgb(220, 220, 220);

            border: 1px solid rgba(0, 0, 0, 0.2);
            border-radius: calc(12px / 2);

            color: rgba(0, 0, 0, 0.5);
			background-color: rgb(255, 191, 47);
		}

		.maximize {
            padding: 0;
            margin: 0;
            margin-right: 4px;

            width: 12px;
            height: 12px;

            background-color: rgb(220, 220, 220);

            border: 1px solid rgba(0, 0, 0, 0.2);
            border-radius: calc(12px / 2);

            color: rgba(0, 0, 0, 0.5);
			background-color: rgb(37, 204, 62);
		}
	}

	.terminal {
		padding: 4px;

		background-color: rgba(0, 0, 0, 0.7);
		opacity: 0.7;

		height: calc(480px / 2 - 22px);

		color: white;

		font-family: 'Source Code Pro', monospace;
		font-weight: 200;
		font-size: 14px;

		white-space: pre-wrap;
		white-space: -moz-pre-wrap;
		white-space: -pre-wrap;
		white-space: -o-pre-wrap;
		word-wrap: break-word;

		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
		
		overflow-y: auto;
		
		&::after {
			content: "|";
			animation: ${blink} 2s steps(1) infinite;
		}
	}
`;