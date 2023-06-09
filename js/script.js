document.addEventListener('DOMContentLoaded', () => {

// tabs


    const tabContent = document.querySelectorAll('.tabcontent'),
          tabParent = document.querySelector('.tabheader__items'),
          tabItem = document.querySelectorAll('.tabheader__item');



    function hideTabContent() {
        tabContent.forEach(item  => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabItem.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }


    function showTabContent(i = 0) {
        tabContent[i].classList.add('show', 'fade');
        tabContent[i].classList.remove('hide');


        tabItem[i].classList.add('tabheader__item_active');

    }





    hideTabContent();
    showTabContent();


    tabParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabItem.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);

                }
            });
        }
    });


    //timer 

    const deadline = '2022-05-31';


    function getTimeRemaining(endtime) {

        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());


        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor( (t/(1000*60*60*24)) ),
                seconds = Math.floor( (t/1000) % 60 ),
                minutes = Math.floor( (t/1000/60) % 60 ),
                hours = Math.floor( (t/(1000*60*60) % 24) );
        }
                


        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num){
        if (num >= 0 && num < 10) { 
            return '0' + num;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
             days = timer.querySelector('#days'),
             hours = timer.querySelector('#hours'),
             minutes = timer.querySelector('#minutes'),
             seconds = timer.querySelector('#seconds'),
             timeInterval = setInterval(updateClock, 1000);
    
        updateClock();


        function updateClock() {
            const t = getTimeRemaining(endtime);



            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);
            

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }         
    }


    setClock('.timer', deadline);


    



    //modal 


    const modalBtn = document.querySelectorAll('[data-modal]'),
        //   modalClose = document.querySelector('[data-close]'),
          modal = document.querySelector('.modal');

          function openModal() {
            modal.classList.add('show');
            modal.classList.remove('hide');
            document.body.style.overflow = 'hidden';
            clearInterval(modalTime);
          }

        modalBtn.forEach(btn => {
            btn.addEventListener('click', openModal);
        });
            

        function closeModal() {
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = '';
        }

        // modalClose.addEventListener('click', closeModal)
            

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.getAttribute('data-close') == '') {
                closeModal();
            }
        });


        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && modal.classList.contains('show')) {
                closeModal();
            }
        });


        const modalTime = setTimeout(openModal, 50000);

        function showModalByScroll() {
            if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
                openModal();
                window.removeEventListener('scroll', showModalByScroll);
            }
        }

        window.addEventListener('scroll', showModalByScroll);



        //use classes for product card


        class MenuCard {
            constructor(src, alt, title, descr, price, parentSelector, ...classes) {
                this.src = src;
                this.alt = alt;
                this.title = title;
                this.descr = descr;
                this.price = price;
                this.classes = classes;
                this.parent = document.querySelector(parentSelector);
                this.transfer = 80;
                this.changeToRUB();

            }
            changeToRUB() {
                this.price = this.price * this.transfer;
            }
            render() {
                const element = document.createElement('div');
                if (this.classes.length === 0) {
                    this.element = 'menu__item';
                    element.classList.add(this.element);
                } else {
                    this.classes.forEach(className => element.classList.add(className));
                }
                element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                    </div>
                `;
                this.parent.append(element);
            }
        }


        const getResource = async (url) => {
            const res = await fetch(url)

            if (!res.ok) {
                throw new Error(`Could not fetch ${url}, status: ${res.status}`);
            }


            return await res.json();
        };

        // getResource('http://localhost:3000/menu')
        // .then(data => {
        //     data.forEach(({img, altimg, title, descr, price}) => {
        //         new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
        //     });
        // });

        axios.get('http://localhost:3000/menu')
        .then(data => {
                data.data.forEach(({img, altimg, title, descr, price}) => {
                    new MenuCard(img, altimg, title, descr, price, '.menu .container').render();
                });
        });


        // getResource('http://localhost:3000/menu')
        // .then(data => createCard(data));


        // function createCard(data)   {
        //     data.forEach(({img, altimg, title, descr, price}) => {
        //         const element = document.createElement('div');
        //         price = price * 80;

        //         element.classList.add('menu__item');

        //         element.innerHTML = `
        //         <img src=${img} alt=${altimg}>
        //             <h3 class="menu__item-subtitle">${title}</h3>
        //             <div class="menu__item-descr">${descr}</div>
        //             <div class="menu__item-divider"></div>
        //             <div class="menu__item-price">
        //                 <div class="menu__item-cost">Цена:</div>
        //                 <div class="menu__item-total"><span>${price}</span> руб/день</div>
        //             </div>
        //         `
        //         document.querySelector('.menu .container').append(element);
        //     });
        // }

        // new MenuCard(
        //     "img/tabs/vegy.jpg",
        //     "vegy",
        //     'Меню "Фитнес"',
        //     'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        //     15,
        //     '.menu .container',
        //     'menu__item',
        // ).render();


        // new MenuCard(
        //     "img/tabs/elite.jpg",
        //     "elite",
        //     'Меню “Премиум”',
        //     'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        //     19,
        //     '.menu .container',
        //     'menu__item'
        // ).render();

        // new MenuCard(
        //     "img/tabs/post.jpg",
        //     "post",
        //     'Меню "Постное"',
        //     'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков. ',
        //     16,
        //     '.menu .container',
        //     'menu__item'

        // ).render();


        //forms

        const forms = document.querySelectorAll('form');
        const message = {
            loading: 'img/form/spinner.svg',
            success: 'Спасибо, скоро мы с Вами свяжемся',
            failure: 'Что-то пошло не так...'
        };


        forms.forEach(item => {
            bindPostData(item);
        });

        const postData = async (url, data) => {
            const res = await fetch(url, {
                method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: data
            });

            return await res.json();
        };


        function bindPostData(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const statusMessage = document.createElement('img');
                statusMessage.src = message.loading;
                statusMessage.style.cssText = `
                    display: block;
                    margin: 0 auto;
                `;
                form.insertAdjacentElement('afterend', statusMessage);


                


                const formData = new FormData(form);

                


                const json = JSON.stringify(Object.fromEntries(formData.entries()));





               
                postData('http://localhost:3000/requests', json)    
                
                
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                    statusMessage.remove();
                }).catch(() => {
                    showThanksModal(message.failure);
                }).finally(() => {
                    form.reset();
                })
            });
        }




        function showThanksModal(message) {
            const prevModalDialog = document.querySelector('.modal__dialog');
            prevModalDialog.classList.add('hide');

            openModal();

            const thanksModal = document.createElement('div');
            thanksModal.classList.add('modal__dialog');
            thanksModal.innerHTML = `
                <div class="modal__content">
                        <div data-close class="modal__close">&times;</div>
                        <div class="modal__title">${message}</div>
                </div>
            `;

            document.querySelector('.modal').append(thanksModal);
            setTimeout(() => {
                thanksModal.remove();
                prevModalDialog.classList.add('show');
                prevModalDialog.classList.remove('hide');
                closeModal();
            }, 4000)
        }





    // fetch('https://jsonplaceholder.typicode.com/posts', {
    //     method: 'POST',
    //     body: JSON.stringify({name: 'ALEX'}),
    //     headers: {
    //         'Content-type': 'application/json'
    //     }
    // })
    //     .then(response => response.json())
    //     .then(json => console.log(json));








    // fetch('http://localhost:3000/menu')
    // .then(data => data.json())
    // .then(res => console.log(res));
  





    // slider 
    const prev = document.querySelector('.offer__slider-prev'),
          slider = document.querySelector('.offer__slider'),
          next = document.querySelector('.offer__slider-next'),
          slides = document.querySelectorAll('.offer__slide'),
          total = document.querySelector('#total'),
          current = document.querySelector('#current'),
          slidesWrapper = document.querySelector('.offer__slider-wrapper'),
          slidesField = document.querySelector('.offer__slider-inner'),
          width = window.getComputedStyle(slidesWrapper).width;
    let slideIndex = 1;
    let offset = 0;

    if(slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent = `0${slideIndex}`;
    } else  {
        total.textContent = `${slides.length}`;
        current.textContent = slideIndex;
    }

    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slidesWrapper.style.overflow = 'hidden';


    slides.forEach(slide => {
        slide.style.width = width;
    });


    slider.style.position = 'relative';


    const indicators = document.createElement('ol'),
            dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
    `;

    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
        box-sizing: content-box;
    flex: 0 1 auto;
    width: 30px;
    height: 6px;
    margin-right: 3px;
    margin-left: 3px;
    cursor: pointer;
    background-color: #fff;
    background-clip: padding-box;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    opacity: .5;
    transition: opacity .6s ease;
    `;

    if (i == 0) {
        dot.style.opacity = 1;
    }
    indicators.append(dot);
    dots.push(dot);
    }

    function slideIndexChange() {
        if(slideIndex < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    }


    function dotsOpacityChange() {
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex - 1].style.opacity = 1;
    }

    next.addEventListener('click', () => {
        if (offset === +width.slice(0, width.length - 2) * (slides.length - 1)) {
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        slideIndexChange();

        dotsOpacityChange();
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (slides.length - 1);
        } else {
            offset -= +width.slice(0, width.length - 2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        slideIndexChange();
        dotsOpacityChange();
    });




    dotsOpacityChange();


        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideTo = e.target.getAttribute('data-slide-to');

                slideIndex = slideTo;
                offset = +width.slice(0, width.length - 2) * (slideTo - 1);


                slidesField.style.transform = `translateX(-${offset}px)`;


                slideIndexChange();

                dotsOpacityChange();
            });
        });


        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideTo = e.target.getAttribute('data-slide-to');
    
                slideIndex = slideTo;
                offset = +width.slice(0, width.length - 2) * (slideTo - 1);
    
                slidesField.style.transform = `translateX(-${offset}px)`;
    
                slideIndexChange();
    
                dotsOpacityChange();
            });
        });


















    
});