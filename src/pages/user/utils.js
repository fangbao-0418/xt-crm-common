import { levelArr, HAODIAN_LEVEL_OPTIONS } from './config';

// 优选层级
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

// 好店层级
export const levelNameOfHaoDian = function (type) {
  try{
    type = type.toString()
  } catch(e) {
    return '';
  }
  for (let i = 0; i < HAODIAN_LEVEL_OPTIONS.length; i++) {
    if (HAODIAN_LEVEL_OPTIONS[i].value == type) return HAODIAN_LEVEL_OPTIONS[i].label
  }
  return HAODIAN_LEVEL_OPTIONS[1].label
}