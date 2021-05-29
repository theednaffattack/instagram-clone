import { css } from "@linaria/core";

export const audioControlButton = css`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-family: monospace;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:hover {
    color: var(--audio-button-primary);
  }
`;

export const audioPlayer = css`
  display: flex;
  width: 700px;
  flex-direction: column;
`;

export const buttonStuff = css`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  font-family: monospace;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const controlAndIndicatorsWrap = css`
  align-items: center;
  display: flex;
  margin-left: 15px;
`;

export const timeFormatting = css`
  white-space: nowrap;
  font-feature-settings: tnum;
  font-variant-numeric: tabular-nums;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--focus-outline);
  }
`;

export const forwardBackward = css`
  --hovering-thumb: #fd7e14;
  --teal: #20c997;

  align-items: center;
  background: none;
  border: none;
  border-radius: 50%;
  color: var(--teal);
  cursor: pointer;
  display: flex;
  font-family: monospace;
  font-size: 32px;
  height: 25px;
  margin: 0;
  outline: none;
  padding: 0;
  width: 25px;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--focus-outline);
  }
  &:hover {
    color: var(--hovering-thumb);
  }
`;

export const main = css`
  border: 2px dashed #aa1fbd;
  display: flex;
  flex: 1 1 auto;
  /* flex-direction: column; */
  height: 100%;
`;

export const play = css`
  position: relative;
  left: 3px;
`;

export const playControls = css`
  display: flex;
  align-items: center;
`;

export const playPause = css`
  --text-color: #ffd200;
  --bg: #e83e8c;

  align-items: center;
  background: var(--bg);
  border: none;
  border-radius: 50%;
  color: var(--text-color);
  display: flex;
  font-size: 32px;
  height: 75px;
  justify-content: center;
  transition: all 0.2s ease;
  width: 75px;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--focus-outline);
  }
`;

export const progressBar = css`
  --bar-bg: #ffe3d4;
  --seek-before-width: 0;
  --seek-before-color: #ffc2a1;
  --thumb: #3452a5;
  --selected-thumb: #26c9c3;
  --hovering-thumb: #fd7e14;

  -webkit-appearance: none;
  appearance: none;
  background: var(--bar-bg);
  border-radius: 10px;
  position: relative;
  width: 100%;
  height: 11px;
  outline: none;

  white-space: nowrap;
  font-feature-settings: tnum;
  font-variant-numeric: tabular-nums;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--focus-outline);
  }

  /* progress bar chrome and safari */
  &::before {
    background-color: var(--seek-before-color);
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
    content: "";
    cursor: pointer;
    height: 11px;
    left: 0;
    position: absolute;
    top: 0;
    width: var(--seek-before-width);
    z-index: 2;
  }

  /* firefox */
  &::moz-range-progress {
    background-color: var(--seek-before-color);
    border-bottom-left-radius: 10px;
    border-top-left-radius: 10px;
    height: 11px;
  }

  /* thumb - chrome and safari */
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: var(--thumb);
    border: none;
    border-radius: 50%;
    box-sizing: border-box;
    cursor: pointer;
    height: 15px;
    margin: -2px 0 0 0;
    position: relative;
    width: 15px;
    z-index: 3;
  }

  /* thumb while hovering - chrome and safari */
  &:hover::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: var(--hovering-thumb);
  }

  /* thumb while dragging - chrome and safari */
  &:active::-webkit-slider-thumb {
    -webkit-appearance: none;
    background-color: var(--selected-thumb);
    transform: scale(1.2);
  }

  /* thumb - firefox */
  &::-moz-range-thumb {
    background-color: var(--thumb);
    border: transparent;
    border-radius: 50%;
    box-sizing: border-box;
    cursor: pointer;
    height: 15px;
    margin: -2px 0 0 0;
    position: relative;
    width: 15px;
    z-index: 3;
  }

  /* thumb while dragging - firefox */
  &:active::-moz-range-thumb {
    background: var(--selected-thumb);
    transform: scale(1.2);
  }

  /* for safari */
  &::-webkit-slider-runnable-track {
    background: var(--bar-bg);
    border-radius: 10px;
    position: relative;
    width: 100%;
    height: 11px;
    outline: none;
  }

  /* firefox */
  &::-moz-range-track {
    background: var(--bar-bg);
    border-radius: 10px;
    position: relative;
    width: 100%;
    height: 11px;
    outline: none;
  }

  /* also firefox */
  &::-moz-focus-outer {
    border: 0;
  }
`;
