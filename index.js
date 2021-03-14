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
    console.log('in comparison')
    //select all the elements containing the stats of the movie
    //all elements with id of left/right-summary with corresponding element of notification class
    const leftSideStat = document.querySelector('#left-summary').querySelectorAll('.notification');
    const rightSideStat = document.querySelector('#right-summary').querySelectorAll('.notification');
    leftSideStat.forEach((leftStat, index) => {  //index is being used to access the corresponsing stat at the right side
        const rightStat = rightSideStat[index];

        //dataset object is used to get a data attribute
        const leftSideValue = leftStat.dataset.value;
        const rightSideValue = rightStat.dataset.value;
    });
}

//HTML template for showing detailed info for any movie
const movieTemplate = (movieDetails) => {
    //extracting numbers from different properties of the movie using RegEx to compare easily
    const dollars = parseInt(movieDetails.BoxOffice.replace(/\$/g, '').replace(/,/g, '')); //first replaces the $ sign and then all the commas
    const metascore = parseInt(movieDetails.Metascore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, '')); //replaces all the commas

    /*calculating the total number of awards that a movie won
    winner is the one who has a greater value for total awards
    For Example, The Avengers => Nominated for 1 Oscar. Another 38 wins & 79 nominations. sum of awards=118 */
    const awards = movieDetails.Awards.split(' ').reduce((previous, word) => {
        const value = parseInt(word);
        if(isNaN(value)) {
            return previous;
        } else {
            return previous + value;
        }
    }, 0); //initial value is 0 as a second param in reduce()
    //using forEach()
    // let counter = 0;
    // const awards = movieDetails.Awards.split(' ').forEach(word => {
    //     const value = parseInt(word);
    //     if(isNaN(value)) {
    //         return;
    //     } else {
    //         counter = counter+ value;
    //     }
    // });


    /*The data-* attribute is used to store custom data private to the page or application.
    The data-* attribute gives us the ability to embed custom data attributes on all HTML elements.
    Here is this HTML snippet, data-value attribute keeps a relevant data about its own article */
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
    <article data-value="${awards}" class="notification is-primary">
        <p class="title">${movieDetails.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value="${dollars}" class="notification is-primary">
        <p class="title">${movieDetails.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article data-value="${metascore}" class="notification is-primary">
        <p class="title">${movieDetails.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article data-value="${imdbRating}" class="notification is-primary">
        <p class="title">${movieDetails.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value="${imdbVotes}" class="notification is-primary">
        <p class="title">${movieDetails.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `;
};