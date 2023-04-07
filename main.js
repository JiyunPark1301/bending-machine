// ! 개선해야 될 점
// ? this.cart와 this.myCokes는 id와 cnt로만 제어한다. this.cokes에 존재하는 데이터 중복이 안되도록 만들어줘야 됨
// ? 획득 부분 cnt의 개수만 변할 시 전체 렌더링이 아닌 갯수 부분만 변경되도록 만들어 깜빡이는 현상 없애기
// 획득한 음료 부분 똑같은 음료 추가 시 리스트가 새로 추가 되는 것이 아니라 갯수만 증가하도록 만들어주기(O)
// 버튼 흰 부분이 아닌 이미지, 이름, 가격을 선택했을 때도 클릭이벤트가 발생하도록 만들기 (O)
// ? markSellingCoke() 함수 더 개선 할 수 있는 방법은?
// ? id 찾는 findIndex 부분의 반복을 더 줄일 수는 없는지
// ? 잔액, 소지금 그려주는 부분 함수로 만들어주기(반복 줄이기)

// ! 아직 구현 하지 부분
// 거스름돈 반환 -> 소지금에 거스름돈 추가 (O)
// 획득 클릭 시 획득한 음료부분에 리스트 생성 (O)
// 획득 부분 리스트는 없애기 (O)
// 총 금액 업데이트 하기 (O)

// ! 더 추가해 볼 만한 사항
// ? 획득 부분 콜라 클릭시 콜라 개수가 다시 줄어들도록 만들기
// ? localStorage를 이용하여 새로고침 되어도 데이터 남아 있도록 만들기

const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(item) {
    localStorage.setItem('cart', JSON.stringify(item));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem('cart'));
  },
};

function App() {
  this.cokes = [
    {
      id: 1,
      img: 'img/콜라.png',
      name: 'Original_Cola',
      price: 1200,
      stock: 10,
    },
    {
      id: 2,
      img: 'img/보라콜라.png',
      name: 'Violet_Cola',
      price: 1000,
      stock: 0,
    },
    {
      id: 3,
      img: 'img/노란콜라.png',
      name: 'Yellow_Cola',
      price: 2000,
      stock: 1,
    },
    {
      id: 4,
      img: 'img/파란콜라.png',
      name: 'Cool_Cola',
      price: 2500,
      stock: 10,
    },
    {
      id: 5,
      img: 'img/초록콜라.png',
      name: 'Green_Cola',
      price: 1000,
      stock: 4,
    },
    {
      id: 6,
      img: 'img/주황콜라.png',
      name: 'Orange_Cola',
      price: 1000,
      stock: 2,
    },
  ];

  this.cart = [];
  this.myCokes = [];

  this.selected = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
  };

  this.deposit = 0; // 입금액
  this.myMoney = 50000; // 소지금
  this.balance = 0; // 잔액

  const renderAllCokes = () => {
    const template = this.cokes
      .map((coke) => {
        const { id, img, name, price, stock } = coke;
        return `
      <li class="item-col">
        <button data-id="${id}" class="item ${stock === 0 ? 'soldout' : ''} " ${
          stock === 0 ? 'disabled' : ''
        }>
          <img src="${img}" alt="" />
          <span>${name}</span>
          <strong>${price}원</strong>
        </button>
      </li>
      `;
      })
      .join('');

    $('.item-row').innerHTML = template;
  };

  this.init = () => {
    $('.myMoney').innerText = `${this.myMoney.toLocaleString()} 원`;
    renderAllCokes();
  };

  const renderCart = () => {
    const template = this.cart
      .map((coke) => {
        const { id, img, name, cnt } = coke;
        return `
      <li data-id="${id}" class="coke-item">
        <img src="${img}" alt="" />
        <p>${name}</p>
        <strong>${cnt}</strong>
      </li> 
      `;
      })
      .join('');

    $('.coke-items-left').innerHTML = template;
  };

  const calculateTotalPrice = () => {
    return this.myCokes.reduce((acc, v) => acc + v.price * v.cnt, 0);
  };

  const renderTotalPrice = (totalPrice) => {
    $('.total-price').innerText = `총금액: ${totalPrice.toLocaleString()}원`;
  };

  // 잔액 렌더링
  const renderBalance = () => {
    $('.balance').innerText = `${this.balance.toLocaleString()}원`;
  };

  // 소지금 렌더링
  const renderMyMoney = () => {
    $('.myMoney').innerText = `${this.myMoney.toLocaleString()} 원`;
  };

  const renderMyCokes = () => {
    const template = this.myCokes
      .map((coke) => {
        const { img, name, cnt } = coke;
        return `
      <li class="coke-item">
        <img src="${img}" alt="" />
        <p>${name}</p>
        <strong>${cnt}</strong>
      </li> 
      `;
      })
      .join('');

    $('.coke-items-right').innerHTML = template;

    const totalPrice = calculateTotalPrice();
    renderTotalPrice(totalPrice);
  };

  const addToCart = (selectedCoke) => {
    const { id, img, name, price } = selectedCoke;
    const cartItemIndex = this.cart.findIndex((item) => item.id === +id);
    if (cartItemIndex === -1) this.cart.push({ id, img, name, price, cnt: 1 });
    else this.cart[cartItemIndex].cnt += 1;
    renderCart();
  };

  const minusOneStock = (e, cokeId) => {
    const cokeItemIndex = this.cokes.findIndex((item) => item.id === cokeId);
    if (this.cokes[cokeItemIndex].stock === 1) {
      this.cokes[cokeItemIndex].stock = 0;
      const $item = e.target.closest('.item');
      $item.classList.add('soldout');
      $item.disabled = true;
    } else {
      this.cokes[cokeItemIndex].stock--;
    }
  };

  const markSellingCoke = () => {
    this.cokes.forEach((coke) => {
      if (coke.price <= this.balance && coke.stock > 0) {
        this.selected[coke.id] = true;
      } else {
        this.selected[coke.id] = false;
      }
    });
    $('.item-row')
      .querySelectorAll('.item')
      .forEach(($coke) => {
        const cokeId = $coke.dataset.id;
        if (this.selected[cokeId]) $coke.classList.add('selected');
        else $coke.classList.remove('selected');
      });
  };

  const putMoney = () => {
    if ($('.deposit-input').value === '') return alert('숫자를 입력해주세요');
    this.deposit = parseInt($('.deposit-input').value);
    $('.deposit-input').value = '';

    if (this.deposit > this.myMoney) return alert('소지금이 부족합니다.');
    this.myMoney -= this.deposit;
    this.balance += this.deposit;

    renderBalance();
    renderMyMoney();

    markSellingCoke();
    // renderAllCokes();
  };

  // 새로고침 막아주기
  $('.charge-form').addEventListener('submit', (e) => {
    e.preventDefault();
  });

  // 엔터키 누를 시 입금
  $('.deposit-input').addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') return;
    putMoney();
  });

  // 입금버튼 클릭시 입금
  $('.deposit-btn').addEventListener('click', putMoney);

  // 콜라 버큰 클릭시 획득 리스트에 추가
  $('.item-row').addEventListener('click', (e) => {
    const $cokeBtn = e.target.closest('.item');
    if ($cokeBtn === null) return;
    if (!$cokeBtn.classList.contains('selected'))
      return alert('잔액이 부족합니다.');

    const cokeId = parseInt($cokeBtn.dataset.id);
    const selectedCoke = this.cokes.find((coke) => coke.id === cokeId);
    this.balance -= selectedCoke.price;
    renderBalance();
    minusOneStock(e, cokeId);
    addToCart(selectedCoke);
    markSellingCoke();
  });

  // 거스름돈 반환
  $('.change-return-btn').addEventListener('click', () => {
    if (this.balance === 0) return alert('반환할 거스름돈이 없습니다.');
    this.myMoney += this.balance;
    this.balance = 0;
    renderBalance();
    renderMyMoney();
    markSellingCoke();
  });

  // 콜라 획득
  $('.get-btn').addEventListener('click', () => {
    if (this.cart.length === 0)
      return alert('획득할 음료가 존재하지 않습니다.');
    $('.coke-items-left')
      .querySelectorAll('.coke-item')
      .forEach(($coke) => {
        const cokeId = parseInt($coke.dataset.id);
        const cokeIndex = this.myCokes.findIndex((item) => item.id === cokeId);
        const cokeItem = this.cart.find((item) => item.id === cokeId);
        const { id, img, name, price } = cokeItem;
        if (cokeIndex === -1)
          this.myCokes.push({ id, img, name, price, cnt: cokeItem.cnt });
        else this.myCokes[cokeIndex].cnt += cokeItem.cnt;
      });
    renderMyCokes();
    this.cart = [];
    $('.coke-items-left').innerHTML = '';
  });
}

const app = new App();
app.init();
