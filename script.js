var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var player; 
var leftPressed = false;
var rightPressed = false;
var upPressed = false;

var spacePressed = false;
var laser ;
var enemy ;

var main = function(){
    window.requestAnimationFrame(main);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    if (player) {
        player.update();
        player.draw();
        }
        if (enemy) {
        enemy.update();
        enemy.draw();
        }
        if (laser) {
        laser.update();
        laser.draw();
        }
    
    //update and draw sprite
}

function startGame(){
    player = new Ship();
    enemy = new Enemy();
    main()
}

startGame();

/* HELPER FUNCTIONS */

/* moveInDirection
 * Returns a new position {x, y}.
 * PARAMETERS:
 * position: The original position {x, y}
 * angle:    The direction to move (in degrees)
 * distance: The distance to move. 
 */
function moveInDirection(position, angle, distance) {
    var newX, newY;
    newX = position.x + (distance * Math.sin(degToRad(angle)));
    newY = position.y + (-distance * Math.cos(degToRad(angle)));
    return {x: newX, y: newY};
  }
  
  /* degToRad
   * Convert degree angle values to radians 
   * PARAMETERS:
   * degrees: An angle value in degrees 
   */
  function degToRad(degrees) {
    var radians = (Math.PI/180) * degrees;
    return radians;
  }
  
  /* boxCollision
   * Detect if sprite1 collides with sprite2
   * using axis-aligned bounding box technique.
   * Sprites must have 'box' property! 
   * PARAMETERS:
   * sprite1: A sprite object with a box
   * sprite2: A second sprite object with a box 
   */
  function boxCollision(sprite1, sprite2) {
    if (!sprite1 || !sprite2) {
      return;
    }
    var box1 = sprite1.box;
    var box2 = sprite2.box;
    if (box1.x < box2.x + box2.w &&
        box1.x + box1.w > box2.x &&
        box1.y < box2.y + box2.h &&
        box1.h + box1.y > box2.y) {
      return true;  
    }
    return false;
  }
  

  /*
  var Person = function(name,age,height){
      this.name = name;
      this.age = age;
      this.height = height;
      this.sayHi = function(){
          return("Hi my name is "+ this.name);
      }
  }

  bob = new Person("Bob",23,"53 inches")
  console.log(bob);

  console.log(bob.sayHi())
*/
/*
class Person {
    constructor(name,age,height){
        this.name = name;
        this.age = age;
        this.height = height;
    }
    sayHi(){
        return("Hi my name is "+ this.name)
    }
}

sam = new Person("Sam",40,234)
console.log(sam)
console.log(sam.sayHi())
*/
function Laser (){
    this.position = {
      x: 0,
      y: 0
    };
    this.direction = 0;
    this.draw = function() {
      var x =  this.position.x;
      var y = this.position.y;
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.rect(0, 0, 2, 2);
      ctx.fill();
      ctx.translate(-x, -y);
    };
    this.update = function() {
        if (boxCollision(this, enemy)) { // Laser
            enemy = false; // remove the enemy
            }
      

        this.box.x = this.position.x;
        this.box.y = this.position.y;
      this.position = moveInDirection(this.position, this.direction, 5);
    };
    this.box = {
        x: this.position.x,
        y: this.position.y,
        w: 2,
        h: 2 
    }
  };

function Ship() {
    this.position = {
      x: 200,
      y: 150
    }
    this.rotation = 10;

    this.draw = function() {
      var x = this.position.x;
      var y = this.position.y;
      var r = this.rotation;
      ctx.translate(x, y);
      ctx.rotate(degToRad(r));
      ctx.beginPath();
      ctx.moveTo(0, -10); 
      ctx.lineTo(-5, 10);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke(); 
      ctx.rotate(degToRad(-r));
      ctx.translate(-x, -y);
    };
    this.update = function() {
        if (boxCollision(this, enemy)) { // Ship
            player = false; // remove the player
            }
      if (leftPressed) {
        this.rotation -= 10;
      }
      if (rightPressed) {
        this.rotation += 10;
      }
      if (upPressed) {
        this.position = moveInDirection(this.position, this.rotation, 3);
      }
      wrapAround(this);
      this.box.x = this.position.x;
this.box.y = this.position.y;
      if(spacePressed){
          laser = new Laser();
          laser.position = this.position;
          laser.direction = this.rotation;
      }
    };
    this.box = {
        x: this.position.x - 5,
        y: this.position.y - 5,
        w: 10,
        h: 10 
    }
  };

document.addEventListener('keydown',keyDownHandler,false);
document.addEventListener('keyup',keyUpHandler,false);


function keyDownHandler(e){
    if(e.keyCode ==37){
        leftPressed = true;
    }
    else if (e.keyCode == 39){
        rightPressed = true;
    }
    else if (e.keyCode == 38){
        upPressed = true;
    }
    else if (e.keyCode == 32){
        spacePressed = true;
    }
}

function keyUpHandler(e) {
    if (e.keyCode == 37) {
    leftPressed = false;
    } else if (e.keyCode == 39) {
    rightPressed = false;
    } else if (e.keyCode == 38) {
    upPressed = false;
    } else if (e.keyCode == 32) {
    spacePressed = false;
    }
    }

    function wrapAround(sprite) {
        if (sprite.position.x < 0) {
        sprite.position.x = 400;
        } else if (sprite.position.x > 400) {
        sprite.position.x = 0;
        }
        if (sprite.position.y < 0) {
        sprite.position.y = 300;
        } else if (sprite.position.y > 300) {
        sprite.position.y = 0;
        }
        }


    
    function Enemy(){
        this.position = {
            x:0,
            y:0
        }
        this.size = 30;
        this.direction = Math.random() * 360;
        this.speed = 1;

        this.draw = function(){
            var x= this.position.x
            var y = this.position.y;
            ctx.translate(x,y);
            ctx.beginPath();
            ctx.beginPath();
            ctx.rect(0,0,this.size,this.size);
            ctx.stroke()
            ctx.translate(-x,-y);
        }

        this.update = function(){
            this.position = moveInDirection(this.position,this.direction,this.speed);
            wrapAround(this);
            this.box.x = this.position.x;
this.box.y = this.position.y;
        }

        this.box = { // Enemy
            x: this.position.x,
            y: this.position.y,
            w: this.size,
            h: this.size
            };
    
    }

