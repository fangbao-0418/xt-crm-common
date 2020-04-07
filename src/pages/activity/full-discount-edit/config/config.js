export const getAction = function (path) {
  return /\w+(?=\/\d)/.exec(path)
}