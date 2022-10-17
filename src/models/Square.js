
export class Square {
  constructor(options = {}) {
    this._x = options.x;
    this._y = options.y;
    this._colorChar = options.colorChar || "d";
    this._isWhite = options.isWhite || false
    // this._isLast =this.x === 7;
    // this._isFlippedLast = this.x === 0;
    this._piece = options.piece || null;
    this._rank = (8 - this.y);
    this._column = String.fromCharCode(this.x + 65).toLowerCase();
    this._code = options.code || (this.column+this.rank);
    this._scale = options.scale || 45
    this._draggedY = options.draggedY || 0;
    this._draggedX = options.draggedX || 0;
  }

  doSomething() {
    return this.doSomething();
  }

  get x() { return this._x; }
  set x(x) { this._x = x; }

  get y() { return this._y; }
  set y(y) { this._y = y; }
  
  get colorChar() { return this._colorChar; }
  set colorChar(colorChar) { this._colorChar = colorChar  };

  get isWhite() { return this._isWhite; }
  set isWhite(isWhite) { this._isWhite = isWhite; }

  get piece() { return this._piece; }
  set piece(piece) { this._piece = piece; }

  get rank() { return this._rank; }
  set rank(rank) { this._rank = rank}

  get column() { return this._column; }
  set column(column) { this._column = column  };
  
  get code() { return this._code; }
  set code(code) { this._code = code };

  get scale() { return this._scale; }
  set scale(scale) { this._scale = scale; } 

  get draggedX() { return this._draggedX; }
  set draggedX(draggedX) { this._draggedX = draggedX};

  get draggedY() { return this._draggedY; }
  set draggedY(draggedY) { this._draggedY = draggedY};

}
