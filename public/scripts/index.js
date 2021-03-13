function showMore() {
    let img = document.querySelector('.plus-icon')
    let split = img.src.split('/')
    let more = document.querySelector('.more-container')

    if (split[split.length -1] == 'close.svg') {
        img.src = '/images/list.svg'
        more.style.display = 'none'
    } else {
        img.src = '/images/close.svg'
        more.style.display = 'flex'
    }
}

