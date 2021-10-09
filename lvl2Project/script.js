
let bar = document.getElementById('bar')
let header = document.querySelector('h1')
let container = document.getElementById('container')
let intro = document.getElementById('intro')
let firstPage = true;
container.remove()
window.onload = function () {
  header.classList.add('shift')
}
window.addEventListener('wheel', event => {
  if (window.scrollY > 80) {
    bar.classList.add('stick')
  }
  else {
    bar.classList.remove('stick')
  }
  if (event.deltaY > 0 && firstPage) {
    firstPage = false
    header.classList.add('dip')
    header.addEventListener('transitionend', () => {
      console.log(true)
      header.remove()
      document.body.appendChild(container)
      container.style.setProperty('--direction', "50px")
      setTimeout(() => {
        container.classList.add('bruh')
        console.log(container.classList)
      }, 500)

    })
  }


})