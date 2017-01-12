
/**我的飞机 */
class MyPlane extends egret.DisplayObjectContainer {
    /**飞机位图*/
    private bmp: egret.Bitmap;
    /**创建子弹的时间间隔*/
    private fireDelay: number;
    /**定时射*/
    private fireTimer: egret.Timer;
    /**飞机生命值*/
    public blood: number = 10;
    /**@private*/
    private stageW: number;
    /**@private*/
    private stageH: number;

    public constructor() {
        super();
        this.bmp = new egret.Bitmap(RES.getRes("f1_png"));
        this.addChild(this.bmp); 
    }

    /**开火*/
    public OnFire() {

    }

    /**移动*/
    public Move(event: egret.TouchEvent) {
        if (event.type == egret.TouchEvent.TOUCH_MOVE) {
            var tx: number = event.localX;
            tx = Math.max(0, tx);
            tx = Math.min(this.stageW - this.bmp.width, tx);
            this.bmp.x = tx;
            console.log(tx);
        }
    }
}