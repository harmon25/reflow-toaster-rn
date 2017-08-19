function reflowOven(CS, ovenPin) {
  var Clock = require("clock").Clock;
  this.TC = require("MAX31855").connect(SPI1, CS);
  this._tempInterval = null;
  this._clock = new Clock();
  this._reflowStartMs = null;
  this._cycleStartMs = null;

  this.currentTemp = null;
  this.currentCycle = -1;
  this.ovenPin = ovenPin;
  this.ovenState = 0;
  this._ovenInterval = null;
  this.startTime = this.ovenPin.mode("output");
  this.cycles = [
    { len: 90000, temp: 160, name: "PREHEAT" },
    { len: 75000, temp: 185, name: "SOAK" },
    { len: 50000, temp: 225, name: "REFLOW" }
  ];

  this.startReading();
}

reflowOven.prototype._ovenOn = function(CS) {
  if (this.ovenState !== 1) {
    this.ovenState = 1;
    digitalWrite(this.ovenPin, this.ovenState);
  }
};

reflowOven.prototype._ovenOff = function(CS) {
  if (this.ovenState !== 0) {
    this.ovenState = 0;
    digitalWrite(this.ovenPin, this.ovenState);
  }
};

reflowOven.prototype.getTemp = function() {
  return this.TC.getTemp().temp;
};

reflowOven.prototype.getStatus = function() {
  if (this.currentCycle === -1) {
    return { state: "OFF", temp: this.currentTemp };
  } else {
    return { state: this.cycles[this.currentCycle], temp: this.currentTemp };
  }
};

reflowOven.prototype._tempIntervalFunc = function() {
  if (this.TC !== null) {
    this.currentTemp = this.getTemp();
  }
};

reflowOven.prototype._ovenIntervalFunc = function() {
  if (this.currentCycle !== -1) {
    if (this.currentTemp >= this.cycles[this.currentCycle].temp) {
      this._ovenOff();
    } else if (this.ovenState !== 1) {
      this._ovenOn();
    }
    var msSinceStartOfCycle = this._clock.getDate().ms - this._cycleStartMs;

    if (msSinceStartOfCycle > this.cycles[this.currentCycle].len) {
      if (this.currentCycle < this.cycles.length - 1) {
        this.currentCycle = this.currentCycle + 1;
        this._cycleStartMs = this._clock.getDate().ms;
        console.log("Starting cycle: ", this.cycles[this.currentCycle].name);
      } else {
        this._stopReflow();
        console.log("Reflow Complete!");
      }
    }
  } else {
    this._stopReflow();
  }
};

reflowOven.prototype.startReflow = function() {
  this.currentCycle = 0;
  this._reflowStartMs = this._clock.getDate().ms;
  this._cycleStartMs = this._reflowStartMs;
  console.log("Starting Reflow!");
  this._ovenInterval = setInterval(this._ovenIntervalFunc.bind(this), 500);
  console.log("Starting reflow cycle: ", this.cycles[this.currentCycle].name);
};

reflowOven.prototype.cancelReflow = function() {
  if (this._ovenInterval) {
    this._stopReflow();
  }
};

reflowOven.prototype._stopReflow = function() {
  console.log("Stopping Reflow");
  clearInterval(this._ovenInterval);
  this.currentCycle = -1;
  this._reflowStartMs = null;
  this._cycleStartMs = null;
};

reflowOven.prototype.startReading = function() {
  if (this.TC !== null) {
    this._tempInterval = setInterval(this._tempIntervalFunc.bind(this), 175);
  } else {
    console.log("Thermocouple not initialized!");
  }
};

reflowOven.prototype.stopReading = function() {
  if (this._tempInterval !== null) {
    clearInterval(this._tempInterval);
  }
};

exports.reflowOven = reflowOven;
