var counter = 0
var thing
function count() {
    console.log(counter)
    counter++
    if (counter==5){
        self.postMessage("fskld")
        clearInterval(thing)
    }
}

self.addEventListener('message', function(e) {
    var temp = e.data.num
    counter = 0
    thing = setInterval(count, temp*100)

})