// miniprogram/pages/editUserInfo/head.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: ""
  },

  handleUploadImage() {
    // api 获取手机相册
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        // const tempFilePaths = res.tempFilePaths
        const tempFilePaths = res.tempFilePaths[0];
        this.setData({
          userPhoto: tempFilePaths
        })
      }
    })
  },

  // 上传头像
  handleBtn() {
    wx.showLoading({
      title: '上传中',
    })

    // 零时图片路径 加时间戳 和  随机数解决  缓存问题
    let cloudPath = "userPhoto/" + app.userInfo._openid + Date.now() + ".png";
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: this.data.userPhoto, // 文件路径
    }).then((res) => {

      // console.log(res);
      let fileID = res.fileID;
      if (fileID) {
        db.collection('users').doc(app.userInfo._id).update({
          data: {
            userPhoto: fileID
          }
        }).then(() => {
          wx.hideLoading();
          wx.showToast({
            title: '上传并更新成功',
          })
          app.userInfo.userPhoto = fileID;
        })
      }
    });
  },

  //获取  微信头像 
  bindGetUserInfo(msg) {
    console.log(msg.detail.userInfo);
    let userInfo = msg.detail.userInfo;
    this.setData({
      userPhoto: userInfo.avatarUrl,
    }, () => {

      wx.showLoading({
        title: '上传中',
      })
      db.collection('users').doc(app.userInfo._id).update({
        data: {
          userPhoto: userInfo.avatarUrl,
        }
      }).then(() => {
        wx.hideLoading();
        wx.showToast({
          title: '上传并更新成功',
        })
        app.userInfo.userPhoto = userInfo.avatarUrl;
      })
    })
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
      userPhoto: app.userInfo.userPhoto
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