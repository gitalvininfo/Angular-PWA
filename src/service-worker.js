importScripts('./ngsw-worker.js');

self.addEventListener('sync', (event) => {
    if(event.tag === "post-data") {
        //call method

        event.waitUntil(addData());
    }
})


function addData() {
    // indexed DB
    let data = {
        id: 100,
        title: "Testing Title",
        author: "Alvin"
      }

    fetch('http://localhost:3000/posts', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(() => Promise.resolve()).catch(() => Promise.reject()); 
}