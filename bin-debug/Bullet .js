var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**子弹*/
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(texture, textureName) {
        var _this = _super.call(this) || this;
        _this.bulletMap = new egret.Bitmap();
        _this.bulletMap.texture = texture;
        _this.addChild(_this.bulletMap);
        _this.textureName = textureName;
        return _this;
    }
    /**生产*/
    Bullet.Produce = function (textureName) {
        if (Bullet.cacheDict[textureName] == null)
            Bullet.cacheDict[textureName] = [];
        var dict = Bullet.cacheDict[textureName];
        var bullet;
        if (dict.length > 0) {
            bullet = dict.pop();
        }
        else {
            bullet = new Bullet(RES.getRes(textureName), textureName);
        }
        return bullet;
    };
    /**回收*/
    Bullet.Reclaim = function (bullet) {
        var textureName = bullet.textureName;
        if (Bullet.cacheDict[textureName] == null)
            Bullet.cacheDict[textureName] = [];
        var dict = Bullet.cacheDict[textureName];
        if (dict.indexOf(bullet) == -1)
            dict.push(bullet);
    };
    return Bullet;
}(egret.DisplayObjectContainer));
Bullet.bulletList = [];
Bullet.cacheDict = {};
__reflect(Bullet.prototype, "Bullet");
//# sourceMappingURL=Bullet .js.map