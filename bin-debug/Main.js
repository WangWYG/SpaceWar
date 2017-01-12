//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        /**我的子弹*/
        _this.myBullets = [];
        /**创建子弹的间隔*/
        _this.myBulletTimer = new egret.Timer(200);
        /**敌人飞机数组*/
        _this.enemyFighters = [];
        /**敌人的子弹*/
        _this.enemyBullets = [];
        /**触发创建敌机的间隔*/
        _this.enemyFightersTimer = new egret.Timer(1000);
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        _this.lastTime = egret.getTimer();
        return _this;
    }
    Main.prototype.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    Main.prototype.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        // 加载开始背景
        this.bgMap = new BgMap();
        this.addChild(this.bgMap);
        this.LoadBeginBut();
        //我的飞机
        this.myFighter = new MyPlane();
        this.myFighter.y = this.stageH - this.myFighter.height - 50;
        this.myFighter.x = 0;
        this.addChild(this.myFighter);
    };
    /**加载开始button*/
    Main.prototype.LoadBeginBut = function () {
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        //开始按钮
        this.btnStart = new egret.Bitmap(RES.getRes("btn_start_png"));
        this.btnStart.x = (this.stageW - this.btnStart.width) / 2;
        this.btnStart.y = (this.stageH - this.btnStart.height) / 2;
        this.btnStart.touchEnabled = true;
        //点击按钮开始游戏
        this.btnStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this.GameStart, this);
        this.addChild(this.btnStart);
    };
    /**游戏开始 */
    Main.prototype.GameStart = function () {
        this.bgMap.start();
        // 屏蔽开始按钮
        this.removeChild(this.btnStart);
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.TouchHandler, this);
        // 按时生成子弹
        this.myBulletTimer.addEventListener(egret.TimerEvent.TIMER, this.CreateMyBullet, this);
        this.myBulletTimer.start();
        // 按时生成敌人
        this.enemyFightersTimer.addEventListener(egret.TimerEvent.TIMER, this.CreateEnemy, this);
        this.enemyFightersTimer.start();
        // 移动
        this.addEventListener(egret.Event.ENTER_FRAME, this.Move, this);
    };
    /**我随触摸移动*/
    Main.prototype.TouchHandler = function (evt) {
        if (evt.type == egret.TouchEvent.TOUCH_MOVE) {
            var tx = evt.localX;
            tx = Math.max(0, tx);
            tx = Math.min(this.stageW - this.myFighter.width, tx);
            this.myFighter.x = tx;
        }
    };
    /**生成敌人飞机*/
    Main.prototype.CreateEnemy = function () {
        this.enemyFighter = EnemyPlane.Produce();
        this.enemyFighter.x = Math.random() * (this.stageW - this.enemyFighter.width);
        this.enemyFighter.y = 0;
        this.addChildAt(this.enemyFighter, this.numChildren - 1);
        this.enemyFighters.push(this.enemyFighter);
        console.log("enemyFighter: " + this.enemyFighters.length);
        this.enemyFighter.addEventListener("createBullet", this.CreateEnemyBullet, this);
        this.enemyFighter.fire();
    };
    /**移动*/
    Main.prototype.Move = function () {
        var nowTime = egret.getTimer();
        var fps = 1000 / (nowTime - this.lastTime);
        this.lastTime = nowTime;
        var speedOffset = 60 / fps;
        // 敌机移动
        var theFighter;
        var enemyFighterCount = this.enemyFighters.length;
        for (var i = 0; i < enemyFighterCount; i++) {
            theFighter = this.enemyFighters[i];
            if (theFighter.y > this.stage.stageHeight) {
                this.removeChild(theFighter);
                EnemyPlane.Reclaim(theFighter);
                this.enemyFighters.splice(i, 1);
                i--;
                enemyFighterCount--;
                this.enemyFighter.stopFire();
                this.removeEventListener("createBullet", this.CreateEnemyBullet, this);
            }
            theFighter.y += 4 * speedOffset;
        }
        // 敌人子弹移动
        var theBullet;
        var enemyBulletCount = this.enemyBullets.length;
        for (var i = 0; i < enemyBulletCount; i++) {
            theBullet = this.enemyBullets[i];
            if (theBullet.y > this.stage.stageHeight) {
                this.removeChild(theBullet);
                Bullet.Reclaim(theBullet);
                this.enemyBullets.splice(i, 1);
                i--;
                enemyBulletCount--;
            }
            theBullet.y += 8 * speedOffset;
        }
        // 我的子弹移动
        var myBulletCount = this.myBullets.length;
        for (var i = 0; i < myBulletCount; i++) {
            theBullet = this.myBullets[i];
            if (theBullet.y < -theBullet.height) {
                this.removeChild(theBullet);
                Bullet.Reclaim(theBullet);
                this.myBullets.splice(i, 1);
                i--;
                myBulletCount--;
            }
            theBullet.y -= 12 * speedOffset;
        }
        this.GameHitTest();
    };
    /**生成我的子弹*/
    Main.prototype.CreateMyBullet = function () {
        var myBullet;
        for (var i = 0; i < 2; i++) {
            myBullet = Bullet.Produce("b1_png");
            myBullet.x = i == 1 ? this.myFighter.x + 5 : this.myFighter.x + 35;
            myBullet.y = this.myFighter.y - 50;
            this.myBullets.push(myBullet);
            // console.log("myBullets: " + this.myBullets.length);
            this.addChildAt(myBullet, this.numChildren - 1 - this.enemyFighters.length);
        }
    };
    /**生成敌人的子弹*/
    Main.prototype.CreateEnemyBullet = function (event) {
        var enemyBullet = Bullet.Produce("b2_png");
        var theEnemyPlane = event.target;
        enemyBullet.x = theEnemyPlane.x + 28;
        enemyBullet.y = theEnemyPlane.y + 80;
        this.enemyBullets.push(enemyBullet);
        // console.log("enemyBullets: " + this.enemyBullets.length);
        this.addChildAt(enemyBullet, this.numChildren - 1 - this.enemyFighters.length);
    };
    /**碰撞检测*/
    Main.prototype.GameHitTest = function () {
        var theBullet;
        var theEnemyFighter;
        //将需消失的子弹和飞机记录
        var delBullets = [];
        var delFighters = [];
        // 击中敌人
        for (var i = 0; i < this.myBullets.length; i++) {
            theBullet = this.myBullets[i];
            for (var j = 0; j < this.enemyFighters.length; j++) {
                theEnemyFighter = this.enemyFighters[j];
                if (theBullet != null && theEnemyFighter != null && theEnemyFighter.hitTestPoint(theBullet.x, theBullet.y)) {
                    theEnemyFighter.blood -= 1;
                    if (theEnemyFighter.blood <= 0 && delFighters.indexOf(theEnemyFighter) == -1) {
                        delFighters.push(theEnemyFighter);
                    }
                    if (delBullets.indexOf(theBullet) == -1) {
                        delBullets.push(theBullet);
                    }
                }
            }
        }
        // 被敌人击中
        for (var i = 0; i < this.enemyBullets.length; i++) {
            theBullet = this.enemyBullets[i];
            if (theBullet != null && this.myFighter.hitTestPoint(theBullet.x, theBullet.y)) {
                this.myFighter.blood -= 1;
                if (delBullets.indexOf(theBullet) == -1) {
                    delBullets.push(theBullet);
                }
            }
        }
        // 和敌机相撞
        for (var i = 0; i < this.enemyFighters.length; i++) {
            theEnemyFighter = this.enemyFighters[i];
            if (theEnemyFighter != null && theEnemyFighter.hitTestPoint(this.myFighter.x, this.myFighter.y)) {
                if (delFighters.indexOf(theEnemyFighter) == -1) {
                    delFighters.push(theEnemyFighter);
                }
                this.myFighter.blood -= 10;
            }
        }
        if (this.myFighter.blood <= 0) {
            this.GameStop();
        }
        else {
            while (delBullets.length > 0) {
                theBullet = delBullets.pop();
                if (theBullet != null) {
                    this.removeChild(theBullet);
                    if (theBullet.textureName == "b1_png") {
                        this.myBullets.splice(this.myBullets.indexOf(theBullet), 1);
                    }
                    else {
                        this.enemyBullets.splice(this.enemyBullets.indexOf(theBullet), 1);
                    }
                    Bullet.Reclaim(theBullet);
                }
            }
            while (delFighters.length > 0) {
                theEnemyFighter = delFighters.pop();
                if (theEnemyFighter != null) {
                    theEnemyFighter.stopFire();
                    theEnemyFighter.removeEventListener("createBullet", this.CreateEnemyBullet, this);
                    this.removeChild(theEnemyFighter);
                    this.enemyFighters.splice(this.enemyFighters.indexOf(theEnemyFighter), 1);
                    EnemyPlane.Reclaim(theEnemyFighter);
                }
            }
        }
    };
    /**游戏结束*/
    Main.prototype.GameStop = function () {
        // 背景结束滚动
        this.bgMap.pause();
        // 加载开始按钮
        this.LoadBeginBut();
        // 我的飞机信息还原
        this.myFighter.blood = 10;
        this.myFighter.y = this.stageH - this.myFighter.height - 50;
        this.myFighter.x = 0;
        // 停止产生游戏对象
        this.removeEventListener(egret.TimerEvent.TIMER, this.CreateMyBullet, this);
        this.myBulletTimer.stop();
        this.removeEventListener(egret.TimerEvent.TIMER, this.CreateEnemy, this);
        this.enemyFightersTimer.stop();
        // 所有游戏对象停止移动
        this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.TouchHandler, this);
        this.removeEventListener(egret.Event.ENTER_FRAME, this.Move, this);
        // 清空屏幕飞机
        // for (let i = 0; i < this.enemyFighters.length; i++) {
        //     console.log(3);
        //     this.enemyFighters[i].stopFire();
        //     this.removeChild(this.enemyFighters[i]);
        //     EnemyPlane.Reclaim(this.enemyFighters[i]);
        //     this.enemyFighters.splice(i);
        // }
        console.log("enemyFighters1: " + this.enemyFighters.length);
        while (this.enemyFighters.length > 0) {
            console.log(1);
            var fighter = this.enemyFighters.pop();
            this.removeChild(fighter);
            EnemyPlane.Reclaim(fighter);
            this.enemyFighter.stopFire();
            this.enemyFighter.removeEventListener("createBullet", this.CreateEnemyBullet, this);
        }
        // 清空屏幕子弹
        // for (let i = 0; i < this.myBullets.length; i++) {
        //     if (this.myBullets[i] != null) {
        //         console.log(1);
        //         this.removeChild(this.myBullets[i]);
        //         Bullet.Reclaim(this.myBullets[i]);
        //         this.myBullets.splice(i);
        //     }
        // }
        while (this.myBullets.length > 0) {
            var bullet = this.myBullets.pop();
            this.removeChild(bullet);
            Bullet.Reclaim(bullet);
        }
        // for (let i = 0; i < this.enemyBullets.length; i++) {
        //     if (this.enemyBullets[i] != null) {
        //         console.log(2);
        //         this.removeChild(this.enemyBullets[i]);
        //         Bullet.Reclaim(this.enemyBullets[i]);
        //         this.enemyBullets.splice(i);
        //     }
        // }
        while (this.enemyBullets.length > 0) {
            var bullet = this.enemyBullets.pop();
            this.removeChild(bullet);
            Bullet.Reclaim(bullet);
        }
        console.log("enemyFighters2: " + this.enemyFighters.length);
        console.log("myBullets: " + this.myBullets.length);
        console.log("enemyBullets: " + this.enemyBullets.length);
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map