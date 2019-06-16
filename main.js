const FPS = 60;
const SPEED = 0.1/FPS; 
const Blink_Rate = 500;
const Snake_Width = 10;
const Snake_Height = 10;

class Game{
	constructor(){
		this.canvas = document.createElement("canvas");
		document.body.insertBefore(this.canvas,document.body.childNodes[0]);
		this.context = this.canvas.getContext('2d');
		this.context.imageSmoothingEnabled= true;
		this.unitY = Math.floor(this.canvas.height*0.1);
		this.unitX = Math.floor(this.canvas.width*0.1);
		this.Text = {
			'title':new TextComponent("SNAKE",this.unitX*5,this.unitY*5,35,"#090"),
			'pause':new TextComponent("PAUSED",this.unitX*5,this.unitY*5,35,"#900"),
			'over':new TextComponent("GAME OVER",this.unitX*5,this.unitY*5,25,"#900"),
			'act':new TextComponent("Press SPACE",this.unitX*5,this.unitY*8,10,"#009")
		}
		this.score = new TextComponent(0,this.unitX*9,this.unitY*1,10);
		this.ended = true;
		this.paused = false;
	}
	clearCanvas(){
		this.context.clearRect(0,0, this.canvas.width, this.canvas.height);
	}
	update(){
		
		apple.update();
		snake.update();
	}
	initalize(){
		this.clearCanvas()
		this.Text['title'].draw();
		this.Text['act'].blink();

		
	}
	pause(){
		clearInterval(this.interval);
		this.Text['pause'].draw();
		this.Text['pause'].blink();
		this.paused = true;
	}
	resume(){
		this.Text['pause'].stopBlinking();
		apple.draw();
		this.interval = setInterval(this.update,FPS);
		this.paused = false;

	}
	
	end(){
		this.ended = true;
		clearInterval(this.interval);
		this.Text['over'].draw();
		this.Text['act'].blink();

	}
	reset(){
		this.Text['act'].stopBlinking();
		clearInterval(this.interval);
		this.clearCanvas()
		this.score.text = 0;
		this.score.draw();
	}

	start(){
		this.reset();
		this.ended = false;
		snake = new Snake();
		apple = new Apple();
		this.interval = setInterval(this.update,FPS);
	}
}

class TextComponent{
	constructor(text,x,y,size,color,font){
		this.text = text;
		this.x = x;
		this.y = y;
		this.size = (size === undefined ? 30:size)
		this.color = (color === undefined? "#000": color);
		this.font = this.size+"px " +  (font === undefined ? "Arial":font);

	}
	blink(){
		if(this.blinker === undefined){
			this.blinker = setInterval(()=>{
				this.draw();
				setTimeout(()=>{this.clear();},Blink_Rate);
			},Blink_Rate*2);
		}
	}

	stopBlinking(){
		clearInterval(this.blinker);
		this.blinker = undefined;
	}
	draw(){

		game.context.font = this.font;
		game.context.textAlign = "center";
		game.context.fillStyle = this.color;
		game.context.fillText(this.text,this.x,this.y);
	}

	clear(){
		game.context.clearRect(0,this.y-this.size,game.canvas.width,this.size)
	}
}



class Apple{
	constructor(){
		this.move()
		this.draw();

	}
	draw(){
		game.context.beginPath();
		game.context.arc(this.x,this.y, 3, 0, 2 * Math.PI);
		game.context.fillStyle = "#900";
		game.context.fill();
	}
	move(){
		this.x = 10 + Math.random() * game.canvas.width-10;
		this.y = 10 + Math.random() * game.canvas.height-10;

	}

	update(){

		
		//Check if apple is eaten
		if(	snake.body[0].x+snake.width > this.x && this.x > snake.body[0].x-snake.width 
				&&  
			snake.body[0].y+snake.height > this.y && this.y > snake.body[0].y-snake.height
			){


			game.clearCanvas();


			game.score.text += 1;
			game.score.draw();
			
			this.move();
			this.draw();

			
			snake.grow(1);
			for (var i = snake.body_size; i >= 0; i--) {
				snake.body[i].draw()
			}
						



		}
		
	}



}
class Snake{
	
	constructor(){
		
		
		this.body_size = 0;

		this.width = 10;
		this.height = 10;
		this.speed = 1;
		this.xVel = this.speed;
		this.yVel = 0;
		this.body = Array(new BodyPart(80,20));

		
	}
	grow(n){
		
		let x = this.body[this.body_size].x-this.xVel
		if(this.xVel !== 0){x-=this.width}

		let y = this.body[this.body_size].y-this.yVel
		if(this.yVel !== 0){y-=this.height}
		this.body.push(new BodyPart(x,y));
		this.body_size++
		if(n > 0){this.grow(--n);}
		return;


	}
	
	update(){
		//Snake eat himself
		for (var i = this.body_size; i > 0; i--) {
			if(this.body[i].x === this.body[0].x && this.body[i].y === this.body[0].y){
				this.body[this.body_size].fillStyle = "#090";
				game.end();
				return
			}
		}
		

		// update the snakes postion

		this.body[this.body_size].clear();
		this.body[this.body_size].x = this.body[0].x+Math.floor(this.width *this.xVel);
		this.body[this.body_size].y = this.body[0].y+Math.floor(this.height*this.yVel);
		this.body[this.body_size].draw();

		this.body.unshift(this.body[this.body_size]);
		this.body.pop();


		//Checking if game is over

		//Snake touched the boundaries
		if(this.body[0].x <= 0 || this.body[0].x
			>= game.canvas.width || this.body[0].y <= 0 || this.body[0].y >= game.canvas.height){
				game.end();
				return
		}

		

		
		

		
	}


}

class BodyPart{
	constructor(x,y){
		this.x = x;this.y = y;
		this.draw();
	}

	draw(){
		game.context.fillStyle = "#090"
		game.context.fillRect(this.x,this.y,Snake_Width,Snake_Height);

	}


	clear(){
		game.context.clearRect(this.x,this.y,Snake_Width,Snake_Height);
	}


}

var game = new Game();
let snake; let apple;
game.initalize();


document.addEventListener("keydown",(e) => {
	e.preventDefault();
	switch(e.keyCode){
		case 32:
			if (game.score.text > 0){
				if(game.ended){
					game.reset();
					game.initalize();
					return;
				}
				if(game.paused){
					game.resume();
					return;
				}
				game.pause();
				return
			}
			game.start();
			break;
		case 37:
			if (snake.xVel > 0){break;}
			snake.xVel = -snake.speed;
			snake.yVel = 0;
			break;
		case 38:
			if (snake.yVel > 0){break;}
			snake.xVel = 0;
			snake.yVel =  -snake.speed;
			break;

		case 39:
			if (snake.xVel < 0){break;}
			snake.xVel = snake.speed;
			snake.yVel = 0;
			break; 
		case 40:
			if (snake.yVel < 0){break;}
			snake.xVel = 0;
			snake.yVel = snake.speed;
			break;
	}
});