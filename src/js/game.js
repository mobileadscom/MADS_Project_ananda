var game = {
	settings: {
		paused: true,
	},
	goal: false,
	handleTick() {
		if (!game.settings.paused) {
			game.stage.update();
			for (var f = 0; f < game.objects.flash.length; f++) {
				game.objects.flash[f].flash();
			}

			if (game.touchMechanics.touched) {
				game.touchMechanics.inteval++;
			}

			if (game.ballMechanics.rolling && !game.ballMechanics.out) {
				// ball roll
				if (game.ballMechanics.velocity > game.ballMechanics.friction ) {
					game.objects.ball.x += game.ballMechanics.velocity * Math.cos(game.ballMechanics.rollAngle);
					game.objects.ball.y += game.ballMechanics.velocity * Math.sin(game.ballMechanics.rollAngle);
					game.objects.ball.realX = game.objects.ball.x + 28.35;
					game.objects.ball.realY = game.objects.ball.y + 28.35;

					if (game.objects.ball.x < -57 || game.objects.ball.x > 320 || game.objects.ball.y < -57 || game.objects.ball.y > 480) {
						if (!game.goal) {
							game.ballMechanics.rolling = false;
							game.ballMechanics.out = true;
						  game.restart(1000);
						}
						else {
							game.win();
							game.settings.paused = true;
						}
					}

					//detect wall collision
					if (game.objects.ball.y < 145) {
						for (var w = 0; w < game.goalWall.length; w++) {
							var xDist = game.objects.ball.realX - game.goalWall[w].realX;
							var yDist = game.objects.ball.realY - game.goalWall[w].realY;
						
							if (Math.sqrt( xDist * xDist + yDist * yDist) <= 33.35) {
								if (!game.ballMechanics.bounced) {
									game.ballMechanics.bounced = true;
									var adjacentAngle = Math.atan2(yDist, xDist);
									game.ballMechanics.rollAngle = adjacentAngle;
									game.ballMechanics.velocity *= 0.5;
								}
								else {
									game.ballMechanics.bounced = false;
								}
							}
					
						}
					}
					// goal
					if (game.objects.ball.realX > 75 && game.objects.ball.realX < 243 && game.objects.ball.realY < 110 && game.objects.ball.realY > 60) {
						if (!game.goal) {
							console.log('goal');
							game.goal = true;
						}
						
					}
				}
				else {
					if (!game.goal) {
						game.ballMechanics.rolling = false;
						game.ballMechanics.out = true;
					  game.restart(300);
					}
					else {
						game.win();
						game.settings.paused = true;
					}
					
				}
				game.ballMechanics.velocity -= game.ballMechanics.friction;
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
		uPos: { //initial touch position
			x: 0,
			y: 0
		},
		vPos: { //release touch position
			x: 0,
			y: 0
		},
		touched: false,
		inteval: 0 //time interval between touch and release
	},
	ballMechanics: {
		velocity: 0,
		friction: 1,
		rollAngle: 0,
		rolling: false,
		bounced: false,
		out: false, //out of field
		shoot() {
			var xv = (game.touchMechanics.vPos.x - game.touchMechanics.uPos.x) / game.touchMechanics.inteval;
			var yv = (game.touchMechanics.vPos.y - game.touchMechanics.uPos.y) / game.touchMechanics.inteval;
			this.velocity = Math.sqrt(xv * xv + yv * yv);
			this.rollAngle = Math.atan2((game.touchMechanics.vPos.y - game.touchMechanics.uPos.y), (game.touchMechanics.vPos.x - game.touchMechanics.uPos.x));
			this.rolling = true;
		}
	},
	goalWall: [],
  init() {
  	console.log('start game initialization');
    this.stage = new createjs.Stage('canvas'); //'canvas' is the id of <canvas>
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
  	this.objects.ball.realX = 132 + 28.35;
  	this.objects.ball.realY = 360 + 28.35;
  	this.objects.text.x = 70;
  	this.objects.text.y = 230;
  	for (var o in this.objects) {
  		this.world.addChild(this.objects[o]);
  	}
  	this.world.setChildIndex( this.objects.ball, this.world.getNumChildren()-1);
  	this.world.setChildIndex( this.objects.goal, this.world.getNumChildren()-1);

  	this.flash.create();

    for (var w = 0; w < 3; w++) {
    	/*var wall = new createjs.Shape();
			wall.graphics.f('white').dc(75, 50 + w * 25, 5);
			wall.realX = 75;
			wall.realY = 50 + w * 25;
			this.world.addChild(wall);
			this.goalWall.push(wall);*/
			this.goalWall.push({
				realX: 75,
				realY: 50 + w * 25
			});
    }

    for (var w = 0; w < 3; w++) {
    	/*var wall = new createjs.Shape();
			wall.graphics.f('white').dc(243, 50 + w * 25, 5);
			wall.realX = 243;
			wall.realY = 50 + w * 25;
			this.world.addChild(wall);
			this.goalWall.push(wall);*/
			this.goalWall.push({
				realY: 243,
				realY: 50 + w * 25
			});
    }

    for (var w = 0; w < 5; w++) {
    	/*var wall = new createjs.Shape();
			wall.graphics.f('red').dc(110 + w * 25, 50, 5);
			wall.realX = 110 + w * 25;
			wall.realY = 50;
			this.world.addChild(wall);
			this.goalWall.push(wall);*/
			this.goalWall.push({
				realX: 110 + w * 25,
				realY: 50
			});
    }
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
  restart(delay) {
  	var t = 100;
  	if (typeof delay == 'number') {
			t = delay;
  	};
  	setTimeout(() => {
  		this.touchMechanics.uPos.x = 0;
		  this.touchMechanics.uPos.y = 0;
		  this.touchMechanics.vPos.x = 0;
		  this.touchMechanics.vPos.y = 0;
		  this.touchMechanics.touched = false;
		  this.touchMechanics.inteval = 0;

		  this.ballMechanics.velocity = 0;
		  this.ballMechanics.rolling = false;
			this.ballMechanics.out = false;

			this.objects.ball.x = 132;
			this.objects.ball.y = 360;

			this.flash.destroyed = false;
		  this.flash.create();
		}, t);
	  
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

  	this.world.on('pressup', (evt) => {
		this.touchMechanics.vPos.x = evt.stageX;
		this.touchMechanics.vPos.y = evt.stageY;
		this.touchMechanics.touched = false;
		this.ballMechanics.shoot();
  	});
  },
  win() {
		console.log('win');
  }
};
