var WIDTH = 750;
var HEIGHT = 1000;
var APP = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    antialias: true
});

var Game = /** @class */ (function () {
    function Game() {
        this.dom = document.querySelector("#game");
        this.init();
    }
    /**
     * 创建应用
     */
    Game.prototype.createApplication = function () {
        this.dom.appendChild(APP.view);
        APP.renderer.backgroundColor = 0x061639;
    };
    Game.prototype.render = function () {
        this.gameScene = new PIXI.Container();
        APP.stage.addChild(this.gameScene);
        console.log(APP);
    };
    Game.prototype.init = function () {
        var _this = this;
        this.createApplication();
        PIXI.loader.load(function () { return _this.render(); });
        this.bindEvent();
        this.onWindowsChange();
        // 屏幕翻转
        window.addEventListener('orientationchange', function () {
            _this.onWindowsChange();
        });
    };
    Game.prototype.bindEvent = function () {
        window.onresize = this.onWindowsChange.bind(this);
    };
    Game.prototype.onWindowsChange = function () {
        clearTimeout(this.resized);
        this.resized = setTimeout(function () {
            var realw = WIDTH;
            var realh = HEIGHT;
            var h = window.innerHeight;
            var w = window.innerWidth;
            var scale = h / realh;
            var _w = realw * scale;
            APP.view.height = h / scale;
            APP.view.style.position = 'relative';
            APP.view.style.top = -(1 - scale) * realh / 2 + 'px';
            // APP.view.style.left = -(1 - scale) * realw / 2 + 'px'
            APP.view.style.transform = "scale(" + scale + ")";
        }, 100);
    };
    return Game;
}());
new Game();
