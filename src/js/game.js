var game = {
	settings: {
		paused: true
	},
	handleTick() {
		if (!game.settings.paused) {
			game.stage.update();
			for (var f = 0; f < game.objects.flash.length; f++) {
				game.objects.flash[f].flash();
			}
		}
	},
	preload: {
		files: [],
		start() {
			var loader = new createjs.LoadQueue(false);
			loader.on("fileload", this.fileLoad);
	    loader.on("complete", this.loadComplete);
	    var dataChecker = setInterval(() => {
				if (window.ad.data) {
					for (var c in window.ad.data.components) {
						this.files.push({
							id: c,
							src: window.ad.data.components[c]
						})
					}
					loader.loadManifest(this.files);
				  clearInterval(dataChecker);
				}
	    }, 100);
		},
		fileLoad(event) {
			// console.log(event.result);
			game.objects[event.item.id] = new createjs.Bitmap(event.result);
		},
		loadComplete() {
			console.log('preload complete');
			//Create Game Objects
			game.initObjects();
		}
	},
	flash: {
		create() {
			game.objects.flash = [];
			for (var f = 0; f < 3; f++) {
				game.objects.flash[f] = new createjs.Shape();
				game.objects.flash[f].graphics.f('white').dc(0, 0, 50);
				game.objects.flash[f].alpha = 0;
				game.objects.flash[f].scaleX = 0.1;
				game.objects.flash[f].scaleY = 0.1;
				game.world.addChild(game.objects.flash[f]);
				game.objects.flash[f].x = 160;
				game.objects.flash[f].y = 387;
				game.objects.flash[f].timestate = f * -8;
				game.objects.flash[f].flash = function() {
					this.timestate++
					if (this.timestate <= 15 && this.timestate >= 1 ) {
						if (this.timestate == 1) {
							this.alpha = 0.9;
						}
						else {
							this.alpha -= 0.04;
							this.scaleX += 0.06;
							this.scaleY += 0.06;
						}
					}
					else {
						this.alpha = 0;
						this.scaleY = 0.1;
						this.scaleX = 0.1;
						if (this.timestate > 59) {
							this.timestate = 0;
						}
					}
				}
			}
		},
		destroy() {
			if (!game.objects.flash.destroyed) {
				for (var f = 0; f < game.objects.flash.length; f++) {
					game.world.removeChild(game.objects.flash[f]);
				}
				this.destroyed = true;
				console.log('flash destroyed');
			}
		},
		destroyed: false
	},
	objects: {
	},
  init() {
  	console.log('start game initialization');
    this.stage = new createjs.Stage('canvas');
    createjs.Touch.enable(this.stage);
    
    //Preload Files
		this.preload.start();

    //Create Game World
    this.world = new createjs.Container();
    this.stage.addChild(this.world);

    console.log('game initialization complete');
  },
  initObjects() {
  	this.objects.logo.x = 180;
  	this.objects.logo.y = 390;
  	this.objects.ball.scaleX = 0.7;
  	this.objects.ball.scaleY = 0.7;
  	this.objects.ball.x = 132;
  	this.objects.ball.y = 360;
  	this.objects.text.x = 70;
  	this.objects.text.y = 230;
  	for (var o in this.objects) {
  		this.world.addChild(this.objects[o]);
  	}
  	this.world.setChildIndex( this.objects.ball, this.world.getNumChildren()-1);
  	this.world.setChildIndex( this.objects.goal, this.world.getNumChildren()-1);

  	this.flash.create();
  	console.log('object initialization complete');

  	//start game
  	this.start();
  	this.world.on("mousedown", (evt) => {
		  // console.log(evt);
		  if (!this.flash.destroyed) {
		  	this.flash.destroy();
		  }
  	});
  },
  start() {
  	createjs.Ticker.framerate = 30;
  	this.settings.paused = false;
    this.ticker = new createjs.Ticker.addEventListener("tick", this.handleTick);
  }
};
