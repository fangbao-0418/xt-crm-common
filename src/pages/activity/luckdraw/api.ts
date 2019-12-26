const { newPost } = APP.http
/**
 * 补发抽奖接口
 */
export function fillChance (payload: any) {
return newPost('/luckydraw/record/fillChance', payload)
}
  