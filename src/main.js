/* global window */
import Mads from 'mads-custom';
import './main.css';

class AdUnit extends Mads {
  constructor() {
    super();

    this.loadJS('https://code.createjs.com/createjs-2015.11.26.min.js').then(() => {
      console.log('easeljs loaded');
      window.game.init();
      window.game.win = () => {
        const video = window.document.getElementById('video');
        const game = window.document.getElementById('canvas');
        game.style.display = 'none';
        video.style.display = 'block';
        video.play();
      };
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
        <video width="320" height="480" id="video">
          <source src="https://rmarepo.richmediaads.com/3354/custom/worldCup/video/win.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
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
