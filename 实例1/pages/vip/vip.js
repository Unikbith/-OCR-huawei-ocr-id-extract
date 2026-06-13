Page({
    testCORS() {
      const that = this;
      wx.showLoading({
        title: '请求中...',
      });
      
      // 发送请求到Django后端
      wx.request({
        url: 'http://127.0.0.1:8000/views/', 
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: JSON.stringify({
          image: 'test'  // 此处为测试数据
        }),
        success(res) {
          wx.hideLoading();
          console.log('响应数据:', res.data);
          if (res.statusCode === 200) {
            wx.showModal({
              title: '跨域测试成功',
              content: `后端返回: ${JSON.stringify(res.data)}`,
              showCancel: false
            });
          } else {
            wx.showModal({
              title: '跨域测试失败',
              content: `HTTP状态码: ${res.statusCode}\n错误信息: ${res.data.message || '未知错误'}`,
              showCancel: false
            });
          }
        },
        fail(err) {
          wx.hideLoading();
          console.error('请求失败:', err);
          wx.showModal({
            title: '网络错误',
            content: '请求未到达服务器，请检查跨域配置',
            showCancel: false
          });
        }
      });
    }
  });