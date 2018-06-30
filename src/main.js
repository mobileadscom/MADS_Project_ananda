/* global window */
/* eslint-disable */
import Mads from 'mads-custom';
import './main.css';

class AdUnit extends Mads {
  constructor() {
    super();
    this.something = false;
  }

  render() {
    console.log('data', this.data);

    // this.custTracker = ['http://www.tracker2.com?type={{rmatype}}&tt={{rmatt}}', 'http://www.tracker.com?type={{rmatype}}'];

    // this.tracker('CTR', 'test');

    // this.linkOpener('http://www.google.com');

    return `
      <div class="container" id="ad-container">
        <canvas id="canvas" width="320" height="480"></canvas>
        <div id="ctLayer"></div>
        <video width="320" height="480" id="video" muted controls playsinline>
          <source src="https://rmarepo.richmediaads.com/3794/custom/Ananda_World_Cup/1.0/video/win.mp4" type="video/mp4">
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
    this.loadJS('https://code.createjs.com/createjs-2015.11.26.min.js').then(() => {
      console.log('easeljs loaded');
      const video = window.document.getElementById('video');
      const game = window.document.getElementById('canvas');
      const ctLayer = window.document.getElementById('ctLayer');
      ctLayer.addEventListener('click', () => {
        this.linkOpener('https://www.ananda.com.mm/?utm_source=AdsMy_Display&utm_medium=Banner&utm_campaign=World_Cup_Top_Up&utm_content=Rich_Media');
        this.tracker('CTR', 'link');
        video.pause();
        ctLayer.style.display = 'none';
      });
      video.onplay = () => {
        ctLayer.style.display = 'block';
      };
      const iDevices = ['iphone', 'ipod', 'ipad'];
      var isIos = false;
      for (let i = 0; i < iDevices.length; i += 1) {
        if (window.navigator.userAgent.toLowerCase().indexOf(iDevices[i]) > -1) {
          isIos = true;
        }
      }

      if (!isIos) {
        video.muted = false;
      }

      window.game.init();
      window.game.win = () => {
        game.style.display = 'none';
        video.style.display = 'block';
        ctLayer.style.display = 'block';
        video.play();
        window.ad.tracker('E', 'play');
      };
    });
  }
}

window.ad = new AdUnit();
window.addEventListener('message', (event) => {
  if (event.data.auth.type == 'closeExpandable') {
    var video = window.document.getElementById('video');
    video.pause();
  }
}, false);