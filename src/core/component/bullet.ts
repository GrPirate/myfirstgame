class Bullet extends PIXI.Sprite {

  public type

  public speed

  public place

  public bulletNums

  public player: PIXI.Sprite

  // player中心点
  private centerX: number

  // x最大值
  private maxX: number

  private bulletWidth: number

  // 奇: true, 偶: false
  private isOdd: Boolean = false

  private pos: string = 'left'

  private timeId

  constructor (id, type, speed, player, place, bulletNums) {
    super(id)
    this.type = type
    this.speed = speed
    this.player = player
    this.place = place
    this.bulletNums = bulletNums
    this.init()
  }

  public init () {
    this.bulletNums % 2 === 0 ? this.isOdd = false : this.isOdd = true
    this.pos = this.getPos(this.place, this.bulletNums)
    this.centerX = this.player.x + this.player.width / 2
    this.bulletWidth = this.bulletNums * this.width
    this.maxX = this.centerX - this.bulletWidth / 2 + this.place * this.width
    this.x = this.centerX - this.width / 2
    this.y = this.player.y - this.height + 20
  }

  public moveUp () {
    if (this.x !== this.maxX) {
      if (this.pos === 'left') {
        this.x = this.x - 10
        if (this.x < this.maxX) this.x = this.maxX
      } else if (this.pos === 'right') {
        this.x = this.x + 10
        if (this.x > this.maxX) this.x = this.maxX
      }
    }
    this.y = this.getGlobalPosition().y - this.speed
    if (this.getGlobalPosition().y + this.height < 0) {
      this.remove()
    }
  }

  public remove () {
    clearInterval(this.timeId)
    let index = game.bullets.indexOf(this)
    if (index > -1) {
      game.bullets.splice(index, 1)
    }
  }

  public getPos (place: number, total: number): string {
    let pos = 'center'
    let center = Math.ceil(total / 2)
    let p = place + 1
    if (this.isOdd) {
      pos = p < center ? 'left' : p > center ? 'right' : 'center'
    } else {
      pos = p > center ? 'right' : 'left'
    }
    return pos
  }
}