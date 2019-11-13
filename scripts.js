const API_URL = 'https://apis.is/company?name=';

/**
 * Leit að fyrirtækjum á Íslandi gegnum apis.is
 */
const program = (() => {
    /**
     * Define form and create listener
     * @param {} companies 
     */
    function init(companies) {
        const form = document.querySelector('form');

        input = form.querySelector('input');
        results = document.querySelector('.results');

        form.addEventListener('submit', submit);
    }

    /**
     * Handle form submit
     * @param {*} e 
     */
    function submit(e) {
        e.preventDefault();

        const company = input.value;

        if (typeof company !== 'string' || company === '') {
            output("Fyrirtæki verður að vera strengur");
        } else {
            request(company);
        }
    }

    /**
     * Function to repeatedly clear workspace
     * @param {} element 
     */
    function clear(element) {
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
    }

    /**
     * Message output
     * @param {} msg 
     */
    function output(text) {
        clear(results);
        results.appendChild(el('p', text));
      }

    /**
     * Element constructor
     * @param {} name of element
     * @param  {...any} children of element
     */
    function el(name, ...children) {
        const element = document.createElement(name);

        for (let child of children) {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child) {
                element.appendChild(child);
            }
        }

        return element;
    }

    /**
     * Create loading element using constructor
     */
    function loading() {
        const img = document.createElement('img');
        img.setAttribute('src', 'loading.gif');

        const loading = el('div', img, "Leita að fyrirtækjum...");
        loading.classList.add("loading");

        return loading;
    }

    /**
     * Creates elements for fetch results if they exist
     * Displays created elements
     */
    function display(item) {
        clear(results);

        if (item.length === 0) {
            output("Ekkert fyrirtæki fannst fyrir leitarstreng")
        }

        for (i in item) {
            var name = item[i].name;
            var sn = item[i].sn;
            var active = item[i].active;
            var address = item[i].address;

            var component = el('dl',
                el('dt', 'Nafn'),
                el('dd', name),
                el('dt', 'Kennitala'),
                el('dd', sn),
                active ? el('dt', 'Heimilsfang') : null,
                active ? el('dd', address) : null,
            );

            var result = el('div', component);
            if (active === 1) result.className = "company company--active";
            else result.className = "company company--inactive";

            results.appendChild(result);
        }
    }

    /**
     * Fetch JSON
     * @param {*} company name
     */
    function request(company) {
        clear(results);
        results.appendChild(loading());

        fetch(`${API_URL}${company}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Síðan er ekki aðgengileg þessa stundina");
                }
                clear(results);
                return response.json()
            })
            .then(data => {
                display(data.results);
                console.log(data);
            })
            .catch(error => {
                console.error("Villa við að sækja gögn", error);
                output("Villa við að sækja gögn");
            })
    }

    return {
        init,
    };
})();

document.addEventListener('DOMContentLoaded', () => {
    const companies = document.querySelector('.companies');
    program.init(companies);
});