export const FZ_JsBridge = {
  isApp: navigator.userAgent.includes('foundingAzApp'),
  isAndroid() {
    if (!this.isApp) {
      return false
    }
    return navigator.userAgent.toString().toLowerCase().includes('android')
  },
  isIOS() {
    if (!this.isApp) {
      return false
    }
    return !this.isAndroid()
  },
  closeWebView() {
    if (this.isIOS() && (window as any).webkit) {
      (window as any).webkit.messageHandlers.finish.postMessage(null)
    }
    if (this.isAndroid() && (window as any).jsBridge) {
      (window as any).jsBridge.finish()
    }
  },
  // 关闭弹窗
  closeDialog() {
    if (this.isIOS() && (window as any).webkit) {
      (window as any).webkit.messageHandlers.dismiss.postMessage(null)
    }
    if (this.isAndroid() && (window as any).jsBridge) {
      (window as any).jsBridge.dismiss()
    }
  },
  finishWebView(flag: any) {
    if (this.isIOS() && (window as any).webkit) {
      (window as any).webkit.messageHandlers.finish.postMessage(flag)
    }
    if (this.isAndroid() && (window as any).jsBridge) {
      (window as any).jsBridge.finish(flag)
    }
  },
  getToken() {
    if (this.isAndroid() && (window as any).jsBridge) {
      return (window as any).jsBridge.getToken()
    }
    if (this.isIOS() && (window as any).webkit) {
      return (window as any).prompt('getToken')
    }
  },

  /**
   * 分享
   * @param data
   * @returns {*}
   */
  openShare(data: any) {
    if (this.isAndroid() && (window as any).jsBridge) {
      return (window as any).jsBridge.openShare(JSON.stringify(data))
    }
    if (this.isIOS() && (window as any).webkit) {
      return (window as any).webkit.messageHandlers.openShare.postMessage(JSON.stringify(data))
    }
  },

  login() {
    if (this.isAndroid() && (window as any).jsBridge) {
      return (window as any).jsBridge.login()
    }
    if (this.isIOS() && (window as any).webkit) {
      return (window as any).webkit.messageHandlers.login.postMessage(null)
    }
  },

  appPay(id: any, price: any, method: any, goods_spec: any, gifts: any, paId: any, buy_num: any) {
    const param = {
      id,
      price,
      method,
      goods_spec,
      gifts,
      page_activity_id: paId,
      buy_num,
    }
    if (this.isAndroid() && (window as any).jsBridge) {
      return (window as any).jsBridge.appPay(JSON.stringify(param))
    }
    if (this.isIOS() && (window as any).webkit) {
      return (window as any).webkit.messageHandlers.appPay.postMessage(JSON.stringify(param))
    }
  },
  goToGoods(goodsId: any, deliveryId: any, isBuy: any) {
    const param = {
      id: goodsId,
      delivery_id: deliveryId,
      is_buy: isBuy,
    }
    if (this.isAndroid() && (window as any).jsBridge) {
      return (window as any).jsBridge.startGoodsDetail(JSON.stringify(param))
    }
    if (this.isIOS() && (window as any).webkit) {
      return (window as any).webkit.messageHandlers.jsToOcFunctionGoodsDetail.postMessage(JSON.stringify(param))
    }
  },
  goToPath(path: any, params: any) {
    const param = [
      {
        path,
        parameter: [params],
      },
    ]
    if (this.isAndroid() && (window as any).jsBridge) {
      return (window as any).jsBridge.autoJump(JSON.stringify(param))
    }
    if (this.isIOS() && (window as any).webkit) {
      return (window as any).webkit.messageHandlers.autoJump.postMessage(JSON.stringify(param))
    }
  },
  titleBarEnable(isShow: any) {
    let param = 'false'
    if (isShow) {
      param = 'true'
    }
    if (this.isAndroid() && (window as any).jsBridge) {
      return (window as any).jsBridge.titleBarEnable(param)
    }
    if (this.isIOS() && (window as any).webkit) {
      return (window as any).webkit.messageHandlers.titleBarEnable.postMessage(param)
    }
  },
  openMainPage(page: { toString: () => any }) {
    if (this.isAndroid() && (window as any).jsBridge) {
      return (window as any).jsBridge.openMainPage(page.toString())
    }
    if (this.isIOS() && (window as any).webkit) {
      return (window as any).webkit.messageHandlers.openMainPage.postMessage(page.toString())
    }
  },
  customRoute(androidUrl: { toString: () => any }, iosUrl: { toString: () => any }) {
    if (this.isAndroid() && (window as any).jsBridge) {
      return (window as any).jsBridge.customRoute(androidUrl.toString())
    }
    if (this.isIOS() && (window as any).webkit) {
      return (window as any).webkit.messageHandlers.customRoute.postMessage(iosUrl.toString())
    }
  },
  updateHeight(height: { toString: () => any }) {
    if (this.isAndroid() && (window as any).jsBridge) {
      return (window as any).jsBridge.updateHeight((Number(height) * 3).toString())
    }
    if (this.isIOS() && (window as any).webkit) {
      return (window as any).webkit.messageHandlers.updateHeight.postMessage(height.toString())
    }
  },
  //   关闭弹层
  // 投票资格
  openVoteUserList(dmId: any, userList: any) {
    if (this.isAndroid() && (window as any).jsBridge) {
      return (window as any).jsBridge.openVoteUserList(JSON.stringify({ dmId: +dmId, userList }))
    }
    if (this.isIOS() && (window as any).webkit) {
      return (window as any).webkit.messageHandlers.openVoteUserList.postMessage(JSON.stringify({ dmId: +dmId, userList: userList.toString() }))
    }
  },
}
