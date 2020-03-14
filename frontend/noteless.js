(function () {
    const width = 480;
    let height = 0;

    let video = document.querySelector('.camera-feed')
    let canvas = document.querySelector('.camera-canvas')
    const result = document.querySelector('#result')

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
            video.srcObject = stream
            video.play()
        })
        .catch((err) => {
            console.error(err)
        })

    video.addEventListener('canplay', () => {
        height = video.videoHeight / (video.videoWidth / width)
        video.setAttribute('width', width)
        video.setAttribute('height', height)

        setInterval(() => {
            grabPhoto()
        }, 5000)
    })

    function grabPhoto() {
        let context = canvas.getContext('2d')
        canvas.width = width
        canvas.height = height
        context.drawImage(video, 0, 0, width, height)

        let data = canvas.toDataURL('image/png')
        // remove the first chunk of "data:image/png;base64,"
        data = data.substring(22)

        fetch('HTTP_API/intake', {
            method: 'post',
            body: JSON.stringify({
                Image: data
            })
        })
            .then((res) => {
                res.json().then((content) => {
                    // result = content.TextDetections[0].DetectedText;
                    console.log(content.TextDetections);
                    
                })
            })
    }
})()