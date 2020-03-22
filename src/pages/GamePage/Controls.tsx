/* eslint-disable jsx-a11y/anchor-is-valid */
import { observer } from 'mobx-react-lite';
import React, { FC } from 'react';
import { useGame, useStore } from '../../components/StoreContext';
import { ghostCollidesWithPacMan } from '../../lib/detectCollisions';
import styled from 'styled-components/macro';
import { Button, Switch, Typography, Row, Col } from 'antd';
import { action } from 'mobx';

const { Text } = Typography;

export const Controls: FC<{}> = observer(() => {
  const store = useStore();
  const game = useGame();
  return (
    <Layout className="Controls">
      <Button size="small" onClick={store.resetGame}>
        Restart Game
      </Button>
      {game.pacMan.state !== 'dead' && (
        <Button
          className="Controls__KillPacMan"
          size="small"
          onClick={() => {
            ghostCollidesWithPacMan(game.ghosts[0]);
          }}
        >
          Kill Pac Man
        </Button>
      )}
      {game.pacMan.state === 'dead' && (
        <Button
          className="Controls__RevivePacMan"
          size="small"
          onClick={game.revivePacMan}
        >
          Revive Pac Man
        </Button>
      )}

      <Row className="Controls__Paused">
        <Col span={24}>
          <Switch
            checked={game.gamePaused}
            onChange={checked => game.setGamePaused(checked)}
          />
          <Text>Paused</Text>
        </Col>
      </Row>

      <Row className="Controls__GhostViewOptions">
        <Col span={24}>
          <Switch
            checked={store.debugState.ghostViewOptions.target}
            onChange={action(checked => {
              store.debugState.ghostViewOptions.target = checked;
            })}
          />
          <Text>Ghost Target</Text>
        </Col>

        <Col span={24}>
          <Switch
            checked={store.debugState.ghostViewOptions.hitBox}
            onChange={action(checked => {
              store.debugState.ghostViewOptions.hitBox = checked;
            })}
          />
          <Text>Ghost Hitbox</Text>
        </Col>

        <Col span={24}>
          <Switch
            checked={store.debugState.ghostViewOptions.wayPoints}
            onChange={action(checked => {
              store.debugState.ghostViewOptions.wayPoints = checked;
            })}
          />
          <Text>Ghost Waypoints</Text>
        </Col>
      </Row>
    </Layout>
  );
});

const Layout = styled.div`
  margin-top: 24px;

  .Controls__Paused {
    margin-top: 32px;
  }

  .Controls__GhostViewOptions {
    margin-top: 32px;
  }

  .Controls__GhostViewOptions .ant-col {
    margin-top: 8px;
  }

  .Controls__KillPacMan,
  .Controls__RevivePacMan {
    min-width: 120px;
  }

  button {
    margin-right: 8px;
  }
`;
