// miniprogram/pages/editUserInfo/editItem/location.js
var util = require("../../../common/common.js")
const app = util.get_app()
const db = util.get_db()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLocation: true
  },

  locationChange(e) {
    
    let value = e.detail.value

    db.collection('users').doc(app.userInfo._id).update({
      data:{
        isLocation:value
      }
    }).then((res)=>{
        //修改全局的 信息
        app.userInfo.isLocation = value
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      isLocation: app.userInfo.isLocation
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})