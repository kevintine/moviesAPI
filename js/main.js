page_number = 1
per_page = 10
function loadMoveData(title = null){
    url = "http://localhost:3000/movies?page=" + page_number + "&perPage=" + per_page
    if (title != null){
        url = url + "&title=" + title
    }
    // remove existing movies from table
    document.getElementById("tableBody").innerHTML = ""
    //make a "fetch" request to api using url
    fetch(url)
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        //loop through data and add each movie to the page
        for (i = 0; i < data.length; i++){
            console.log(data[i]);
            // append movie to moviesTable id along with an id for each movie
            document.getElementById("tableBody").innerHTML += `
            <tr id=${data[i]._id}>
                <td>${data[i].title}</td>
                <td>${data[i].year}</td>
                <td>${data[i].plot}</td>
                <td>${data[i].rated}</td>
                <td>${data[i].runtime}</td>
            </tr>
            `
        }
    })
    .catch(err => {
        console.log(err);
    }
    );
}
loadMoveData()
// click event for each new row
document.querySelectorAll('#tableBody').forEach((row) => {
    row.addEventListener('click', (e) => {
        // get the id of the row that was clicked
        movieId = e.target.parentNode.id
        // make a fetch request to the api to get the movie details
        fetch("http://localhost:3000/movies/" + movieId)
            .then((res) => res.json())
            .then((data) => {
            console.log(data);
            // populate the modal with the movie details
            document.querySelector('.modal-title').innerHTML = data.title
            document.querySelector('.modal-body').innerHTML = `
            <img class="img-fluid w-100" src=${data.poster ? data.poster : "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png"} alt="movie poster"><br><br>
            <strong>Directed By:</strong> ${data.directors.join(', ')}<br><br>
            <p>${data.plot ? data.plot : 'N/A'}</p>
            <strong>Cast:</strong> ${data.cast ? data.cast.join(', ') : 'N/A'}<br><br>
            <strong>Awards:</strong> ${data.awards.text}<br>
            <strong>IMDB Rating:</strong> ${data.imdb.rating}
            (${data.imdb.votes} votes)`
            // show the modal
            let movieModal = new bootstrap.Modal(document.querySelector('#detailsModal'), {
                backdrop: 'static',
                keyboard: false
            });
            movieModal.show();
        });
    });
});
document.getElementById("nextPage").addEventListener('click', (event) => {
    // prevent the form from from 'officially' submitting
    event.preventDefault();
    // populate the posts table with the userId value
    page_number += 1
    document.getElementById("currentPage").innerHTML = page_number
    loadMoveData(document.querySelector('#content').value);
});
document.getElementById("previousPage").addEventListener('click', (event) => {
    if (page_number == 1){
        return
    }
    // prevent the form from from 'officially' submitting
    event.preventDefault();
    // populate the posts table with the userId value
    page_number -= 1
    document.getElementById("currentPage").innerHTML = page_number
    loadMoveData(document.querySelector('#content').value);
});
document.getElementById("currentPage").innerHTML = page_number
document.querySelector('#searchBar').addEventListener('submit', (event) => {
    // prevent the form from from 'officially' submitting
    event.preventDefault();
    // populate the posts table with the userId value
    page_number = 1
    document.getElementById("currentPage").innerHTML = page_number
    loadMoveData(document.querySelector('#content').value);
});
