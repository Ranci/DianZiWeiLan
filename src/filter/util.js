export default {
  // 采用indexOf的实现的模糊搜索，第一个参数是目标数组，第二个参数是目标字段，第三个参数是字段
  searchByIndexOf (arr, keyWord, statement) {
    if (!(arr instanceof Array)) {
      return
    }
    let tempArr = []
    arr.forEach((element, index, arr) => {
      if (element[statement].indexOf(keyWord) >= 0) {
        tempArr.push(element)
      }
    })
    return tempArr
  },

// 采用正则表达式的模糊查询，第一个参数是目标数组，第二个参数是正则表达式，第三个参数是字段

  searchByRegExp (arr, keyWord, statement) {
    if (!(arr instanceof Array)) {
      return
    }
    let reg = new RegExp(keyWord)
    let tempArr = []
    arr.forEach((element, index, arr) => {
      if (element[statement].match(reg) >= 0) {
        tempArr.push(element)
      }
    })
    return tempArr
  },

// 通过传入三个参数：第一个是数组，第二个是页数显示设置，第三个是页数，得到符合的数组
  getListDataBySize (arr, pagesize, page) {
    if (!(arr instanceof Array)) {
      return
    }
    let tempArr = arr.filter(
      (u, index) => index < pagesize * page && index >= pagesize * (page - 1)
    )
    return tempArr
  },

  mergeArrStatus (arrResult, arrFilter) {
    for (let index of arrResult) {
      for (let temp of arrFilter) {
        if (index.driverTel === temp.driverTel) {
          index = Object.assign(index, temp)
          continue
        }
      }
    }
    console.log(arrResult)
    return arrResult
  }
}
