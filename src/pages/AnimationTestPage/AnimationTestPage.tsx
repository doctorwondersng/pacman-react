/* eslint-disable jsx-a11y/anchor-is-valid */
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { GhostsView } from '../../components/GhostsView';
import { PacManView } from '../../components/PacMacView';
import { PillsView } from '../../components/PillView';
import { Sprite } from '../../components/Sprite';
import { Board } from '../../components/Board';
import { Game } from '../../lib/Game';
import { StoreProvider, useStore } from '../../lib/StoreContext';
import { useGameLoop } from '../../lib/useGameLoop';

const MazeView: FC<{}> = () => (
  <Sprite className="Sprite-maze" name="maze-state-empty" x={0} y={0} />
);

const FPS: FC<{}> = observer(() => {
  const store = useStore();
  return <p>{Math.round(1000 / store.timeBetweenTicks)} FPS</p>;
});

const Score: FC<{}> = observer(() => {
  const store = useStore();
  return <p>Score: {store.score}</p>;
});

const useKeyboard = (store: Game) => {
  const onKeyDown = useCallback((event: KeyboardEvent) => {
    store.pacMan.setPressedKey(event.key);
  }, []);

  const onKeyUp = useCallback(() => {
    store.pacMan.setPressedKey('');
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  });
};

export const AnimationTestPage: React.FC = observer(() => {
  const store = useMemo(() => {
    const newStore = new Game();
    newStore.ghosts[0].ghostPaused = false;
    return newStore;
  }, []);
  useGameLoop(store);
  useEffect(
    action(() => {
      store.pacMan.setTileCoordinates({ x: 1, y: 1 });
    }),
    []
  );

  useKeyboard(store);

  return (
    <StoreProvider value={store}>
      <div className="Game">
        <Board>
          <MazeView />
          <PillsView />
          <PacManView />
          <GhostsView />
        </Board>
        <br />
        <br />
        <div className="Footer">
          <FPS />
          <Score />
          <a onClick={store.toggleGamePaused}>
            {store.gamePaused ? 'Run' : 'Pause'}
          </a>
          &nbsp;
          {store.pacMan.state !== 'dead' && (
            <a onClick={store.killPacMan}>Kill Pac Man</a>
          )}
          {store.pacMan.state === 'dead' && (
            <a onClick={store.revivePacMan}>Revive Pac Man</a>
          )}
        </div>
      </div>
    </StoreProvider>
  );
});
