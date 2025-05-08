function getlocal(name) {
  return JSON.parse(localStorage.getItem(name))
}
function setlocal(name, value) {
  localStorage.setItem(name, JSON.stringify(value))
}
function clear() {
  localStorage.clear()
}
function removelocal(name) {
  localStorage.removeItem(name)
}
export default {
  getlocal,
  setlocal,
  clear,
  removelocal,
}
