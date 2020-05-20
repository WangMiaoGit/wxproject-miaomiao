// pages/user/user.js
const db = wx.cloud.database()
const app = getApp()
const _=db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: "../../images/tabbar/me_selected.png",
    nickName: "用户名",
    isLogin: false,
    disabled: true,
    id: '',
    latitude: 0,
    longitude: 0
  },

  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const latitude = res.latitude;
        const longitude = res.longitude;
        console.log("latitude:"+latitude);
        console.log("longitude:"+longitude);
        this.data.latitude = latitude;
        this.data.longitude = longitude
      }
    })
  },

  //第一次授权拿到 用户信息  后面自动登录
  bindGetUserInfo(msg) {
    console.log(msg.detail.userInfo);
    let userInfo = msg.detail.userInfo;
    // this.setData({
    //   userPhoto: userInfo.avatarUrl,
    //   nickName: userInfo.nickName,
    //   isLogin: true
    // })

    wx.showModal({
      title: "微信登陆",
      content: "是否授权微信登陆",
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '授权成功',
            image: '../../images/确定.png'
          })

          db.collection('users').add({
            data: {
              userPhoto: userInfo.avatarUrl,
              nickName: userInfo.nickName,
              signature: '',
              phoneNumber: '',
              weixinNumber: '',
              links: 0,
              time: new Date(),
              isLocation: true,
              longitude: this.longitude,
              latitude: this.latitude,
              location:db.Geo.Point(this.longitude,this.latitude),
              friendList: []
            }
          }).then((res) => {
            db.collection('users').doc(res._id).get().then((res) => {
              // console.log(res.data)
              //添加全局数据
              app.userInfo = Object.assign(app.userInfo, res.data);
              this.setData({
                userPhoto: userInfo.avatarUrl,
                nickName: userInfo.nickName,
                isLogin: true,
                id: app.userInfo._id
              })
            })
          });

        } else if (res.cancel) {
          wx.showToast({
            title: '授权失败',
            image: '../../images/取消.png'
          })

          this.setData({
            isLogin: false
          })
        }
      }

      //其中的  this已经不是 page的this了 找不到setData 报错
      // success(res){
      //   if(res.confirm){
      //     this.setData({
      //       userPhoto: userInfo.avatarUrl,
      //       nickName: userInfo.nickName,
      //       isLogin: true
      //     })
      //   }else if(res.cancel){
      //   }
      // }

    })
  },

  loginOut() {
    this.setData({
      userPhoto: "../../images/tabbar/me_selected.png",
      nickName: "用户名",
      isLogin: false
    })
  },

  cancel(){
    console.log('点击了取消')
  },
  confirm(){
    console.log('点击了确定')
  },

  getMessage() {
    db.collection('message').where({
      userId: app.userInfo._id
    }).watch({
      onChange: function (snapshot) {
        // console.log(snapshot);
        if (snapshot.docChanges.length) {
          let list = snapshot.docChanges[0].doc.list;
          if (list.length) {
            wx.showTabBarRedDot({
              index: 2,
            });
            app.userMessage = list;
          } else {
            wx.hideTabBarRedDot({
              index: 2,
            });
            app.userMessage = [];
          }
        }
      },
      onError: function (err) {
        console.error(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let that = this;
    // // 查看是否授权
    // wx.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.getUserInfo({
    //         success: function (res) {
    //           let userInfo = res.userInfo;
    //           console.log(res.userInfo),
    //           that.setData({
    //             nickName:userInfo.nickName,
    //             isLogin:true,
    //             userPhoto:userInfo.avatarUrl
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    this.getLocation()
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then((res) => {
      // console.log(res)
      db.collection('users').where({
        _openid: res.result.openid
      }).get().then((res) => {

        if (res.data.length > 0) {
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          // console.log(res.data[0].nickName)
          // console.log(app.userInfo)
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            isLogin: true,
            id: app.userInfo._id
          });
          console.log('app.userInfo-----onReady:' + app.userInfo._id)
          // 监听数据  增加小红点
          this.getMessage();
        } else {
          this.setData({
            disabled: false
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('app.userInfo:' + app.userInfo._id)

    if (app.userInfo != {}) {
      this.setData({
        nickName: app.userInfo.nickName,
        userPhoto: app.userInfo.userPhoto,
        id: app.userInfo._id
      })
    }



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