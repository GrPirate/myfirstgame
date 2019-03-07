class Bullet extends PIXI.Sprite {

  public type

  public speed

  public place

  public bulletNums

  public player: PIXI.Sprite

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
    this.x = this.player.x + this.player.width / 2 - this.bulletNums * this.width / 2 + this.place * this.width
    this.y = this.player.y + this.height / 2
  }

  public moveUp () {
    this.y = this.getGlobalPosition().y - this.speed
    if (this.getGlobalPosition().y + this.height < 0) {
      this.remove()
    }
  }

  public remove () {
    let index = game.bullets.indexOf(this)
    if (index > -1) {
      game.bullets.splice(index, 1)
    }
  }
}