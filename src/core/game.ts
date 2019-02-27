class Game {
  public gameScene: PIXI.Container

  private resized

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
  }

  public render (): void {
    this.gameScene = new PIXI.Container()
    APP.stage.addChild(this.gameScene)
    console.log(APP)
  }

  public init () {
    this.createApplication()
    PIXI.loader.load(() => this.render())
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
      let realw = WIDTH
      let realh = HEIGHT
      let h = window.innerHeight
      let w = window.innerWidth
      let scale = h / realh
      let _w = realw * scale
      APP.view.height = h / scale
      APP.view.style.position = 'relative'
      APP.view.style.top = -(1 - scale) * realh / 2 + 'px'
      // APP.view.style.left = -(1 - scale) * realw / 2 + 'px'
      APP.view.style.transform = `scale(${scale})`
    }, 100)
  }
}

new Game()