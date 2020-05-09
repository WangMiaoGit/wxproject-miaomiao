//index.js

const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrls: [
      "/images/demo01.jpg",
      "/images/demo02.jpg",
      "/images/demo03.jpg"
    ],
    listData: [],
    current: 'links'
  },

  handleCurrent(ev) {
    let current = ev.target.dataset.current;
    console.log(ev.target.dataset.current)
    if (current == this.data.current) {
      return false;
    }
    this.setData({
      current: current
    }, () => {
      this.getListData()
    })

  },

  handleDetail(ev) {
    let id = ev.target.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?userId='+id,
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
    this.getListData()

  },

  getListData() {
    //筛选  查询想要当字段
    db.collection('users').field({
      userPhoto: true,
      nickName: true,
      links: true
    })
      .orderBy(this.data.current, 'desc')
      .get().then((res) => {
        console.log(res.data)
        this.setData({
          listData: res.data
        })
      })
  },

  handleLinks(ev) {
    let id = ev.target.dataset.id;

    wx.cloud.callFunction({
      name: "update",
      data: {
        collection: 'users',
        doc: id,
        data: "{links : _.inc(1)}"
      }
    }).then((res) => {
      let update = res.result.startsWith.update;
      if (update) {
        let cloneListData = [...this.data.listData];
        for (let i = 0; i < cloneListData.length; i++) {
          if (cloneListData[i]._id == id) {
            cloneListData[0].links++
          }
        }
        this.setData({
          listData: cloneListData
        })
      }
    })

    // db.collection('users').doc(id).update({
    //   data:{
    //     links:5
    //   }
    // }).then((res)=>{

    // })
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