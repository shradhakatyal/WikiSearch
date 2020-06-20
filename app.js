const searchInputBox = document.querySelector('.search-input-box');
const searchButton = document.querySelector('.search-button');
const error = document.querySelector('.search-error');
const resultListing = document.querySelector('.result-listing');

searchInputBox.onkeydown = function(event) {
  if(event.keyCode === 13) {
    searchHandler();
  }
}

searchButton.onclick = searchHandler;

function searchHandler(event) {
  console.log(searchInputBox.value);
  resultListing.innerHTML = '';
  const searchTerm = searchInputBox.value;
  if(!searchTerm) {
    error.textContent = 'Please enter a search term';
    setTimeout(function() {
      error.textContent = '';
    }, 3000);
  } else {
    callSearch(searchTerm);
  }
}

function callSearch(searchTerm) {
  let url = "https://en.wikipedia.org/w/api.php"; 

  const params = {
      action: "query",
      list: "search",
      srsearch: searchTerm,
      format: "json"
  };

  url = url + "?origin=*";
  Object.keys(params).forEach(function(key){url += "&" + key + "=" + params[key];});
  searchButton.textContent = 'Loading..';
  fetch(url)
    .then(function(response){return response.json();})
    .then(function(response) {
        console.log(response);
        searchButton.textContent = 'Search';
        if(response.query && response.query.search && response.query.search.length) {
          const data = response.query.search;
          let htmlString = '';
          data.forEach((result) => {
            htmlString += `<div class="result-item" data-id=${result.pageid}><p class="title">${result.title}</p><p class="description">${result.snippet}</p></div>`;
          });
          resultListing.innerHTML = htmlString;
          initResultClickHandler();
        } else {
          // No results found.
          resultListing.innerHTML = '<p class="no-results">No results found! Please try another search query.</p>';
        }
    })
    .catch(function(error){
      console.log(error);
      searchButton.textContent = 'Search';
    });
}

function initResultClickHandler() {
  const items = document.querySelectorAll('.result-item');
  items.forEach((item) => {
    item.onclick = handleResultClick;
  });
  
}

function handleResultClick (event) {
  console.log(this);
  constructPageUrl(this.getAttribute('data-id'));
}

function constructPageUrl(pageId) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=${pageId}&inprop=url&origin=*&format=json`;
  fetch(url)
    .then(function(response){console.log(response.body);return response.json();})
    .then(function(response) {
        console.log(response);
        searchButton.textContent = 'Search';
        if(response.query && response.query.pages) {
          let data = response.query.pages;
          console.log(data);
          console.log(data[pageId]);
          const redirectUrl = data[pageId].fullurl;
          window.location.href = redirectUrl;
        } else {
          // No results found.
        }
    })
    .catch(function(error){
      console.log(error);
    });
}