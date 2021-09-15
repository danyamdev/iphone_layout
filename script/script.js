document.addEventListener('DOMContentLoaded', () => {

  const getData = async (url) => {
    const req = await fetch(url);

    if (!req.ok) {
      throw new Error('Ошибка..')
    }

    return await req.json();
  };


  const tabs = () => {
    const btns = document.querySelectorAll('.card-detail__change'),
          title = document.querySelector('.card-details__title'),
          img = document.querySelector('.card__image_item'),
          memory = document.querySelector('.description__memory'),
          price = document.querySelector('.card-details__price');
    
    const data = [
      {
        name: 'Смартфон Apple iPhone 12 Pro 128GB Graphite',
        img: 'img/iPhone-graphite.png',
        price: 95990,
        memory: 128,
        count: 2,
      },
      {
        name: 'Смартфон Apple iPhone 12 Pro 256GB Silver',
        img: 'img/iPhone-silver.png',
        price: 105990,
        memory: 256,
        count: 0
      },
      {
        name: 'Смартфон Apple iPhone 12 Pro 128GB Pacific Blue',
        img: 'img/iPhone-blue.png',
        price: 99990,
        memory: 128,
        count: 1
      }
    ];

    const deactive = () => btns.forEach(btn => btn.classList.remove('active'));

    btns.forEach((btn, i) => {
        btn.addEventListener('click', () => {
          if (!btn.classList.contains('active')) {
            deactive();
            btn.classList.add('active');
            title.textContent = data[i].name;
            img.src = data[i].img;
            img.alt = data[i].name;
            memory.textContent = `Встроенная память (ROM) ${data[i].memory} ГБ`
            price.textContent = data[i].price + '₽';
          }
        });
    });
  };

  const accordion = () => {
    const characteristicsList = document.querySelector('.characteristics__list'),
          characteristicsItem = document.querySelectorAll('.characteristics__item');
    
    const open = (button, dropDown) => {
      closeAll();
      dropDown.style.height = `${dropDown.scrollHeight}px`;
      button.classList.add('active');
      dropDown.classList.add('active');
    };

    const close = (button, dropDown) => {
      button.classList.remove('active');
      dropDown.classList.remove('active');
      dropDown.style.height = '';
    };

    const closeAll = (button, dropDown) => {
      characteristicsItem.forEach(item => {
        if (item.children[0] !== button && item.children[1] !== dropDown) {
          close(item.children[0], item.children[1]);
        }
      });
    };


    characteristicsList.addEventListener('click', (e) => {
      const target = e.target;
      console.log(target);

      if (target && target.classList.contains('characteristics__title')) {
        const parent = target.closest('.characteristics__item');
        const description = parent.querySelector('.characteristics__description');

        description.classList.contains('active') ? close(target, description) : open(target, description);
      }
    });
  };

  const modal = () => {
    const cardDetailsButtonBuy = document.querySelector('.card-details__button_buy'),
          cardDetailsButtonDelivery = document.querySelector('.card-details__button_delivery'),
          cardDetailsTitle = document.querySelector('.card-details__title'),
          modal = document.querySelector('.modal');
          modalTitle = document.querySelector('.modal__title'),
          modalSubtitle = document.querySelector('.modal__subtitle');

    const modalOpen = (elem, popup, title, subtitle, active) => {
      elem.addEventListener('click', () => {
        popup.classList.add(active);
        title.textContent = cardDetailsTitle.textContent;
        subtitle.textContent = elem.textContent;
        document.addEventListener('keydown', escapeCLose);
      });
    };

    const modalClose = () => {
      modal.classList.remove('open');
      document.removeEventListener('keydown', escapeCLose);
    };

    const escapeCLose = event => {
      if (event.code === 'Escape') 
        modalClose();
    }

    modal.addEventListener('click', (e) => {
      const target = e.target;

      if (target === modal || target.classList.contains('modal__close')) 
        modalClose(modal, 'open');
    });

    modalOpen(cardDetailsButtonBuy, modal, modalTitle, modalSubtitle, 'open');
    modalOpen(cardDetailsButtonDelivery, modal, modalTitle, modalSubtitle, 'open');
  };

  const renderCrossSell = () => {
    const crossSellList = document.querySelector('.cross-sell__list'),
          cardItemsAdd = document.querySelector('.card-items-add');

    const allGoods = [];

    const shuffle = arr => arr.sort(() => Math.random() - 0.5);

    const render = arr => arr.forEach(item => crossSellList.append(createCrossSellItem(item)));

    const createCrossSellItem = (good) => {
      const liItem = document.createElement('li');

      liItem.innerHTML = `
        <article class="cross-sell__item">
          <img class="cross-sell__image" src="${good.photo}" alt="${good.name}">
          <h3 class="cross-sell__title">${good.name}</h3>
          <p class="cross-sell__price">${good.price}₽</p>
          <div class="button button_buy cross-sell__button">Купить</div>
        </article>
      `;

      return liItem;
    };

    const createCrossSellList = (goods) => {
      allGoods.push(...shuffle(goods));
      const fourItems = allGoods.splice(0, 4);
      render(fourItems)
    };

    getData('cross-sell-dbase/dbase.json')
      .then(response => createCrossSellList(response))
      .catch(error => console.log(error));

    cardItemsAdd.addEventListener('click', () => {
      render(allGoods);
      cardItemsAdd.remove();
    })
  };

  tabs();
  accordion();
  modal();
  renderCrossSell();
});