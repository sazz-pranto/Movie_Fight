const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster; //checking if any movie poster is available or not
        return `
            <img src="${imgSrc}" />
            <span>${movie.Title}</span>
            <span>&nbsp(${movie.Year})</span>
        `;
    },
    onOptionSelect(movie) {
        onMovieSelect(movie);
    },
    inputValue(movie) {
        return movie.Title;
    },

    // fetch movie data from the OMDB API 
    async fetchData(searchTerm) {
        const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "529ca8bc",
            s: searchTerm
        }
        });
        if(response.data.Error) {
            return [];
        }
        return response.data.Search;
    }
};

//create autocomplete widgets with a configuration object passed as an argument
createAutoComplete({
    ...autoCompleteConfig,
    rootElement: document.querySelector('#left-autocomplete')
});
createAutoComplete({
    ...autoCompleteConfig,
    rootElement: document.querySelector('#right-autocomplete')
});
// send a followup request to the API and get details for the corresponding movie 
const onMovieSelect = async movie => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "529ca8bc",
            i: movie.imdbID
        }
    });
    document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

//HTML template for showing detailed info for any movie
const movieTemplate = (movieDetails) => {
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetails.Poster}" />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetails.Title}</h1>
                <h4>${movieDetails.Genre}</h4>
                <p>${movieDetails.Plot}</p>
            </div>
        </div>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetails.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetails.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetails.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetails.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetails.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `;
};