// pages/my/index.js
Page({
    data: {
      money: 0,
      userInfo: {
        avatarUrl: '/images/mita/头像.png', // 默认头像
        nickName: '微信用户', // 默认昵称
      },
    },
     // 检查金币并增加金币的函数
  checkmoney() {
    if (this.data.money < 10) {
      this.setData({
        money: this.data.money + 1,
      });
      wx.showToast({
        title: '金币+1',
        icon: 'success',
        duration: 1000,
      });
    } else {
      wx.showToast({
        title: '金币已达上限',
        icon: 'none',
        duration: 1000, // 修正为数字类型
      });
    }
  },
    login() {
      wx.navigateTo({
        url: '/pages/login/login',
      });
    },
    // 接收登录页面传递的用户信息
    setUserInfo(userInfo) {
      this.setData({
        userInfo: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName,
        },
      });
    },
  });