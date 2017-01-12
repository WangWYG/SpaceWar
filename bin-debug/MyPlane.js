var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**我的飞机 */
var MyPlane = (function (_super) {
    __extends(MyPlane, _super);
    function MyPlane() {
        var _this = _super.call(this) || this;
        /**飞机生命值*/
        _this.blood = 10;
        _this.bmp = new egret.Bitmap(RES.getRes("f1_png"));
        _this.addChild(_this.bmp);
        return _this;
    }
    /**开火*/
    MyPlane.prototype.OnFire = function () {
    };
    /**移动*/
    MyPlane.prototype.Move = function (event) {
        if (event.type == egret.TouchEvent.TOUCH_MOVE) {
            var tx = event.localX;
            tx = Math.max(0, tx);
            tx = Math.min(this.stageW - this.bmp.width, tx);
            this.bmp.x = tx;
            console.log(tx);
        }
    };
    return MyPlane;
}(egret.DisplayObjectContainer));
__reflect(MyPlane.prototype, "MyPlane");
//# sourceMappingURL=MyPlane.js.map