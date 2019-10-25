import { levelArr } from './config';

export const levelName = function (member) {
  if(!member) return ''
  let type = member.memberType
  try{
    type = type.toString()
  }catch(e) {
    return '';
  }
  let level = member.memberTypeLevel
  if (level > 0) {
    type += '-' + level
  }
  for (let i = 0; i < levelArr.length; i++) {
    if (levelArr[i].value == type) return levelArr[i].key
  }
  return levelArr[1].key
}