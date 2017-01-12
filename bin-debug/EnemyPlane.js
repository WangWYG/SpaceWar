var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**敌人飞机 */
var EnemyPlane = (function (_super) {
    __extends(EnemyPlane, _super);
    function EnemyPlane() {
        var _this = _super.call(this) || this;
        /**创建子弹的时间间隔*/
        _this.fireDelay = 500;
        _this.blood = 6;
        _this.planeMap = new egret.Bitmap(RES.getRes("f2_png"));
        _this.addChild(_this.planeMap);
        _this.fireTimer = new egret.Timer(_this.fireDelay);
        _this.fireTimer.addEventListener(egret.TimerEvent.TIMER, _this.createBullet, _this);
        return _this;
    }
    EnemyPlane.Produce = function () {
        var theFighter;
        if (EnemyPlane.list.length > 0) {
            theFighter = EnemyPlane.list.pop();
        }
        else {
            theFighter = new EnemyPlane();
        }
        return theFighter;
    };
    /**回收*/
    EnemyPlane.Reclaim = function (theFighter) {
        if (theFighter != null && EnemyPlane.list.indexOf(theFighter) == -1) {
            theFighter.blood = 6;
            EnemyPlane.list.push(theFighter);
        }
    };
    /**开火*/
    EnemyPlane.prototype.fire = function () {
        this.fireTimer.start();
    };
    /**停火*/
    EnemyPlane.prototype.stopFire = function () {
        this.fireTimer.stop();
    };
    /**创建子弹*/
    EnemyPlane.prototype.createBullet = function (evt) {
        this.dispatchEventWith("createBullet");
    };
    return EnemyPlane;
}(egret.DisplayObjectContainer));
/**生产*/
EnemyPlane.list = [];
__reflect(EnemyPlane.prototype, "EnemyPlane");
//# sourceMappingURL=EnemyPlane.js.map