// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud-o1t4u'
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {

    if(typeof event.data=='string'){
      // 当前端传过来当是字符串 进行解析 成数据库对象
      event.data = eval('('+event.data+')');
    }

    return await db.collection(event.collection).doc(event.doc)
    .update({
      data:{
        ...event.data
      }
    })
  } catch (e) {
    console.error(e)
  }
}