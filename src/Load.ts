
/**滚动背景 */
class BgMap extends egret.DisplayObjectContainer {

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    /**图片引用*/
    private bmpArr: egret.Bitmap[];
    /**图片数量*/
    private rowCount: number;
    /**stage宽*/
    private stageW: number;
    /**stage高*/
    private stageH: number;
    /**纹理本身的高度*/
    private textureHeight: number;
    /**控制滚动速度*/
    private speed: number = 2;

    private onAddToStage() {
        let texture: egret.Texture = RES.getRes("bg_jpg");
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        this.textureHeight = texture.textureHeight;//保留原始纹理的高度，用于后续的计算
        this.rowCount = Math.ceil(this.stageH / this.textureHeight) + 1;//计算在当前屏幕中，需要的图片数量
        this.bmpArr = [];
        //创建这些图片，并设置y坐标，让它们连接起来
        for (var i: number = 0; i < this.rowCount; i++) {
            var bgBmp: egret.Bitmap = new egret.Bitmap;
            bgBmp.texture = texture;
            bgBmp.y = this.textureHeight * i - (this.textureHeight * this.rowCount - this.stageH);
            bgBmp.width = this.stageW;
            this.bmpArr.push(bgBmp);
            this.addChild(bgBmp);
        }
    }

    /**开始滚动*/
    public start(): void {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
        this.addEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
    }
    /**逐帧运动*/
    private enterFrameHandler(event: egret.Event): void {
        for (var i: number = 0; i < this.rowCount; i++) {
            var bgBmp: egret.Bitmap = this.bmpArr[i];
            bgBmp.y += this.speed;
            //判断超出屏幕后，回到队首，这样来实现循环反复
            if (bgBmp.y > this.stageH) {
                bgBmp.y = this.bmpArr[0].y - this.textureHeight;
                this.bmpArr.pop();
                this.bmpArr.unshift(bgBmp);
            }
        }
    }
    /**暂停滚动*/
    public pause(): void {
        this.removeEventListener(egret.Event.ENTER_FRAME, this.enterFrameHandler, this);
    }
}