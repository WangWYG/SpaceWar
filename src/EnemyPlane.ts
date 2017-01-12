
/**敌人飞机 */
class EnemyPlane extends egret.DisplayObjectContainer {
    /**飞机位图 */
    private planeMap: egret.Bitmap;
    /**创建子弹的时间间隔*/
    private fireDelay: number = 500;
    /**定时发射子弹*/
    private fireTimer: egret.Timer;
    /**生命值*/
    public blood: number;

    public constructor() {
        super();
        this.blood = 6;
        this.planeMap = new egret.Bitmap(RES.getRes("f2_png"));
        this.addChild(this.planeMap);
        this.fireTimer = new egret.Timer(this.fireDelay);
        this.fireTimer.addEventListener(egret.TimerEvent.TIMER,this.createBullet,this);
    }

    /**生产*/
    private static list: EnemyPlane[] = [];
    public static Produce(): EnemyPlane {
        let theFighter: EnemyPlane;
        if (EnemyPlane.list.length > 0) {
            theFighter = EnemyPlane.list.pop();
        } else {
            theFighter = new EnemyPlane();
        }
        return theFighter;
    }

    /**回收*/
    public static Reclaim(theFighter: EnemyPlane): void {
        if (theFighter != null && EnemyPlane.list.indexOf(theFighter) == -1) {
            theFighter.blood = 6;
            EnemyPlane.list.push(theFighter);
        }
    }

    /**开火*/
    public fire(): void {
        this.fireTimer.start();
    }

    /**停火*/
    public stopFire(): void {
        this.fireTimer.stop();
    }

    /**创建子弹*/
    private createBullet(evt: egret.TimerEvent): void {
        this.dispatchEventWith("createBullet");
    }
}