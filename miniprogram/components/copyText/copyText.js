// components/copyText/copyText.js
Component({


  //组件样式 可以得到外部的样式
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
      copyText:String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleCopyText(){
      wx.setClipboardData({
        data:this.data.copyText,
        success(res){
            wx.getClipboardData({
             success(res){
               console.log(res)
             }
            })
        }
      })
    }
  }
})
