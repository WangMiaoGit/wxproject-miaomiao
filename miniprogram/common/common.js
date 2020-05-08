// 模块化  引入公用代码
const app = getApp();
const db = wx.cloud.database();

function setapp(){
  return app;
}
function setdb(){
  return db;
}

module.exports={
  get_app:setapp,
  get_db:setdb
}