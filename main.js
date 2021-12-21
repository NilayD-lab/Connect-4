var worker = new Worker('worker.js');
var worker2 = new Worker('worker.js');
var numOfChanges = 0
document.querySelector('button').onclick = async () => {
    worker.postMessage({
        num: 5,
        name: "name1",
        list: [4, 4, 4]
    })
    worker2.postMessage({
        num: 1,
        name: "name2",
        list: [3, 6, 6]
    })
    var stuff = setInterval(() => {
        console.log("bruh")
        if (numOfChanges!=0){
            clearInterval(stuff)
        }
    }, 500);
    console.log("done")
}

worker.onmessage = (event) => {
    console.log(event.data)
    numOfChanges++
}

worker2.onmessage = (event) => {
    console.log(event.data)
}
