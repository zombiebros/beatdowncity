Crafty.c("Movement", {
  init: function(){
    this.bind('EnterFrame', $.proxy(this.enterFrameHandler, this));
  },

  enterFrameHandler:function(){
    if(this.preJumpY !== null){
      this.z = this.preJumpY
    }else{
      this.z = this.y+this.h;
    }

    if(this.dir > 0){
      this.unflip('X');
      this.punchbox.unmirror();
      this.kickbox.unmirror();
    }else{
      this.flip('X');
      this.punchbox.mirror();
      this.kickbox.mirror();
    }

    if(!this.has('RemotePlayer')){
      if((this.isPunching || this.isKicking) &&
       (!this.isRising && !this.isFalling)){
        return;
      }

      if((this.x + this.w/2) + this.xV <= 0){
        return;
      }

      if((this.x + this.w/2) + this.xV >= Crafty.viewport.width){
        return;
      }

      this.x += this.xV;
      this.y += this.yV;
    }else if(this.has('RemotePlayer') &&
      (this.isFrontKOing || this.isBackKOing)){
      this.y += this.yV;
    }
}
});