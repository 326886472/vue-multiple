// 替换console.log
window.clog = console.log.bind(console)

// ifream监听元素高度改变 通过postMessage通知父级页面
window.listenerElHeightById = (id: any, offset = 0) => {
  // 获取需要监听高度的元素
  const element = document.getElementById(id)

  if (element === null) {
    console.error('指定ID的元素未找到')
  } else {
    // 创建Resize Observer实例
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // 当元素高度发生变化时，执行回调函数
        const { height } = entry.contentRect
        if (height > 0) {
          // 获取父窗口
          window.parent.postMessage({ height: height + offset }, '*')
          console.log('元素高度发生变化：', height)
        }
      }
    })
    observer.observe(element)
  }
}

// 通知外部是否可滚动 2 不可滚动 1 可滚动
(window as any).emitParentCanScroll = (flag = 2) => {
  window.parent.postMessage({ canScroll: flag }, '*')
  console.log('父层页面是否可滚动', flag)
}
