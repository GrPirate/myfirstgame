namespace SFT {
  export class Utils {
    constructor () {

    }

    private static instance

    public static getInstance (): Utils {
      if (!this.instance) {
        this.instance = new Utils()
      }
      return this.instance
    }


    public contain (sprite: PIXI.Sprite, container: any) {
      let collision = undefined
  
      // left
      if (sprite.x < container.x) {
        sprite.x = container.x
        collision = 'left'
      }
  
      // top
      if (sprite.y < container.y) {
        sprite.y = container.y
        collision = 'top'
      }
  
      //Right
      if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right"
      }
    
      //Bottom
      if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom"
      }
      return collision
    }
  }
}