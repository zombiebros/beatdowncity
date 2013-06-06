// Update every X secs
//var FPSMode = 'interval'
//var FPSFreq = 1;
// Update every X frames

/*
* Frames Per Second Functions
*/
Crafty.extend({
    fps: {
        fps: 0,
        frametime: 0,
        _freq: 1000,
        _lastFrame: 1,
        _lastTime: 1,
        init: function(timed, freq) {
            timed = (typeof timed == 'undefined') ? true : timed;
            this._lastFrame = Crafty.frame();
            this._lastTime = new Date().getTime() / 1000;

            if (timed) {
                Crafty.fps._freq = (typeof freq == 'undefined' || freq < 1) ? 1000 : freq * 1000;
                Crafty.fps.timed();
            } else {
                Crafty.fps._freq = (typeof freq == 'undefined' || freq < 1) ? 10 : freq;
                Crafty.bind('EnterFrame', function() {
                    Crafty.fps.enterFrame();
                });
            }
        },
        // Calculate every frame
        enterFrame: function() {
            var curFrame = Crafty.frame();
            if (curFrame % this._freq === 0) {
                this.calculate();
            }
        },
        // A set interval 
        timed: function() {
            this.calculate();
            setTimeout('Crafty.fps.timed();', this._freq);
        },
        // Calculate FPS
        calculate: function() {
            var curFrame = Crafty.frame();
            var curTime = new Date().getTime() / 1000;
            if (curFrame > this._lastFrame) {
                this.fps = ((curFrame - this._lastFrame) / (curTime - this._lastTime)).toFixed(2);
                this.frametime = (1 / this.fps).toFixed(3);
            }
            // Save 
            this._lastFrame = curFrame;
            this._lastTime = curTime;
        }
    }
});
/*
* Frames Per Second Component
*/
Crafty.c('FPS', {
    init: function() {
        this.requires('2D, DOM, Text').bind('EnterFrame', function() {
            this.text(Crafty.fps.fps + ' ' + Crafty.fps.frametime);
        });
    },
    FPS: function(timed, freq) {
        Crafty.fps.init(timed, freq);
        return this;
    }
});