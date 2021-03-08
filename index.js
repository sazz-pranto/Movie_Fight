// fetch movie data from the API 
const fetchData = async (searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "529ca8bc",
            s: searchTerm
        }
    });
}
const inputElement = document.querySelector('input');
const onInput = (event) => {
    fetchData(event.target.value);
}
inputElement.addEventListener('input', debounce(onInput));