let currentPage = 1;
let booksPerPage = 6; // Default to 6 books per page
let totalPages = 1;
let books = [];



// Function to adjust the booksPerPage based on the screen width
function updateBooksPerPage() {
  if (window.innerWidth <= 390) {
    // Phone width
    booksPerPage = 3; // 3 books per page for phones
  } else {
    booksPerPage = 6; // Default to 6 books per page
  }

  if (books.length > 0) {
    // Recalculate total pages and display results if books have been loaded
    totalPages = Math.ceil(books.length / booksPerPage);
    displayResults(books); // Re-display the books with the new layout
  }
}

// Event listener to update books per page on window resize
window.addEventListener("resize", updateBooksPerPage);

document.getElementById("searchInput").placeholder =
  "Enter a book title or author";

document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const query = document.getElementById("searchInput").value;
    currentPage = 1;
    searchBooks(query);
  });

document.getElementById("prevPage").addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    displayResults(books); // Display previous set of books
  }
});

document.getElementById("nextPage").addEventListener("click", function () {
  if (currentPage < totalPages) {
    currentPage++;
    displayResults(books); // Display next set of books
  }
});

document.getElementById("loadingSpinner").style.display = "none";

function searchBooks(query) {
  const loadingSpinner = document.getElementById("loadingSpinner");
  const resultsDiv = document.getElementById("searchResults");

  loadingSpinner.style.display = "flex"; // Show loading spinner
  resultsDiv.style.opacity = "0.5"; // Dim the search results area

  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
    query
  )}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      loadingSpinner.style.display = "none"; // Hide loading spinner
      resultsDiv.style.opacity = "1"; // Restore the opacity of the search results
      books = data.docs; // Store all books
      totalPages = Math.ceil(books.length / booksPerPage);
      displayResults(books); // Display the first set of books
    })
    .catch((error) => {
      loadingSpinner.style.display = "none"; // Hide loading spinner on error
      resultsDiv.style.opacity = "1"; // Restore the opacity of the search results
      console.error("Error fetching data:", error);
    });
}

function displayResults(books) {
  const resultsDiv = document.getElementById("searchResults");
  const pagerDiv = document.getElementById("pager");
  const taglineDiv = document.querySelector(".tagline"); // Select the tagline element
  resultsDiv.innerHTML = "";

  // Hide the tagline after a search
  if (taglineDiv) {
    taglineDiv.style.display = "none";
  }

  if (books.length === 0) {
    resultsDiv.innerHTML = '<p id="noBook">No books found.</p>';
    pagerDiv.style.display = "none"; // Hide pager if no books
    return;
  }

  pagerDiv.style.display = "block"; // Show pager when there are books

  const start = (currentPage - 1) * booksPerPage;
  const end = start + booksPerPage;
  const booksToDisplay = books.slice(start, end);

  booksToDisplay.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book", "d-flex");

    const coverImg = document.createElement("img");
    if (book.cover_i) {
      coverImg.src = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    } else {
      coverImg.src = "https://via.placeholder.com/100x150?text=No+Cover";
    }

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("book-info");

    const title = document.createElement("div");
    title.classList.add("book-title");
    title.textContent = book.title;

    const author = document.createElement("div");
    author.classList.add("book-author");
    author.textContent = book.author_name
      ? `Author: ${book.author_name.join(", ")}`
      : "Author: Unknown";

    const year = document.createElement("div");
    year.classList.add("book-year");
    year.textContent = book.first_publish_year
      ? `First Published: ${book.first_publish_year}`
      : "First Published: Unknown";

    infoDiv.appendChild(title);
    infoDiv.appendChild(author);
    infoDiv.appendChild(year);

    bookDiv.appendChild(coverImg);
    bookDiv.appendChild(infoDiv);

    resultsDiv.appendChild(bookDiv);
  });

  updatePager();
}

function updatePager() {
  const prevPageButton = document.getElementById("prevPage");
  const nextPageButton = document.getElementById("nextPage");

  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;
}
