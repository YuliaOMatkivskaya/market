const itemBox = document.querySelectorAll('.item_box'); // блок каждого товара
const cartCont = document.querySelector('#cart_content'); // блок вывода данных корзины

// Функция кроссбраузерной установки обработчика событий
function addEvent(elem, type, handler) {
    if (elem.addEventListener) {
        elem.addEventListener(type, handler, false);
    } else {
        elem.attachEvent('on' + type, function () {
            handler.call(elem);
        });
    }
    return false;
}

// Получаем данные из LocalStorage
function getCartData() {
    return JSON.parse(localStorage.getItem('cart'));
}

// Записываем данные в LocalStorage
function setCartData(o) {
    localStorage.setItem('cart', JSON.stringify(o));
    return false;
}

// Добавляем товар в корзину
function addToCart(e) {
    this.disabled = true; // блокируем кнопку на время операции с корзиной
    const cartData = getCartData() || {}; // получаем данные корзины или создаём новый объект, если данных еще нет
    const parentBox = this.parentNode; // родительский элемент кнопки "Добавить в корзину"
    const itemId = this.getAttribute('data-id'); // ID товара
    const itemTitle = parentBox.querySelector('.item_title').innerHTML; // название товара
    const itemPrice = parentBox.querySelector('.item_price').innerHTML; // стоимость товара
    if (cartData.hasOwnProperty(itemId)) { // если такой товар уже в корзине, то добавляем +1 к его количеству
        cartData[itemId][2] += 1;
    } else { // если товара в корзине еще нет, то добавляем в объект
        cartData[itemId] = [itemTitle, itemPrice, 1];
    }
    if (!setCartData(cartData)) { // Обновляем данные в LocalStorage
        this.disabled = false; // разблокируем кнопку после обновления LS
    }
    return false;
}

// Устанавливаем обработчик события на каждую кнопку "Добавить в корзину"
for (let i = 0; i < itemBox.length; i++) {
    addEvent(itemBox[i].querySelector('.add_item'), 'click', addToCart);
}

// Открываем корзину со списком добавленных товаров
function openCart(e) {
    const cartData = getCartData(); // вытаскиваем все данные корзины
    let totalItems = '';
    // если что-то в корзине уже есть, начинаем формировать данные для вывода
    if (cartData !== null) {
        totalItems = '<table class="shopping_list"  align="center"><tr><th>Наименование</th><th>Цена за кг</th><th>Кол-во кг</th></tr>';
        for (let items in cartData) {
            totalItems += '<tr>';
            for (let i = 0; i < cartData[items].length; i++) {
                totalItems += '<td>' + cartData[items][i] + '</td>';
            }
            totalItems += '</tr>';
        }
        totalItems += '</table>';
        cartCont.innerHTML = totalItems;
    } else {
        // если в корзине пусто, то сигнализируем об этом
        cartCont.innerHTML = 'В корзине пусто!';
    }
    return false;
}
/* Открыть корзину */
addEvent(document.querySelector('#checkout'), 'click', openCart);
/* Очистить корзину */
addEvent(document.querySelector('#clear_cart'), 'click', function (e) {
    localStorage.removeItem('cart');
    cartCont.innerHTML = 'Корзина очищена.';
});

