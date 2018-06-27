/* global window */
import Mads from 'mads-custom';
import './main.css';

class AdUnit extends Mads {
  constructor() {
    super();

    this.loadJS('https://code.createjs.com/createjs-2015.11.26.min.js').then(() => {
      console.log('easeljs loaded');
      window.game.init();
    });
  }

  render() {
    console.log('data', this.data);

    // this.custTracker = ['http://www.tracker2.com?type={{rmatype}}&tt={{rmatt}}', 'http://www.tracker.com?type={{rmatype}}'];

    // this.tracker('CTR', 'test');

    // this.linkOpener('http://www.google.com');

    return `
      <div class="container" id="ad-container">
        <canvas id="canvas" width="320" height="480"></canvas>
      </div>
    `;
  }

  style() {
    console.log('elements', this.elems);

    // const links = ['https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'];

    return [
      `
      body {
        margin: 0;
      }
    `];
  }

  events() {
    console.log('load events');
  }
}

window.ad = new AdUnit();
