// components/removeList2/removelist2.js
const app = getApp()
const db = wx.cloud.database()
Component({
 /**
   * 组件的属性列表
   */
  properties: {
    messageId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    userMessage: {
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      db.collection('users').doc(this.data.messageId)
        .field({
          userPhoto: true,
          nickName: true
        })
        .get()
        .then((res) => {
          this.setData({
            userMessage: res.data
          })
        });

    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})