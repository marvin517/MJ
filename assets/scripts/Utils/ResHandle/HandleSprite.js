var HandleSprite = cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        Is3DRoom:true,
    },
    init:function()
    {
        this.Is3DRoom = true;
    },
    SetPaiSprite:function(_sprite,_paipath)
    {
        // cc.vv.global.Debuglog("Debuglog SetPaiSprite:"+_paipath);
        // if(this.Is3DRoom == true)
        // {
        //     cc.vv.global.Debuglog("Debuglog SetPaiSprite:this.Is3DRoom");
        //     var _3Dsprite = cc.find("Canvas/opTarget/op3DPSelf/3DTarget").getComponent(cc.Sprite);
        //     if(_paipath.charAt(0) == "M")
        //     {
        //         cc.vv.global.Debuglog("Debuglog SetPaiSprite:M");
        //         cc.loader.loadRes("textures/setting/z_fuxuan_off", cc.SpriteFrame, function (err, spriteFrame) {
        //             _3Dsprite.spriteFrame = spriteFrame;
        //         });
        //     }
        // }
        // else
        // {
        //     cc.vv.global.Debuglog("Debuglog SetPaiSprite:this.Is3DRoom false");
        //     cc.loader.loadRes("textures/setting/z_fuxuan_off", cc.SpriteFrame, function (err, spriteFrame) {
        //             _sprite.spriteFrame = spriteFrame;
        //     });
        // }
        
    },
});
