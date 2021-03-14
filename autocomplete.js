const createAutoComplete = ({
    renderOption, 
    onOptionSelect, 
    inputValue,
    fetchData,
    rootElement
}) => {
    //HTML for autocomplete dropdown
    rootElement.innerHTML = `
        <lable><b>Search</b></lable>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    const inputElement = rootElement.querySelector('.input');

    const dropdown = rootElement.querySelector('.dropdown');
    const resultsWrapper = rootElement.querySelector('.results');

    //fetching search results and renderning the results into the dropdown
    const onInput = async (event) => {
        const items = await fetchData(event.target.value); //wait until fetchData can return the search results
        if(!items.length) {
            dropdown.classList.remove('is-active');
            return;
        }
        resultsWrapper.innerHTML = ""; // clearing the previous results before searching for a new item
        dropdown.classList.add('is-active'); //is-active class to activate the dropdown

        //looping through the items
        for(let item of items) {
            // each item should be an anchor element 
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);
            //appending the result as a child element of results
            resultsWrapper.appendChild(option);
            
            //if there is a click on any result, remove the dropdown menu and update the input text with the corresponding item's title
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                inputElement.value = inputValue(item);
                onOptionSelect(item); //onOptionSelect takes the item and helps send a follow-up request with that item
            });
        }
    }
    inputElement.addEventListener('input', debounce(onInput)); //call debounce with a delay arg to set a delay, default 1000ms

    // check if user clicks anywhere but the autocomplete widget to close the results bar 
    document.addEventListener('click', event => {
        if(!rootElement.contains(event.target)) dropdown.classList.remove('is-active');
    });

}