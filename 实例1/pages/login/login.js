// index.js
Component({
    data: {
        userInfo: {
            avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
            nickName: '',
        },
        hasUserInfo: false,
        canIUseGetUserProfile: wx.canIUse('getUserProfile'),
        canIUseNicknameComp: wx.canIUse('input.type.nickname'),
        fromPage: '', // 记录来源页面
    },
    methods: {
        onLoad() {
            // 获取来源页面路径
            const pages = getCurrentPages();
            if (pages.length > 1) {
                const prevPage = pages[pages.length - 2]; // 获取上一个页面
                this.setData({
                    fromPage: prevPage.route, // 记录来源页面路径
                });
            }
        },
        bindViewTap() {
            wx.navigateTo({
                url: '/pages/index/index',
            });
        },
        onChooseAvatar(e) {
            const { avatarUrl } = e.detail;
            const { nickName } = this.data.userInfo;
            this.setData({
                "userInfo.avatarUrl": avatarUrl,
            }, () => {
                this.setData({
                    hasUserInfo: nickName && avatarUrl,
                }, this.checkLoginStatus);
            });
        },
        onInputChange(e) {
            const nickName = e.detail.value;
            const { avatarUrl } = this.data.userInfo;
            this.setData({
                "userInfo.nickName": nickName,
            }, () => {
                this.setData({
                    hasUserInfo: nickName && avatarUrl,
                }, this.checkLoginStatus);
            });
        },
        getUserProfile() {
            wx.getUserProfile({
                desc: '展示用户信息',
                success: (res) => {
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true,
                    }, this.checkLoginStatus);
                },
            });
        },
        // pages/login/login.js
        checkLoginStatus() {
            if (this.data.hasUserInfo) {
                wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 1500,
                    success: () => {
                        setTimeout(() => {
                            // 获取当前页面栈
                            const pages = getCurrentPages();
                            const prevPage = pages[pages.length - 2]; // 获取上一个页面（用户页面）
                            if (prevPage) {
                                // 调用上一个页面的方法，更新用户信息
                                prevPage.setUserInfo(this.data.userInfo);
                            }
                            wx.navigateBack({
                                delta: 1, // 返回上一页
                            });
                        }, 1500);
                    },
                });
            }
        }
    },
});