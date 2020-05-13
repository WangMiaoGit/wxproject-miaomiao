// pages/near/near.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
    markers: []
  },

  getLocation() {

    // 获取用户当前的授权信息

    // wx.getSetting({
    //   complete: (res) => {
    //     console.log(res)
    //   },
    // })

    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        console.log(longitude)
        console.log(latitude)
        this.setData({
          latitude: latitude,
          longitude: longitude
        })
      }
    });

  },

  getNearUsers() {
    db.collection('users')
      .where({
        location: _.geoNear({
          geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
          minDistance: 0,
          maxDistance: 5000,
        }),
        isLocation: true
      })
      .field({
        latitude: true,
        longitude: true,
        userPhoto: true
      })
      .get()
      .then((res) => {
        console.log(res.data);
        let data = res.data;
        let result = [];
        if (data.length) {


          for (let i = 0; i < data.length; i++) {
            let markers = data[i]
            if (markers.userPhoto.includes('cloud://')) {
              wx.cloud.getTempFileURL({
                fileList: [markers.userPhoto],
                success: (res) => {
                  // console.log(res)
                  let url = res.fileList[0].tempFileURL

                  result.push({
                    iconPath: url,
                    id: markers._id,
                    longitude: markers.longitude,
                    latitude: markers.latitude,
                    width: 30,
                    height: 30
                  })
                  this.setData({
                    markers: result
                  })
                }
              })
            } else {
              result.push({
                iconPath: markers.userPhoto,
                id: markers._id,
                longitude: markers.longitude,
                latitude: markers.latitude,
                width: 30,
                height: 30
              })
              //可以改造promise函数
              this.setData({
                markers: result
              })
            }
            console.log(result)
          }

          this.setData({
            markers: result
          })
        }
      })
  },

  markertap(ev){
    // console.log(ev)
    wx.navigateTo({
      url: '/pages/detail/detail?userId='+ev.markerId,
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
    this.getLocation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLocation();
    this.getNearUsers();
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