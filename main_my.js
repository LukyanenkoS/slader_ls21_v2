//создаем паттерн модуль
(function(time = 2000) {
    let container = document.querySelector('#slides');
    let slides = document.querySelectorAll('.slide');
    let controls = document.querySelector('#controls-container');
    let indicatorsContainer = document.querySelector('#indicators-container');
    //делаем отдельню переменную для индикатор, контейнер нужен был для делегирования
    let indicators = document.querySelectorAll('.indicator');
    let pausePlayBtn = document.querySelector('#pause');
    let nextBtn = document.querySelector('#next');
    let prevBtn = document.querySelector('#prev');


    let slidesCount = slides.length;
    let currentSlide = 0;
    let isPlaying = true;
    let interval = time;
    let timerID = null;
    let swipeStartX = null;
    let swipeEndX = null;

    //первый вид слайда через фукции
    //function nextSlide() {
    // slides[currentSlide].classList.toggle('active');
    //if (currentSlide < slides.length - 1) {
    //   currentSlide++
    //} else {
    // currentSlide = 0;
    //}
    //console.log(currentSlide);
    //slides[currentSlide].classList.toggle('active');}

    const FA_PLAY = 'Play';
    const FA_PAUSE = 'Pause';
    const SPACE = ' ';
    const LEFT_ARROW = 'ArrowLeft';
    const RIGHT_ARROW = 'ArrowRight';

    //сначала была функция след слайда через остаток от деления
    //function nextSlide() {
    //slides[currentSlide].classList.toggle('active');
    //для вывода в консоль для понимания
    //console.log(currentSlide);
    //console.log('%', (currentSlide + 1) % slides.length)
    //currentSlide = (currentSlide + 1) % slides.length;
    //console.log(currentSlide);
    //slides[currentSlide].classList.toggle('active');
    //}
    //тпеерь мы переделываем в фунции след и предыдущего слайда и меняем механизм

    const gotoNth = (n) => {
        slides[currentSlide].classList.toggle('active');
        indicators[currentSlide].classList.toggle('active');
        currentSlide = (slidesCount + n) % slidesCount;
        slides[currentSlide].classList.toggle('active');
        indicators[currentSlide].classList.toggle('active');
    }

    const gotoNext = () => {
        gotoNth(currentSlide + 1);
    }

    const gotoPrev = () => {
            gotoNth(currentSlide - 1);
        }
        //создаем фукнцию паузы
    const pause = () => {
        if (isPlaying) {
            isPlaying = !isPlaying;
            pausePlayBtn.innerHTML = FA_PLAY;
            clearInterval(timerID);
        }
    }

    const play = () => {
            isPlaying = !isPlaying;
            pausePlayBtn.innerHTML = FA_PAUSE;
            timerID = setInterval(gotoNext, interval);
        }
        //делаем функцию чтоб ставилась пауза когда нажимаем некст или превиуос
    const next = () => {
        pause();
        gotoNext();
    }

    const prev = () => {
        pause();
        gotoPrev();
    }
    const pausePlay = () => (isPlaying ? pause() : play());

    //делаем индикейт через делегирование
    const indicate = (e) => {
        let target = e.target;

        if (target.classList.contains('indicator')) {
            pause();
            gotoNth(+target.getAttribute('data-slide-to'));
        }
    };
    const pressKey = (e) => {
        if (e.key === LEFT_ARROW) prev();
        if (e.key === RIGHT_ARROW) next();
        if (e.key === SPACE) pausePlay();
    }
    const swipeStart = (e) => {
        swipeStartX = e.changedTouches[0].pageX;
    }
    const swipeEnd = (e) => {
            swipeEndX = e.changedTouches[0].pageX;
            swipeStartX - swipeEndX > 100 && next();
            swipeStartX - swipeEndX < -100 && prev();
        }
        //оптимизация кода
    const setListeners = () => {
        pausePlayBtn.addEventListener('click', pausePlay);
        nextBtn.addEventListener('click', next);
        prevBtn.addEventListener('click', prev);
        indicatorsContainer.addEventListener('click', indicate);
        container.addEventListener('touchstart', swipeStart);
        container.addEventListener('touchend', swipeEnd);
        document.addEventListener('keydown', pressKey);
    };
    const init = () => {
        controls.style.display = 'block';
        indicatorsContainer.style.display = 'block';
        setListeners();
        timerId = setInterval(gotoNext, interval);
    };
    init();
}());