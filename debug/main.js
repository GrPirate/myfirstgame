var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(id, type, speed, player, place, bulletNums) {
        var _this = _super.call(this, id) || this;
        _this.type = type;
        _this.speed = speed;
        _this.player = player;
        _this.place = place;
        _this.bulletNums = bulletNums;
        _this.init();
        return _this;
    }
    Bullet.prototype.init = function () {
        this.x = this.player.x + this.player.width / 2 - this.bulletNums * this.width / 2 + this.place * this.width;
        this.y = this.player.y + this.height / 2;
    };
    Bullet.prototype.moveUp = function () {
        this.y = this.getGlobalPosition().y - this.speed;
        if (this.getGlobalPosition().y + this.height < 0) {
            this.remove();
        }
    };
    Bullet.prototype.remove = function () {
        var index = game.bullets.indexOf(this);
        if (index > -1) {
            game.bullets.splice(index, 1);
        }
    };
    return Bullet;
}(PIXI.Sprite));

var SFT;
(function (SFT) {
    var Utils = /** @class */ (function () {
        function Utils() {
        }
        Utils.getInstance = function () {
            if (!this.instance) {
                this.instance = new Utils();
            }
            return this.instance;
        };
        Utils.prototype.contain = function (sprite, container) {
            var collision = undefined;
            // left
            if (sprite.x < container.x) {
                sprite.x = container.x;
                collision = 'left';
            }
            // top
            if (sprite.y < container.y) {
                sprite.y = container.y;
                collision = 'top';
            }
            //Right
            if (sprite.x + sprite.width > container.width) {
                sprite.x = container.width - sprite.width;
                collision = "right";
            }
            //Bottom
            if (sprite.y + sprite.height > container.height) {
                sprite.y = container.height - sprite.height;
                collision = "bottom";
            }
            return collision;
        };
        return Utils;
    }());
    SFT.Utils = Utils;
})(SFT || (SFT = {}));

var WIDTH = 750;
var HEIGHT = 1500;
var APP = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    antialias: true
});
var t;
var state;
var pointer;
var keyObject;
var game;

var Game = /** @class */ (function () {
    function Game() {
        this.container = { x: 0, y: 0, width: WIDTH, height: HEIGHT };
        this.runtime = {
            point_x: 0,
            point_y: 0,
            time: 0
        };
        // 工具类
        this.Utils = SFT.Utils.getInstance();
        // 子弹集
        this.bullets = [];
        this.bulletType = {
            1: 'blue_bullet.png',
            2: 'boss_bullet_hellfire_red.png',
            3: 'boss_bullet_hellfire_yellow.png',
            4: 'purple_bullet.png'
        };
        this.dom = document.querySelector("#game");
        this.init();
    }
    /**
     * 创建应用
     */
    Game.prototype.createApplication = function () {
        this.dom.appendChild(APP.view);
        APP.renderer.backgroundColor = 0x061639;
        // Tink
        var scale = scaleToWindow(APP.renderer.view);
        t = new Tink(PIXI, APP.renderer.view, scale);
        pointer = t.makePointer();
        // 键盘控制
        keyObject = t.keyboard;
    };
    Game.prototype.render = function () {
        var _this = this;
        this.timeId = setInterval(function () {
            this.runtime.time++;
        }.bind(this), 1000);
        this.gameScene = new PIXI.Container();
        APP.stage.addChild(this.gameScene);
        this.RES = PIXI.loader.resources['assets/planetextrue.json'].textures;
        this.plane = new PIXI.Sprite(this.RES['n1.png']);
        this.gameScene.addChild(this.plane);
        var planex = APP.screen.width / 2 - this.plane.width / 2;
        var planey = APP.screen.height * 5 / 6;
        this.plane.position.set(planex, planey);
        this.message = new PIXI.Text('x: 0, y: 0', new PIXI.TextStyle({ fill: 'white' }));
        this.gameScene.addChild(this.message);
        t.arrowControl(this.plane, 10);
        this.plane['vx'] = 0;
        this.plane['vy'] = 0;
        state = this.play.bind(this);
        // 开始游戏循环
        APP.ticker.add(function (delta) { return _this.gameLoop(delta); });
    };
    Game.prototype.gameLoop = function (delta) {
        t.update();
        state(delta);
    };
    Game.prototype.init = function () {
        var _this = this;
        this.createApplication();
        PIXI.loader.add('assets/planetextrue.json').load(function () { return _this.render(); });
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
        var _this = this;
        clearTimeout(this.resized);
        this.resized = setTimeout(function () {
            // let realw = WIDTH
            // let realh = HEIGHT
            // let h = window.innerHeight
            // let w = window.innerWidth
            // let scale = h / realh
            // let _w = realw * scale
            // APP.view.height = h / scale
            // APP.view.style.position = 'relative'
            // APP.view.style.top = -(1 - scale) * realh / 2 + 'px'
            // // APP.view.style.left = -(1 - scale) * realw / 2 + 'px'
            // APP.view.style.transform = `scale(${scale})`
            var scale = scaleToWindow(APP.renderer.view);
            t.scale = scale;
            _this.container = {
                x: 0,
                y: 0,
                width: APP.renderer.view.width,
                height: APP.renderer.view.height
            };
        }, 100);
    };
    /**
     * 游戏running
     * @param delta
     */
    Game.prototype.play = function (delta) {
        var _this = this;
        if (pointer.hitTestSprite(this.plane)) {
            // 当指针在精灵上时显示一个手形图标
            pointer.cursor = "pointer";
        }
        else {
            // 当指针移出精灵区域时显示默认箭头图标
            pointer.cursor = "auto";
        }
        this.message.text = "x: " + pointer.x + ", y: " + pointer.y;
        this.Utils.contain(this.plane, this.container);
        this.plane.x += this.plane['vx'];
        this.plane.y += this.plane['vy'];
        // move plane
        pointer.press = function () {
            _this.runtime.point_x = pointer.x;
            _this.runtime.point_y = pointer.y;
        };
        if (pointer.isDown) {
            var x = pointer.x - this.runtime.point_x;
            var y = pointer.y - this.runtime.point_y;
            this.plane.x += x;
            this.plane.y += y;
            this.runtime.point_x = pointer.x;
            this.runtime.point_y = pointer.y;
        }
        // fire bullets
        this.createBullets(5, 1, 50);
        this.bullets.map(function (v) {
            v.moveUp();
        });
    };
    Game.prototype.createBullets = function (n, type, speed) {
        for (var i = 0; i < n; i++) {
            var bullet = new Bullet(this.bulletType[type], type, speed, this.plane, i, n);
            this.gameScene.addChild(bullet);
            this.bullets.push(bullet);
        }
    };
    Game.prototype.gameOver = function () {
        clearInterval(this.timeId);
    };
    return Game;
}());
game = new Game();

