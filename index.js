// fetch movie data from the API 
const fetchData = async (searchTerm) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "529ca8bc",
            s: searchTerm
        }
    });
    return response.data.Search;
}
const inputElement = document.querySelector('input');
const onInput = async (event) => {
    const movies = await fetchData(event.target.value); //wait until fetchData can return the search results
    for(let movie of movies) {
        const div = document.createElement('div');
        div.innerHTML = `
            <img src="${movie.Poster}" />
            <h1>${movie.Title}</h1>
        `;
    }
}
inputElement.addEventListener('input', debounce(onInput));