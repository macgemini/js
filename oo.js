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

function Grid(width , height) {
    this.width = width;
    this.height = height;
    this.cells = new Array(width * height);
}

Grid.protoype.valueAt = function(point) {
    return this.cells[point.x + point.y * this.width];
};

Grid.prototype.setValueAt = function(point,value) {
    this.cells[point.x + point.y * this.width] = value;
};

Grid.prototype.isInside = function(point) {
    return (point.x >= 0 && point.x < this.width && point.y >= 0 && point.y < this.height);
};

Grid.prototype.moveValue = function(from, to) {
    this.setValueAt(to, this.valueAt(from);
    this.setValueAt(from , undefined);
}
