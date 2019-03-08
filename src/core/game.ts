class Game {
  // 游戏场景
  public gameScene: PIXI.Container

  // 资源
  public RES

  private timeId
  private resized
  private container: any = {x: 0, y: 0, width: WIDTH, height: HEIGHT}

  private message: PIXI.Text

  // 飞机
  private plane: PIXI.Sprite

  private currentTime: number = 0

  public runtime = {
    point_x: 0,
    point_y: 0,
    time: 0
  }

  // 工具类
  public Utils: SFT.Utils = SFT.Utils.getInstance()

  // 子弹集
  public bullets: Array<Bullet> = []

  public bulletType: any = {
    1: 'blue_bullet.png',
    2: 'boss_bullet_hellfire_red.png',
    3: 'boss_bullet_hellfire_yellow.png',
    4: 'purple_bullet.png'
  }

  public dom: HTMLDivElement = document.querySelector("#game")
  constructor () {
    this.init()
  }

  /**
   * 创建应用
   */
  public createApplication (): void {
    this.dom.appendChild(APP.view)
    APP.renderer.backgroundColor = 0x061639

    // Tink
    let scale = scaleToWindow(APP.renderer.view);
    t = new Tink(PIXI, APP.renderer.view, scale)

    pointer = t.makePointer()

    // 键盘控制
    keyObject = t.keyboard
  }

  public render (): void {
    this.timeId = setInterval(function () {
      this.runtime.time++
    }.bind(this), 1000)

    this.gameScene = new PIXI.Container()
    APP.stage.addChild(this.gameScene)
    this.RES = PIXI.loader.resources['assets/planetextrue.json'].textures

    this.plane = new PIXI.Sprite(this.RES['n1.png'])
    this.gameScene.addChild(this.plane)
    let planex = APP.screen.width / 2 - this.plane.width / 2
    let planey = APP.screen.height * 5 / 6

    this.plane.position.set(planex, planey)

    this.message = new PIXI.Text('x: 0, y: 0', new PIXI.TextStyle({fill: 'white'}))
    this.gameScene.addChild(this.message)

    t.arrowControl(this.plane, 10)
    this.plane['vx'] = 0;
    this.plane['vy'] = 0;

    state = this.play.bind(this)
    // 开始游戏循环
    APP.ticker.add(delta => this.gameLoop(delta));
  }

  public gameLoop (delta): void {
    t.update()
    state(delta)
  }

  public init () {
    this.createApplication()
    PIXI.loader.add('assets/planetextrue.json').load(() => this.render())
    this.bindEvent()
    this.onWindowsChange()
    // 屏幕翻转
    window.addEventListener('orientationchange', () => {
      this.onWindowsChange()
    });
  }

  private bindEvent() {
      window.onresize = this.onWindowsChange.bind(this);
  }

  private onWindowsChange () {
    clearTimeout(this.resized)
    this.resized = setTimeout(() => {
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
      
      let scale = scaleToWindow(APP.renderer.view)
      t.scale = scale
      this.container = {
        x: 0,
        y: 0,
        width: APP.renderer.view.width,
        height: APP.renderer.view.height
      }
    }, 100)
  }
  
  /**
   * 游戏running
   * @param delta 
   */
  public play (delta): void {
    if (pointer.hitTestSprite(this.plane)) {
      // 当指针在精灵上时显示一个手形图标
      pointer.cursor = "pointer"
    } else {
      // 当指针移出精灵区域时显示默认箭头图标
      pointer.cursor = "auto";
    }

    this.message.text = `x: ${pointer.x}, y: ${pointer.y}`

    this.Utils.contain(this.plane, this.container)

    this.plane.x += this.plane['vx']
    this.plane.y += this.plane['vy']

    // move plane
    pointer.press = () => {
      this.runtime.point_x = pointer.x
      this.runtime.point_y = pointer.y
    }

    if (pointer.isDown && !pointer.tapped) {
      let x = pointer.x - this.runtime.point_x
      let y = pointer.y - this.runtime.point_y
      this.plane.x += x
      this.plane.y += y
      this.runtime.point_x = pointer.x
      this.runtime.point_y = pointer.y
      // 发射子弹
      
      this.createBullets(10, 1, 20)
      // console.log(this.runtime.time)
      // if (this.currentTime !== this.runtime.time){
      //   this.createBullets(5, 2, 30)
      //   this.currentTime = this.runtime.time
      // }
    }
    // fire bullets
    this.bullets.map(v => {
      v.moveUp()
    })
  }

  public createBullets (n, type, speed) {
    for (let i = 0; i< n; i++) {
      let bullet = new Bullet(this.RES[this.bulletType[type]], type, speed, this.plane, i, n)
      this.gameScene.addChild(bullet)
      this.bullets.push(bullet)
    }
  }

  public gameOver (): void {
    clearInterval(this.timeId)
  }
}

game = new Game()