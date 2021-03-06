const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
  let input;
  let results;

  /**
   * Clear workspace
   * @param {} element
   */
  function clear(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  /**
   * Element constructor
   * @param {} name of element
   * @param  {...any} children of element
   */
  function el(name, ...children) {
    const element = document.createElement(name);

    for (let child of children) { /* eslint-disable-line */
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child) {
        element.appendChild(child);
      }
    }

    return element;
  }

  /**
   * Display message to user
   * @param {} text
   */
  function output(text) {
    clear(results);
    results.appendChild(el('span', text));
  }

  /**
   * Creates elements for fetch results if they exist
   * Displays created elements
   */
  function display(item) {
    clear(results);

    if (item.length === 0) {
      output('Ekkert fyrirtæki fannst fyrir leitarstreng');
    }

    for (let i in item) { /* eslint-disable-line */
      const component = el('dl',
        el('dt', 'Nafn'),
        el('dd', item[i].name),
        el('dt', 'Kennitala'),
        el('dd', item[i].sn),
        item[i].active ? el('dt', 'Heimilsfang') : null,
        item[i].active ? el('dd', item[i].address) : null);

      const result = el('div', component);
      if (item[i].active === 1) result.className = 'company company--active';
      else result.className = 'company company--inactive';

      results.appendChild(result);
    }
  }

  /**
   * Fetch JSON
   * @param {*} company name
   */
  function request(company) {
    clear(results);

    const img = document.createElement('img');
    img.setAttribute('src', 'loading.gif');

    const loading = el('div', img, 'Leita að fyrirtækjum...');
    loading.classList.add('loading');
    results.appendChild(loading);

    fetch(`${API_URL}${company}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Síðan er ekki aðgengileg þessa stundina');
        }
        clear(results);
        return response.json();
      })
      .then((data) => display(data.results))
      .catch((error) => {
        console.error('Villa við að sækja gögn', error);
        output('Villa við að sækja gögn');
      });
  }

  /**
   * Handle form submit
   * @param {*} e
   */
  function submit(e) {
    e.preventDefault();

    const company = input.value;

    if (typeof company !== 'string' || company === '') {
      output('Fyrirtæki verður að vera strengur');
    } else {
      request(company);
    }
  }

  /**
   * Define form and create listener
   */
  function init() {
    const form = document.querySelector('form');

    input = form.querySelector('input');
    results = document.querySelector('.results');

    form.addEventListener('submit', submit);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  const companies = document.querySelector('.companies');
  program.init(companies);
});
