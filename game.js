var stack = {};
stack.run = true;
stack.score = 0;
stack.speed = 0;
stack.width = 400;
stack.blocks = [];

stack.gameCycle = function() {
  if (stack.run) {
    var lastBlock = stack.getLastBlock();
    Crafty.viewport.y = 271 - lastBlock.getLastBlock().y;
    stack.tapElement.y = -Crafty.viewport.y;
    Crafty.viewport.x = 200 - ((lastBlock.getLastBlock().x) + (lastBlock.getLastBlock().w / 2));
    if (!lastBlock.move) {
      if (lastBlock.x > lastBlock.getLastBlock().x) {
        lastBlock.w = (lastBlock.getLastBlock().x + lastBlock.getLastBlock().w) - (lastBlock.x);
      }
      else {
        lastBlock.w = (lastBlock.x + lastBlock.w) - (lastBlock.getLastBlock().x);
        lastBlock.x = lastBlock.getLastBlock().x;
      }
      if (lastBlock.w <= 0) {
        lastBlock.w = 0;
        stack.run = false;
      }
      else {
        stack.score++;
        if (stack.blocks.length >= 9) {
          var firstBlock = stack.blocks.shift();
          var r = firstBlock._red;
          var g = firstBlock._green;
          var b = firstBlock._blue;
          document.body.style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ')';
        }
        stack.spawnBlock();
      }
      return;
    }
    if (lastBlock.right) {
      lastBlock.x += 5;
    }
    else {
      lastBlock.x -= 5;
    }
    if (lastBlock.x > 400 - Crafty.viewport.x) {
      lastBlock.right = false;
    }
    else if (lastBlock.x < -lastBlock.w - Crafty.viewport.x) {
      lastBlock.right = true;
    }
    document.getElementById('score').innerHTML = ' - ' + stack.score;
  }
  else {
    document.getElementById('score').innerHTML = ' - ' + stack.score + ' game over - <a href="' + window.location.href + '">restart</a>';
    clearInterval(stack.gameCycleInterval);
  }
};

stack.getLastBlock = function() {
  var lastBlock = stack.blocks.pop();
  if (typeof lastBlock !== 'undefined') {
    stack.blocks.push(lastBlock);
  }
  return lastBlock;
}

stack.spawnBlock = function() {
  var x = 0;
  var y = 482;
  var right = true;
  var w = 400;
  var lastBlock = stack.getLastBlock();
  if (typeof lastBlock !== 'undefined') {
    w = lastBlock.w;
    x = -Crafty.viewport.x + 3 - w;
    y = lastBlock.y - 30;
    right = !lastBlock.right;
    if (!right) {
      x = -Crafty.viewport.x + 400 - 3;
    }
    stack.color.r = Math.floor(lastBlock._red + (Math.random() * 10) - 5);
    stack.color.g = Math.floor(lastBlock._green + (Math.random() * 10) - 5);
    stack.color.b = Math.floor(lastBlock._blue + (Math.random() * 10) - 5);
  }
  var block = Crafty.e('2D, Canvas, Color, Keyboard')
    .attr({i: stack.blocks.length, x: x, y: y, w: w, h: 30, right: right, move: true})
    .color(stack.color.r, stack.color.g, stack.color.b)
    .bind('KeyDown', function(e) {
      if(e.key == Crafty.keys.SPACE) {
        this.move = false;
      }
    });
  block.getLastBlock = function() {
    return stack.blocks[this.i - 1];
  };
  stack.blocks.push(block);
};

document.addEventListener('DOMContentLoaded', function(event) {
  stack.color = {
    r: 238,
    g: 238,
    b: 238
  };
  document.body.style.backgroundColor = 'rgb(' + stack.color.r + ', ' + stack.color.g + ', ' + stack.color.b + ')';
  Crafty.init(400, 540, document.getElementById('game'));
  Crafty.viewport.init(400, 540, document.getElementById('game'));
  Crafty.background('#fff');
  stack.blocks.push(Crafty.e('2D, Canvas, Color')
    .attr({i: stack.blocks.length, x: 0, y: 512, w: 400, h: 270, right: false, move: false})
    .color(stack.color.r, stack.color.g, stack.color.b)
  );
  Crafty.e('2D, Canvas, Color')
    .attr({x: -512, y: 512, w: 1424, h: 286})
    .color(stack.color.r, stack.color.g, stack.color.b);
  stack.tapElement = Crafty.e('2D, Canvas, Color, Mouse')
    .attr({x: -512, y: 0, w: 1424, h: 540})
    .color(0, 0, 0, 0)
    .bind('MouseDown', function() {
      stack.getLastBlock().move = false;
    });
  stack.spawnBlock();
  stack.gameCycleInterval = setInterval(stack.gameCycle, 10);
});

