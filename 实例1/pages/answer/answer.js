Page({
    data: {
      ocrResult: {}, // 用于存储从全局变量中获取的数据
      displayResult: [], // 用于存储格式化后的数据
    },
  
    onLoad() {
      const ocrResult = getApp().globalData.ocrResult;
      console.log('接收到的数据:', ocrResult);
  
      // 字段中文映射
      const fieldMapping = {
        words: '内容',
      };
  
      // 格式化数据
      const displayResult = Object.keys(ocrResult).map(key => {
        return {
          label: fieldMapping[key] || key, // 如果没有映射，则显示原字段名
          value: ocrResult[key].join('\n'), // 将数组转换为字符串，用换行符分隔
        };
      });
  
      // 将格式化后的数据绑定到页面的 data 中
      this.setData({
        ocrResult: ocrResult,
        displayResult: displayResult,
      });
    },
  });