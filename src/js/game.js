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

			if (game.touchMechanics.touched) {
				game.touchMechanics.inteval++;
			}

			if (game.ballMechanics.rolling) {
			  var modulusX = game.ballMechanics.velocity.x < 0 ? -game.ballMechanics.velocity.x : game.ballMechanics.velocity.x;
				var modulusY = game.ballMechanics.velocity.y < 0 ? -game.ballMechanics.velocity.y : game.ballMechanics.velocity.y;
				
				if (modulusX > game.ballMechanics.friction / 2) {
					game.ballMechanics.velocity.x = game.ballMechanics.velocity.x < 0 ? game.ballMechanics.velocity.x + game.ballMechanics.friction : game.ballMechanics.velocity.x - game.ballMechanics.friction;
				  game.objects.ball.x += game.ballMechanics.velocity.x;
				}

				if (modulusY > game.ballMechanics.friction / 2) {
				  game.ballMechanics.velocity.y = game.ballMechanics.velocity.y < 0 ? game.ballMechanics.velocity.y + game.ballMechanics.friction : game.ballMechanics.velocity.y - game.ballMechanics.friction;
				  game.objects.ball.y += game.ballMechanics.velocity.y;
				}

			  // console.log(modulusX, modulusY);
			  console.log(game.objects.ball.x, game.objects.ball.y);
				
				if (modulusX <= game.ballMechanics.friction && modulusY <= game.ballMechanics.friction ) {
					game.ballMechanics.rolling = false;
				}
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
	touchMechanics: {
		uPos: {
			x: 0,
			y: 0
		},
		vPos: {
			x: 0,
			y: 0
		},
		touched: false,
		inteval: 0
	},
	ballMechanics: {
		velocity: {
			x: 0,
			y: 0
		},
		friction: 1,
		rolling: false,
		shoot() {
			this.velocity.x = (game.touchMechanics.vPos.x - game.touchMechanics.uPos.x) / game.touchMechanics.inteval;
			this.velocity.y = (game.touchMechanics.vPos.y - game.touchMechanics.uPos.y) / game.touchMechanics.inteval;
			this.rolling = true;
		}
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
  },
  start() {
  	createjs.Ticker.framerate = 30;
  	this.settings.paused = false;
    this.ticker = new createjs.Ticker.addEventListener("tick", this.handleTick);
    this.events();
  },
  events() {
  	this.world.on("mousedown", (evt) => {
			// console.log(evt);
			if (!this.flash.destroyed) {
		  	this.flash.destroy();
			}
			this.touchMechanics.touched = true;
			this.touchMechanics.inteval = 0;
  		this.touchMechanics.uPos.x = evt.stageX;
  		this.touchMechanics.uPos.y = evt.stageY;
  	});

  	// this.world.on('pressmove', (evt) => {
  	// 	var xDist = evt.stageX - this.touchMechanics.uPos.x;
  	// 	var yDist = evt.stageY - this.touchMechanics.uPos.y;
  	// 	xDist = xDist < 0 ? -xDist : xDist;
  	// 	yDist = yDist < 0 ? -yDist : yDist;

			// if (xDist > 5 || yDist > 5 ) {
			// 	this.touchMechanics.touched = true;
			// 	// this.touchMechanics.inteval = 0;
			// }
			
			// console.log(evt.stageX, evt.stageY);
  	// });

  	this.world.on('pressup', (evt) => {
			this.touchMechanics.vPos.x = evt.stageX;
			this.touchMechanics.vPos.y = evt.stageY;
			this.touchMechanics.touched = false;
			this.ballMechanics.shoot();
  	});
  }
};
