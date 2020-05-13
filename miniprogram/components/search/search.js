// components/search/search.js

const app = getApp()
const db = wx.cloud.database()
Component({

  // 让组件中 可以得到  全局配置app  下的 属性
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFouce: false,
    historyList: [],
    searchList: [],
    searchValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus() {

      wx.getStorage({
        key: 'searchHistory',
        success: (res) => {
          // console.log("getStorage:"+res.data)
          this.setData({
            historyList: res.data
          })
        }
      })

      this.setData({
        isFouce: true
      })
    },


    //取消
    handleCancel() {
      this.setData({
        isFouce: false,
        searchValue: ''
      })
    },

    // 监听回车
    handleConfiem(ev) {
      //confrim  回车
      // console.log("historyList:" + this.data.historyList)
      if(ev.detail.value){
        console.log("有数据")
        this.showList(ev.detail.value)
      }else{

        console.log("没数据")
      }
      
    },

    showList(value){
      let dataList = [...this.data.historyList];
      dataList.unshift(value);
      console.log("dataList:" + dataList)

      wx.setStorage({
        key: 'searchHistory',
        data: [...new Set(dataList)],
      });

      this.changeSearchList(value)
    },

    // 监听输入
    handleImput(ev) {
      // console.log(ev.detail.value)
      this.setData({
        searchValue: ev.detail.value
      })
    },

    //删除搜索框内容
    handleDelSearch() {
      this.setData({
        searchValue: '',
        searchList:[]
      })
    },

    //点击历史
    handleHistory(ev) {
      console.log(ev.target.dataset.text);
      let searchValue = ev.target.dataset.text;
      this.setData({
        searchValue
      });
      this.showList(searchValue)
    },

    //删除历史
    handleDelHistory() {
      //删除数据缓存
      wx.removeStorage({
        key: 'searchHistory',
        success: () => {
          this.setData({
            historyList: []
          })
        }
      });
    },

    changeSearchList(value) {
      // 数据库正则对象  查询
      db.collection('users').where({
        nickName: db.RegExp({
          regexp: value,
          options: 'i',
        })
      })
        .field({
          userPhoto: true,
          nickName: true
        })
        .get()
        .then((res) => {
          this.setData({
            searchList: res.data
          })
        })
    }
  }
})
