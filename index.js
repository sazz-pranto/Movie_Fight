// fetch movie data from the API 
const fetchData = async (searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "529ca8bc",
            s: searchTerm
        }
    });
}

// debounce function to restrict the request to be sent after each event(input by user)
const debounce = (callback, delay = 1000) => {
    let timeoutId;
    return (...args) => {
        if(timeoutId) {
            clearTimeout(timeoutId); // clears the timout ID to cancel the callback execution if not delayed
        }
        timeoutId = setTimeout(() => {callback.apply(null, args)}, delay);
    }
    
}
const inputElement = document.querySelector('input');
const onInput = (event) => {
    fetchData(event.target.value);
}
inputElement.addEventListener('input', debounce(onInput));