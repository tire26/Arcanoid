class Level {
    _map;
    getMap() {
        return this._map;
    }
    setMap(value) {
        this._map = value;
    }
    _maxScores;
    getMaxScores() {
        return this._maxScores;
    }
    setMaxScores(value) {
        this._maxScores = value;
    }

    constructor(map, maxScores) {
        this._map = map;
        this._maxScores = maxScores;
    }
    
}