import { observable, action, computed } from 'mobx';

import { Direction } from './Types';
import { PacManPhase } from '../components/PacMacView';
import {
  tileFromScreen,
  screenFromTile,
  TileCoordinates,
  ScreenCoordinates,
  assertValidTileCoordinates,
} from './Coordinates';
import { makePacManStateChart } from './PacManStateChart';
import { Game } from './Game';

export type DyingPacManPhase = number;
export const DyingPacManPhaseCount = 13;
export const DyingPacManPhases: DyingPacManPhase[] = Array.from(
  Array(DyingPacManPhaseCount).keys()
);

export class PacMan {
  constructor(game: Game) {
    this.game = game;

    this.stateChart.onTransition(state => {
      if (!state.changed) {
        return;
      }
      this.setState(this.stateChart.state.value as string);
    });
    this.stateChart.start();
  }

  game: Game;

  stateChart = makePacManStateChart({
    onDead: this.onDead,
  });

  @action.bound
  onDead() {
    this.diedAtTimestamp = this.game.timestamp;
  }

  @computed
  get dead(): boolean {
    return this.diedAtTimestamp > this.game.timestamp;
  }

  @observable
  state = this.stateChart.state.value;

  @action
  setState(state: string) {
    this.state = state;
  }

  send(event: string) {
    this.stateChart.send(event);
  }

  @observable
  screenCoordinates: ScreenCoordinates = screenFromTile({ x: 1, y: 1 });

  @action setScreenCoordinates(screen: ScreenCoordinates) {
    this.screenCoordinates = screen;
  }

  @action
  moveBy(delta: ScreenCoordinates) {
    this.screenCoordinates.x += delta.x;
    this.screenCoordinates.y += delta.y;
  }

  @action
  setTileCoordinates(tile: TileCoordinates) {
    assertValidTileCoordinates(tile);
    this.screenCoordinates = screenFromTile(tile);
  }

  @computed
  get tileCoordinates(): TileCoordinates {
    return tileFromScreen(this.screenCoordinates);
  }

  @computed
  get phase(): PacManPhase {
    const step = Math.round(this.game.timestamp / 200) % 4;
    const phase = step === 3 ? 1 : step;
    return phase as PacManPhase;
  }

  @observable
  diedAtTimestamp = 0;

  @computed
  get dyingPhase(): DyingPacManPhase {
    const deadMilliSeconds = this.game.timestamp - this.diedAtTimestamp;
    let dyingPhase: number = Math.floor(deadMilliSeconds / 200);
    if (dyingPhase >= DyingPacManPhaseCount) {
      dyingPhase = DyingPacManPhaseCount - 1;
    }
    return dyingPhase as DyingPacManPhase;
  }

  @observable
  direction: Direction = 'RIGHT';
  nextDirection: Direction = 'RIGHT';

  @action.bound
  setPressedKey(pressedKey: string) {
    if (pressedKey === 'ArrowLeft') {
      this.nextDirection = 'LEFT';
    } else if (pressedKey === 'ArrowRight') {
      this.nextDirection = 'RIGHT';
    } else if (pressedKey === 'ArrowUp') {
      this.nextDirection = 'UP';
    } else if (pressedKey === 'ArrowDown') {
      this.nextDirection = 'DOWN';
    }
  }
}
