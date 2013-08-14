function forEachIn(object, action) {
  for (var property in object) {
    if (Object.prototype.hasOwnProperty.call(object, property))
      action(property, object[property]);
  }
}

function Dictionary(startValues) {
  this.values = startValues || {};
}
Dictionary.prototype.store = function(name, value) {
  this.values[name] = value;
};
Dictionary.prototype.lookup = function(name) {
  return this.values[name];
};
Dictionary.prototype.contains = function(name) {
  return Object.prototype.hasOwnProperty.call(this.values, name) &&
    Object.prototype.propertyIsEnumerable.call(this.values, name);
};
Dictionary.prototype.each = function(action) {
  forEachIn(this.values,action);
};

function forEach(array, action) {
  for (var i = 0; i < array.length; i++)
    action(array[i]);
}

var thePlan =
  ["############################",
   "#      #    #      o      ##",
   "#                          #",
   "#          #####           #",
   "##         #   #    ##     #",
   "###           ##     #     #",
   "#           ###      #     #",
   "#   ####                   #",
   "#   ##       o             #",
   "# o  #         o       ### #",
   "#    #                     #",
   "############################"];

function Point(x,y) {
    this.x = x;
    this.y = y;
}

Point.prototype.add = function(point) {
    return new Point(this.x + point.x, this.y + point.y);
};

Point.prototype.isEqualTo = function(point) {
    return (this.x == point.x && this.y == point.y);
};

Point.prototype.toString = function() {
  return "(" + this.x + "," + this.y + ")";
};

function Grid(width , height) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height);
}

Grid.prototype.valueAt = function(point) {
    return this.cells[point.x + point.y * this.width];
};

Grid.prototype.setValueAt = function(point,value) {
    this.cells[point.x + point.y * this.width] = value;
};

Grid.prototype.isInside = function(point) {
    return (point.x >= 0 && point.x < this.width && point.y >= 0 && point.y < this.height);
};

Grid.prototype.moveValue = function(from, to) {
    this.setValueAt(to, this.valueAt(from));
    this.setValueAt(from , undefined);
};

Grid.prototype.each = function(action) {
  for (var y = 0; y < this.height; y++) {
    for (var x = 0; x < this.width; x++) {
      var point = new Point(x, y);
      action(point, this.valueAt(point));
    }
  }
};

var directions = new Dictionary(
  {"n":  new Point( 0, -1),
   "ne": new Point( 1, -1),
   "e":  new Point( 1,  0),
   "se": new Point( 1,  1),
   "s":  new Point( 0,  1),
   "sw": new Point(-1,  1),
   "w":  new Point(-1,  0),
   "nw": new Point(-1, -1)});

function StupidBug() {}
StupidBug.prototype.act = function(surroundings) {
  return {type: "move", direction: "s"};
};


var wall = {};

function Terrarium(plan) {
  var grid = new Grid(plan[0].length, plan.length);
  for (var y = 0; y < plan.length; y++) {
    var line = plan[y];
    for (var x = 0; x < line.length; x++) {
      grid.setValueAt(new Point(x, y), elementFromCharacter(line.charAt(x)));
    }
  }
  this.grid = grid;
}

function elementFromCharacter(character) {
  if (character == " ")
    return undefined;
  else if (character == "#")
    return wall;
  else if (character == "o")
    return new StupidBug();
}

wall.character = "#";
StupidBug.prototype.character = "o";

function characterFromElement(element) {
  if (element === undefined)
    return " ";
  else
    return element.character;
}

Terrarium.prototype.toString = function() {
  var characters = [];
  var endOfLine = this.grid.width - 1;
  this.grid.each(function(point, value) {
    characters.push(characterFromElement(value));
    if (point.x == endOfLine)
      characters.push("\n");
  });
  return characters.join("");
};


Terrarium.prototype.listActingCreatures = function() {
  var found = [];
  this.grid.each(function(point, value) {
    if (value !== undefined && value.act)
      found.push({object: value, point: point});
  });
  return found;
};

Terrarium.prototype.listSurroundings = function(center) {
  var result = {};
  var grid = this.grid;
  directions.each(function(name, direction) {
    var place = center.add(direction);
    if (grid.isInside(place))
      result[name] = characterFromElement(grid.valueAt(place));
    else
      result[name] = "#";
  });
  return result;
};

Terrarium.prototype.processCreature = function(creature) {
  var surroundings = this.listSurroundings(creature.point);
  var action = creature.object.act(surroundings);
  if (action.type == "move" && directions.contains(action.direction)) {
    var to = creature.point.add(directions.lookup(action.direction));
    if (this.grid.isInside(to) && this.grid.valueAt(to) === undefined)
      this.grid.moveValue(creature.point, to);
  }
  else {
    throw new Error("Unsupported action: " + action.type);
  }
};

Terrarium.prototype.step = function() {
     forEach(this.listActingCreatures(), bind(this.processCreature, this));
};

function bind(func, object) {
  return function(){
    return func.apply(object, arguments);
  };
}
