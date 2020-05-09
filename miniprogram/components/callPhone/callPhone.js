// components/callPhone/callPhone.js
Component({

  //组件样式 可以得到外部的样式
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
      phoneNubmer:String
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
    handleCallPhone(){
        wx.makePhoneCall({
          phoneNumber: this.data.phoneNubmer,
        })
    }
  }
})
