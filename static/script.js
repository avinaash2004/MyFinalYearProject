const apiKey = "3fd2be6f0c70a2a598f084ddfb75487c"; 
const searchApi = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;
const recommendApi = `https://api.themoviedb.org/3/movie/`;
const imgPath = "https://image.tmdb.org/t/p/w500";

const movieInput = document.getElementById("movie-input");
const searchBtn = document.getElementById("search-btn");
const moviesContainer = document.getElementById("movies-container");
const recommendationContainer = document.getElementById("recommendation-container");

searchBtn.addEventListener("click", () => movieInput.value.trim() && fetchMovies(movieInput.value.trim()));
movieInput.addEventListener("keypress", (e) => e.key === "Enter" && searchBtn.click());

async function fetchMovies(query) {
    try {
        const res = await fetch(searchApi + query);
        const { results } = await res.json();
        moviesContainer.innerHTML = results?.length 
            ? results.slice(0, 10).map(createMovieCard).join("") 
            : "<p>No movies found.</p>";
        addRecommendationListeners();
    } catch (err) {
        console.error("Error fetching movies:", err);
    }
}

async function fetchSimilarMovies(id) {
    try {
        const res = await fetch(`${recommendApi}${id}/recommendations?api_key=${apiKey}`);
        const { results } = await res.json();
        recommendationContainer.innerHTML = results?.length 
            ? results.slice(0, 10).map(createMovieCard).join("") 
            : "<p>No similar movies found.</p>";
    } catch (err) {
        console.error("Error fetching recommendations:", err);
    }
}

function createMovieCard({ id, title, poster_path, overview }) {
    if (!poster_path) return "";
    return `
        <div class="movie">
            <img src="${imgPath + poster_path}" alt="${title}">
            <div class="movie-info"><h3>${title}</h3></div>
            <div class="overview">
                <p>${overview || "No description available."}</p>
                ${id ? `<button class="recommend-btn" data-id="${id}">Recommend Similar Movies</button>` : ""}
            </div>
        </div>`;
}

function addRecommendationListeners() {
    document.querySelectorAll(".recommend-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            fetchSimilarMovies(btn.dataset.id);
            recommendationContainer.scrollIntoView({ behavior: "smooth" });
        });
    });
}
