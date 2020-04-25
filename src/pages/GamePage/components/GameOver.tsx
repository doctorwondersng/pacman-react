/* eslint-disable jsx-a11y/anchor-is-valid */
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import './GameOver.css';
import { useGame } from './StoreContext';
import { Message } from './Message';
import { TOTAL_DYING_PAC_ANIMATION_LENGTH } from '../../../model/PacMan';

export const TOTAL_TIME_TO_GAME_OVER_MESSAGE = TOTAL_DYING_PAC_ANIMATION_LENGTH;

export const GameOver: FC<{ className?: string }> = observer(
  ({ className }) => {
    const game = useGame();
    const { pacMan } = game;
    const gameOverMessageVisible =
      game.gameOver && pacMan.timeSinceDeath >= TOTAL_TIME_TO_GAME_OVER_MESSAGE;

    return gameOverMessageVisible ? <Message text="Game Over" /> : null;
  }
);
