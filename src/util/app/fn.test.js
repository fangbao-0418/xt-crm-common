/*
 * @Date: 2020-05-18 15:52:48
 * @LastEditors: fangbao
 * @LastEditTime: 2020-05-18 17:30:01
 * @FilePath: /eslint-plugin-xt-react/Users/fangbao/Documents/xituan/xt-crm/src/util/app/fn.test.js
 */

import { formatUnSafeData } from './fn'

test('format unsafe data', () => {
  const data = {
    input: ' abc ',
    content: {
      value: '  http://localhost:3000/#/interface/special-content/181'
    },
    list: [
      ' a1',
      {
        value: ' a1'
      }
    ]
  }
  const arr = formatUnSafeData([
    ' a1',
    ' a2  '
  ])
  const newData = formatUnSafeData(data)
  expect(newData.input).toBe('abc')
  expect(newData.content.value).toBe('http://localhost:3000/#/interface/special-content/181')
  expect(newData.list[0]).toBe('a1')
  expect(newData.list[1].value).toBe('a1')
  expect(arr[0]).toBe('a1')
  expect(arr[1]).toBe('a2')
})