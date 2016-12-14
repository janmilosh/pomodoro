var timeoutId;

var vm = new Vue({
  el: '#timer',
  data: {
    innerMaxDash: 471.24,
    outerMaxDash: 942.47,
    innerCurrentDash: 0,
    outerCurrentDash: 0,
    maxWorkMin: 25,
    maxBreakMin: 5,
    elapsedSec: 0,
    run: false,
    working: true,
    switchOuterColors: false,
    switchInnerColors: false
  },
  computed: {
    maxBreakSec: function() {
      return this.maxBreakMin * 60;
    },
    maxWorkSec: function() {
      return this.maxWorkMin * 60;
    },
    currentBreakSec: function() {
      return this.maxBreakSec - this.elapsedSec;
    },
    currentWorkSec: function() {
      return this.maxWorkSec - this.elapsedSec;
    },
    innerDash: function() {
      return this.innerCurrentDash + ', ' + this.innerMaxDash;
    },
    outerDash: function() {
      return this.outerCurrentDash + ', ' + this.outerMaxDash;
    },
    innerClass: function() {
      return {
        v1: !this.switchInnerColors,
        v2: this.switchInnerColors
      }
    },
    outerClass: function() {
      return {
        v1: this.switchOuterColors,
        v2: !this.switchOuterColors
      }
    }
  },
  methods: {
    toggle: function() {
      this.run = !this.run;
      if (this.run) {
        this.loop()
      } else {
        clearTimeout(timeoutId);
      }
    },
    loop: function() {
      var self = this;
      timeoutId = setTimeout(function() {
        self._work();
        self._break();
        self.loop();
      }, 1000);
    },
    _work: function() {
      var self = this;
      if (self.working && self.elapsedSec < self.maxWorkSec) {
        self.outerCurrentDash += self.outerMaxDash/self.maxWorkSec;
        self.elapsedSec += 1;
        if (self.elapsedSec >= self.maxWorkSec) {
          setTimeout(function() {
            self.working = false;
            self.outerCurrentDash = 0;
            self.switchOuterColors = !self.switchOuterColors;
            self.elapsedSec = 0;
          })
        }
      }
    },
    _break: function() {
      var self = this;
      if (!self.working && self.elapsedSec < self.maxBreakSec) {
        self.innerCurrentDash += self.innerMaxDash/self.maxBreakSec;
        self.elapsedSec += 1;
        if (self.elapsedSec >= self.maxBreakSec) {
          self.working = true;
          self.innerCurrentDash = 0;
          self.switchInnerColors = !self.switchInnerColors;
          self.elapsedSec = 0;
        }
      }
    }
  },
  filters: {
    timeFormat: function(seconds) {
      var secString = (seconds % 60).toString();
      if (secString.length === 1) {
        secString = 0 + secString;
      }
      return Math.floor(seconds/60) + ':' + secString;
    }
  }
});