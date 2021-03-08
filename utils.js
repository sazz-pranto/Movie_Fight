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