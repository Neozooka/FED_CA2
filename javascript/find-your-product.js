(function(){
    const q1 = document.getElementById('q1')
    const q2 = document.getElementById('q2')
    const results = document.getElementById('results')
    const resultImg = document.getElementById('result-img')
    const resultName = document.getElementById('result-name')
    const resultText = document.getElementById('result-text')
    const restart = document.getElementById('restart')

    let choice1 = null

    function fadeOut(el){
        el.classList.add('opacity-0')
        setTimeout(()=> el.classList.add('hidden'), 300)
    }

    function fadeIn(el){
        el.classList.remove('hidden')
        setTimeout(()=> el.classList.remove('opacity-0'), 10)
    }

    document.querySelectorAll('#q1 .option').forEach(btn=>{
        btn.addEventListener('click', e=>{
            choice1 = e.currentTarget.dataset.value
            fadeOut(q1)
            setTimeout(()=> fadeIn(q2), 350)
        })
    })

    document.querySelectorAll('#q2 .option').forEach(btn=>{
        btn.addEventListener('click', e=>{
            const choice2 = e.currentTarget.dataset.value
            fadeOut(q2)

            setTimeout(()=>{
                if(choice1 === 'Mouse' && choice2 === 'Affordable'){
                    resultImg.src = "../images/PythonV1_372.png"
                    resultName.innerText = 'neXus Python'
                    resultText.innerText = 'The neXus Python is an affordable gaming mouse designed for precision and comfort.'
                }
                else if (choice1 === 'Mouse' && choice2 === 'Luxury'){
                    resultImg.src = "../images/PythonV2_372.png"
                    resultName.innerText = 'neXus PythonV2'
                    resultText.innerText = 'A premium version of the neXus Python with advanced features and performance for serious gamers.'
                }
                else if (choice1 === 'Keyboard' && choice2 === 'Affordable'){
                    resultImg.src = "../images/"
                    resultName.innerText = 'neXus 60HE'
                    resultText.innerText = 'The neXus KeyLite is an affordable hall-effect keyboard that offers a great responsive feel without breaking the bank.'
                }
                else if (choice1 === 'Keyboard' && choice2 === 'Luxury'){
                    resultImg.src = "../images/"
                    resultName.innerText = 'neXus 60HE'
                    resultText.innerText = 'The neXus KeyPro is a high-end hall-effect keyboard with customizable RGB lighting and premium switches for maximum performance.'
                }
                else if (choice1 === 'Headset' && choice2 === 'Affordable'){
                    resultImg.src = "../images/"
                    resultName.innerText = 'neXus Kraken'
                    resultText.innerText = 'The neXus Kreaken is an affordable gaming headset that delivers clear audio and comfort for long gaming sessions.'
                }
                else if (choice1 === 'Headset' && choice2 === 'Luxury'){
                    resultImg.src = "../images/Lochness_372.png"
                    resultName.innerText = 'neXus Lochness'
                    resultText.innerText = 'The neXus  is a premium gaming headset with surround sound and noise-canceling features for an immersive gaming experience.'
                }
                fadeIn(results)
            }, 350)
        })
    })

    restart.addEventListener('click', ()=>{
        fadeOut(results)

        setTimeout(()=>{
            choice1 = null
            results.classList.add('hidden')
            results.classList.add('opacity-0')
            q1.classList.remove('hidden')
            q1.classList.remove('opacity-0')
            setTimeout(()=> q1.classList.remove('opacity-0'), 10)
        }, 250)
    })

    q2.classList.add('hidden')
    q2.classList.add('opacity-0')
    results.classList.add('hidden')
    results.classList.add('opacity-0')
})()