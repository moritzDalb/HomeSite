const btn1 = document.querySelector('.btn1');
let menuOpen = false;
menuBtn.addEventListener('click', () => {
    if (!menuOpen) {
        btn1.classList.add('open');
        menuOpen = true;
    } else {
        btn1.classList.remove('open');
        menuOpen = false;
    }
});

// function getWidth() {
//     var btnsClassItems = document.getElementsByClassName("btns-class");
//     for(let item of btnsClassItems) {

//     }
// }