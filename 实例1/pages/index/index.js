Page({
    data: {
      imagePath: '', // 存储图片路径
      base64Image: '', // 存储 Base64 编码的图片数据
      ocrResult: null // 存储 OCR 识别结果
    },
  
    // 选择图片
    chooseImage() {
      const that = this;
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'], // 明确指定媒体类型为图片
        sizeType: ['compressed'], // 压缩图片
        sourceType: ['album', 'camera'], // 从相册或相机选择
        success(res) {
          // 获取临时文件路径
          const tempFilePath = res.tempFiles[0].tempFilePath;
  
          // 更新图片路径
          that.setData({
            imagePath: tempFilePath
          });
  
          // 显示加载提示
          wx.showLoading({
            title: '图片处理中...',
            mask: true
          });
  
          // 将图片转换为 Base64
          wx.getFileSystemManager().readFile({
            filePath: tempFilePath,
            encoding: 'base64',
            success(res) {
              // 去除 Base64 头信息（如 data:image/jpeg;base64,）
              const base64Data = res.data.replace(/^data:image\/\w+;base64,/, '');
              that.setData({
                base64Image: base64Data
              });
  
              // 隐藏加载提示
              wx.hideLoading();
              wx.showToast({
                title: '图片读取成功',
                icon: 'success'
              });
            },
            fail(err) {
              console.error('文件读取失败:', err);
              wx.hideLoading();
              wx.showToast({
                title: '图片读取失败',
                icon: 'none'
              });
            }
          });
        },
        fail(err) {
          console.error('图片选择失败:', err);
          wx.showToast({
            title: '图片选择取消',
            icon: 'none'
          });
        }
      });
    },
  
    // 上传图片到 Django 后端
    uploadImageToServer1() {
      const that = this;
      const { base64Image } = this.data;
  
      // 检查是否已选择图片
      if (!base64Image) {
        wx.showToast({
          title: '请先选择图片',
          icon: 'none'
        });
        return;
      }
      // 发送请求
      wx.request({
        url: 'http://127.0.0.1:8000/views/', // 替换为你的 Django 后端地址
        method: 'POST',
        data: {
          image: base64Image
        },
        header: {
          'content-type': 'application/json'
        },
        success(res) {
          wx.hideLoading();
          console.log('上传成功', res.data);
  
          // 处理返回的结果
          if (res.data.status === 'success') {
            wx.showToast({
              title: '上传成功',
              icon: 'success'
            });
            // 更新 OCR 结果
            that.setData({
              ocrResult: res.data.data // 修改为 res.data.data
            });
            getApp().globalData.ocrResult = res.data.data;
            wx.navigateTo({
              url: '/pages/answer/answer',
            })
            console.log('OCR 处理结果:', res.data.data); // 修改为 res.data.data
          } else {
            wx.showToast({
              title: `上传失败: ${res.data.message || '未知错误'}`,
              icon: 'none'
            });
          }
        },
        fail(err) {
          wx.hideLoading();
          console.error('上传失败', err);
          wx.showToast({
            title: '网络错误，请重试',
            icon: 'none'
          });
        }
      });
    },
    uploadImageToServer2() {
        const that = this;
        const { base64Image } = this.data;
    
        // 检查是否已选择图片
        if (!base64Image) {
          wx.showToast({
            title: '请先选择图片',
            icon: 'none'
          });
          return;
        }

    
        // 发送请求
        wx.request({
          url: 'http://127.0.0.1:8000/word/', // 替换为你的 Django 后端地址
          method: 'POST',
          data: {
            image: base64Image
          },
          header: {
            'content-type': 'application/json'
          },
          success(res) {
            wx.hideLoading();
            console.log('上传成功', res.data);
    
            // 处理返回的结果
            if (res.data.status === 'success') {
              wx.showToast({
                title: '上传成功',
                icon: 'success'
              });
              // 更新 OCR 结果
              that.setData({
                ocrResult: res.data.data // 修改为 res.data.data
              });
              getApp().globalData.ocrResult = res.data.data;
            wx.navigateTo({
              url: '/pages/answer1/answer1',
            })
              console.log('OCR 处理结果:', res.data.data); // 修改为 res.data.data
            } else {
              wx.showToast({
                title: `上传失败: ${res.data.message || '未知错误'}`,
                icon: 'none'
              });
            }
          },
          fail(err) {
            wx.hideLoading();
            console.error('上传失败', err);
            wx.showToast({
              title: '网络错误，请重试',
              icon: 'none'
            });
          }
        });
      }
  });