const autoCompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster; //checking if any movie poster is available or not
        return `
            <img src="${imgSrc}" />
            <span>${movie.Title}</span>
            <span>&nbsp(${movie.Year})</span>
        `;
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

// create autocomplete widgets with a configuration object passed as an argument

// left widget
createAutoComplete({
    ...autoCompleteConfig, //extracting configurations using spread
    rootElement: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');  //hides the tutorial when an option is selected
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left'); //second param determines where the summary should be rendered to
    }
});

// right widget
createAutoComplete({
    ...autoCompleteConfig, //extracting configurations using spread
    rootElement: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden');  //hides the tutorial when an option is selected
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');  //second param determines where the summary should be rendered to
    },
});

let leftMovie, rightMovie; //stores detailed data for corresponding search result

// send a followup request to the API and get details for the corresponding movie 
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get("http://www.omdbapi.com/", {
        params: {
            apikey: "529ca8bc",
            i: movie.imdbID
        }
    });
    summaryElement.innerHTML = movieTemplate(response.data);
    if(side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }
    //running the comparison
    if(leftMovie && rightMovie) {
        runComparison();
    }
};

// method for showing comparison results
const runComparison = () => {
    console.log('Compared!');
}

//HTML template for showing detailed info for any movie
const movieTemplate = (movieDetails) => {
    //extracting numbers from different properties of the movie to compare easily
    const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetails.Metascore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));
    console.log(dollars, metascore, imdbRating, imdbVotes);
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