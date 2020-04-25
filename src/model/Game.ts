import { action, computed, configure, observable } from 'mobx';
import { Ghost } from './Ghost';
import { makeGhosts, resetGhosts } from './makeGhosts';
import { Maze } from './Maze';
import { PacMan, resetPacMan } from './PacMan';
import { MilliSeconds, PixelsPerFrame } from './Types';
import { Store } from './Store';
import { TimeoutTimer } from './TimeoutTimer';

configure({ enforceActions: 'observed' });

export const DEFAULT_SPEED = 2;

const ENERGIZER_DURATION: MilliSeconds = 5000;

export class Game {
  constructor(store: Store) {
    this.store = store;
    this.pacMan = new PacMan(this);
    this.ghosts = makeGhosts(this);
  }

  store: Store;

  @observable
  externalTimeStamp: MilliSeconds | null = null;

  @observable
  timestamp: MilliSeconds = 0;

  @observable
  lastFrameLength: MilliSeconds = 17;

  @action
  resetRoundRuntime() {
    this.timestamp = 0;
  }

  @observable
  frameCount = 0;

  @observable
  gamePaused = false;

  speed: PixelsPerFrame = DEFAULT_SPEED;

  ghosts: Ghost[];

  pacMan: PacMan;

  @observable
  score = 0;

  @observable
  killedGhosts = 0;

  maze = new Maze();

  @action.bound
  revivePacMan() {
    this.pacMan.send('REVIVED');
    this.resetRoundRuntime();
    resetPacMan(this.pacMan);

    resetGhosts(this.ghosts);
  }

  @computed
  get gameOver(): boolean {
    const pacMan = this.pacMan;
    return pacMan.dead && pacMan.extraLivesLeft === 0;
  }

  energizerTimer = new TimeoutTimer(
    ENERGIZER_DURATION,
    this.handleEnergizerTimedOut
  );

  @action.bound
  handleEnergizerTimedOut() {
    this.pacMan.send('ENERGIZER_TIMED_OUT');
    for (const ghost of this.ghosts) {
      ghost.send('ENERGIZER_TIMED_OUT');
    }
  }

  readyGameForPlay() {
    resetPacMan(this.pacMan);
    this.ghosts[0].ghostPaused = false;
    this.ghosts[1].ghostPaused = false;
    this.ghosts[2].ghostPaused = false;
    this.ghosts[3].ghostPaused = false;
  }
}
