
/**子弹*/
class Bullet extends egret.DisplayObjectContainer {

    /**子弹位图 */
    private bulletMap: egret.Bitmap;
    // /**创建子弹的时间间隔*/
    // private fireDelay: number;
    public textureName: string;//可视为子弹类型名 
    private static bulletList: Bullet[] = [];

    public constructor(texture: egret.Texture, textureName: string) {
        super();
        this.bulletMap = new egret.Bitmap();
        this.bulletMap.texture = texture;
        this.addChild(this.bulletMap);
        this.textureName = textureName;
    }

    private static cacheDict: Object = {};
    /**生产*/
    public static Produce(textureName: string): Bullet {
        if (Bullet.cacheDict[textureName] == null)
            Bullet.cacheDict[textureName] = [];
        var dict: Bullet[] = Bullet.cacheDict[textureName];
        var bullet: Bullet;
        if (dict.length > 0) {
            bullet = dict.pop();
        } else {
            bullet = new Bullet(RES.getRes(textureName), textureName);
        }
        return bullet;
    }
    /**回收*/
    public static Reclaim(bullet: Bullet): void {
        var textureName: string = bullet.textureName;
        if (Bullet.cacheDict[textureName] == null)
            Bullet.cacheDict[textureName] = [];
        var dict: Bullet[] = Bullet.cacheDict[textureName];
        if (dict.indexOf(bullet) == -1)
            dict.push(bullet);
    }
}