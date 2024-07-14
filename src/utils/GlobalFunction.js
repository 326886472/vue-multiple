const globalFunction = {
  async Sleep(time) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({})
      }, time)
    })
  },
  removeEmptyField(list, field) {
    list.forEach(v => (v[field].length === 0 ? delete v[field] : this.removeEmptyField(v[field], field)))
    return list
  },
  formatDataTree(data, id = 'id', fid = 'fid', children = 'children') {
    const tempTree = []
    const tree = []
    const items = []
    data.forEach((v) => {
      if (!tempTree[v[id]]) {
        const temp = v
        temp[children] = []
        tempTree[v[id]] = temp
        items.push(temp)
      }
    })
    items.forEach(
      v => (tempTree[v[fid]] && tempTree[v[fid]][children].push(tempTree[v[id]])) || tree.push(tempTree[v[id]]),
    )
    return this.removeEmptyField(tree, children)
  },
  /**
   * 获取指定的时间戳范围 今天 pos = 0   昨天 pos = -1  前天 pos = -2 明天 pos = 1
   * @return {{start: number, end: number}}
   */
  getTimeStampRange(pos = 0) {
    const dayTimeStamp = 86400000
    const start = new Date(Date.now() + pos * dayTimeStamp).setHours(0, 0, 0, 0)
    const end = new Date(Date.now() + pos * dayTimeStamp).setHours(23, 59, 59, 999)
    return {
      start,
      end,
    }
  },
  /**
   * 获取指定的周时间戳范围 本周 pos = 0  上周 pos = -1  上上周 pos = -2  下周 pos = 1 下下周 pos = 2
   * @param pos
   * @return {{start: number, end: number}}
   */
  getWeekTimeStampRange(pos = 0) {
    const dayTimeStamp = 86400000
    const date = new Date()
    const today = date.getDay()
    let stepSunDay = -today + 1
    let stepMonday = 7 - today
    if (today === 0) {
      stepSunDay = -7
      stepMonday = 0
    }
    const start = new Date(Date.now() + stepSunDay * dayTimeStamp + 7 * dayTimeStamp * pos).setHours(0, 0, 0, 0)
    const end = new Date(Date.now() + stepMonday * dayTimeStamp + 7 * dayTimeStamp * pos).setHours(23, 59, 59, 999)
    return {
      start,
      end,
    }
  },
  /**
   * 获取指定的月时间戳范围 本月 pos = 0  上月 pos = -1  上上月 pos = -2  下月 pos = 1 下下月 pos = 2
   * @param pos
   * @return {{start: number, end: number}}
   */
  getMonthTimeStampRange(pos = 0) {
    const d = new Date()
    const d1 = new Date(d.setMonth(d.getMonth() + pos, 1))
    let t1 = 0
    let t2 = 0
    t1 = new Date(d1.setDate(1)).setHours(0, 0, 0, 0)
    const d2 = new Date(t1)
    t2 = new Date(d2.setMonth(d2.getMonth() + 1)).setMilliseconds(-1)
    return {
      start: t1,
      end: t2,
    }
  },
  /**
   * 获取指定季度的时间戳范围 本季度 pos = 0 上季度 pos = -1 下季度 pos = 1
   * @param pos
   * @return {{start: number, end: number}}
   */
  getSeasonTimeStampRange(pos = 0) {
    const seasonMonths = [0, 3, 6, 9]
    let seasonIndex = 0
    const now = new Date()
    let seasonYear = now.getFullYear()
    const nowMonth = now.getMonth()
    if (nowMonth < 3) {
      seasonIndex = 0
    }

    if (nowMonth > 2 && nowMonth < 6) {
      seasonIndex = 1
    }

    if (nowMonth > 5 && nowMonth < 9) {
      seasonIndex = 2
    }
    if (nowMonth > 8) {
      seasonIndex = 3
    }
    seasonIndex += pos
    const diffYears = Math.floor(seasonIndex / 4)
    seasonYear += diffYears
    seasonIndex %= 4
    if (seasonIndex < 0) {
      seasonIndex += 4
    }
    // 获取季度开端月份 和 截止月份
    const startMonth = seasonMonths[seasonIndex]
    const endMonth = startMonth + 2
    const endMonthDays = this.getMonthDays(seasonYear, endMonth)
    return {
      start: new Date(seasonYear, startMonth, 1).getTime(),
      end: new Date(seasonYear, endMonth, endMonthDays).getTime(),
    }
  },
  getYearTimeStampRange(pos = 0) {
    const curYear = new Date().getFullYear()
    let t1 = 0
    let t2 = 0
    // new Date(year, month, day, hours, minutes, seconds, milliseconds);
    t1 = new Date(curYear + pos, 0, 1, 0, 0, 0, 0).getTime()
    t2 = new Date(curYear + pos, 11, 31, 23, 59, 59, 999).getTime()
    return {
      start: t1,
      end: t2,
    }
  },
  formatTime(time = Date.now(), formula = 'yyyy-MM-DD hh:mm:ss') {
    const date = new Date(time)
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    month = month.toString().padStart(2, '0')
    let day = date.getDate()
    day = day.toString().padStart(2, '0')
    let hour = date.getHours()
    hour = hour.toString().padStart(2, '0')
    let minutes = date.getMinutes()
    minutes = minutes.toString().padStart(2, '0')
    let second = date.getSeconds()
    second = second.toString().padStart(2, '0')
    return formula
      .replace('yyyy', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('hh', hour)
      .replace('mm', minutes)
      .replace('ss', second)
  },
  getMonthDays(year, month) {
    const monthStartDate = new Date(year, month, 1)
    const monthEndDate = new Date(year, month + 1, 1)
    return (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
  },
  /**
   * 生成E_chart日期数组
   * @param start 开始时间戳
   * @param len   可选 如果传入生成指定长度数组
   * @returns {*[]}
   */
  genDaysArr(start, len) {
    const d = new Date(start)
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    const m_str = m >= 10 ? m : `0${m}`
    const s = d.getDate()
    let cursor = 1

    // 获取指定月份天数
    let days = new Date(y, m, 0).getDate()
    if (len) {
      cursor = s
      days = s + len - 1
    }
    const arr = []
    for (let i = cursor; i <= days; i++) {
      const day_str = i >= 10 ? i : `0${i}`
      arr.push({ day: `${y}-${m_str}-${day_str}`, count: 0 })
    }
    return arr
  },
  genDaysArrFromRange(start, end) {
    // 今天、昨天、本月、上月 都按月视图展示
    const s_date = new Date(start)
    const e_date = new Date(end)
    const s_m = s_date.getMonth()
    const e_m = e_date.getMonth()
    const s_day = s_date.getDate()
    const e_day = e_date.getDate()
    const days = new Date(s_date.getFullYear(), s_date.getMonth() + 1, 0).getDate() // 指定日期月份天数

    // 相同月份
    if (s_m === e_m) {
      if (e_day - s_day === 6) {
        return globalFunction.genDaysArr(start, 7)
      }
      return globalFunction.genDaysArr(start)
    } else {
      // 本周、上周
      // 跨月份
      if (e_day - s_day < 0) {
        const a1 = globalFunction.genDaysArr(start, days - s_day + 1)
        const a2 = globalFunction.genDaysArr(new Date(s_date.getFullYear(), s_m + 1, 1).getTime(), e_day)
        return [...a1, ...a2]
      }
      // 本年度、上年度、本季度、上季度
      if (s_day === 1 && e_day >= 30) {
        let arr = []
        for (let i = s_m; i <= e_m; i++) {
          arr = arr.concat(globalFunction.genDaysArr(new Date(s_date.getFullYear(), i, 1).getTime(), 30))
        }
        return arr
      }
      return []
    }
  },
  genMapFromArr(arr, key, val) {
    const obj = {}
    arr.forEach((a) => {
      obj[a[key]] = a[val]
    })
    return obj
  },
  /**
   * 检测是否是手机号
   * @param mobile
   * @return {boolean}
   */
  isMobile(mobile) {
    const reg = /^1(3|4|5|6|7|8|9)\d{9}$/
    return reg.test(mobile)
  },

  checkArrayContains(array, item) {
    if (!Array.isArray(item)) {
      return array.includes(item)
    }
    for (let i = 0; i < item.length; i++) {
      const v = item[i]
      if (!array.includes(v)) {
        return false
      }
    }
    return true
  },
  /**
   * 首字母大写
   * @param text
   * @return {string}
   */
  firstUpperCase(text) {
    return text
      .split('')
      .map((v, i) => (i && v.toLowerCase()) || v.toUpperCase())
      .join('')
  },
  getPlatform() {
    const u = navigator.userAgent
    // 是否是android浏览器
    const isAndroid = u.includes('Android')
    // 是否是ios浏览器
    const isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    let msg = ''
    if (isAndroid) {
      msg = 'android'
    } else if (isIos) {
      msg = 'ios'
    } else {
      msg = 'pc'
    }
    return msg
  },
  genFileIdentifyName(f) {
    return `${f.name}|${f.size}|${f.type.toString().split('/').join('-')}|${f.lastModified}`
  },
  lazyText(txt, size = 15) {
    let res = ''
    if (txt.length <= size) {
      res = txt
    } else {
      res = `${txt.substr(0, size)}...`
    }
    return res
  },
  brText(txt) {
    if (txt.length <= 15) {
      return txt
    }
    const len = txt.length
    const slice = 15
    const num = Math.ceil(len / slice)
    const res = []
    for (let i = 0; i < num; i++) {
      res.push(txt.substr(i * slice, slice))
    }
    return res.join('<br/>')
  },
  _removePad(arr, padStr) {
    let flag = false
    const res = []
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i]
      if (v !== padStr) {
        flag = true
      }
      if (flag) {
        res.push(v)
      }
    }
    if (res.length === 0) {
      res.push(padStr)
    }
    return res.join('')
  },
  padAppVersion(version) {
    let vs = version.split('.')
    vs = vs.map(v => v.toString().padStart(4, '0'))
    return vs.join('.')
  },
  removePadAppVersion(version) {
    let vs = version.split('.')
    vs = vs.map((v) => {
      const vvs = v.split('')
      return this._removePad(vvs, '0')
    })
    return vs.join('.')
  },
  /**
   * 英文标点符号转换为中文
   * @param str
   */
  transformPunctuation(str) {
    const en = ['(', ')', '[', ']', '{', '}', '<', '>', ',', '.', '?', '!']
    const zh = ['（', '）', '【', '】', '「', '」', '《', '》', '，', '。', '？', '！']
    let newStr = ''
    str.split('').forEach((v) => {
      if (en.includes(v)) {
        newStr += zh[en.indexOf(v)]
      } else {
        newStr += v
      }
    })
    return newStr
  },
  transFromZhToEn(str) {
    const en = ['(', ')', '[', ']', '{', '}', '<', '>', ',', '.', '?', '!']
    const zh = ['（', '）', '【', '】', '「', '」', '《', '》', '，', '。', '？', '！']
    let newStr = ''
    str.split('').forEach((v) => {
      if (zh.indexOf(v) > 0) {
        newStr += en[zh.indexOf(v)]
      } else {
        newStr += v
      }
    })
    return newStr
  },
  formatAmount(amount) {
    if (amount === 0) return 0
    return Number.parseFloat(amount / 100).toFixed(2)
  },
  formatSeconds(seconds) {
    if (seconds === 0) return '0秒'
    const y = Math.floor(seconds / 31536000)
    const d = Math.floor((seconds % 31536000) / 86400)
    const h = Math.floor(((seconds % 31536000) % 86400) / 3600)
    const m = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60)
    const s = (((seconds % 31536000) % 86400) % 3600) % 60

    let result = ''
    if (y) result += `${y}年`
    if (d) result += `${d}天`
    if (h) result += `${h}小时`
    if (m) result += `${m}分钟`
    if (s) result += `${s}秒`

    return result
  },
  formatSecondsV2(seconds) {
    if (seconds === 0) return '00:00:00'
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor((seconds % 3600) % 60)

    let result = ''
    h ? (result += `${h.toString().padStart(2, '0')}:`) : (result += '00:')
    m ? (result += `${m.toString().padStart(2, '0')}:`) : (result += '00:')
    s ? (result += s.toString().padStart(2, '0')) : (result += '00')
    return result
  },
  // 如果后端要求字段为int,前端需要把空字符串字段去掉,否则接口会报错
  trimData(model) {
    const obj = {}
    Object.keys(model).forEach((key) => {
      if (model[key] !== '') {
        obj[key] = model[key]
      }
    })
    return obj
  },
  arr2map(arr) {
    const obj = {}
    arr.forEach((item) => {
      obj[item.value] = item.label
    })
    return obj
  },
  // 处理金额查询条件 fields(type Array)
  scaleNumber(param, fields, sign) {
    fields.forEach((key) => {
      if (sign > 0) {
        param[key] = Math.round(param[key] / 100)
      } else {
        param[key] = Math.round(param[key] * 100)
      }
    })
    return param
  },
  safeAmount(val) {
    return Number(Number(val * 100).toFixed(2))
  },
  safeLabel(val, separator = ',') {
    if (!val) {
      return []
    } else {
      return val.split(separator)
    }
  },
  computeStatusBuyNow(start_time, end_time) {
    const now = new Date().getTime()
    if (now < start_time) return 1
    if (now > start_time && now < end_time) return 2
    if (now > end_time) return 3
  },
  Status(start, end) {
    const cur = new Date().getTime()
    if (cur < start) {
      return '未开始'
    } else if (cur > end) {
      return '已结束'
    } else {
      return '进行中'
    }
  },
  /**
   * 保留两位百分数
   * @param {*} val int
   */
  toPercent(val) {
    if (val === 0) return '0%'
    return `${val.toFixed(2)}%`
  },
}

export default globalFunction
