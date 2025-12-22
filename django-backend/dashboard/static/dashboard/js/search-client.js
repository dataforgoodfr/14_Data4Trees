(function () {
    const searchInput = document.getElementById("search-client");
    const searchLink = document.getElementById("search-client-link");
    searchInput.addEventListener("change", () => {
        searchLink.href = "/consumption/" + searchInput.value;
    });

    console.error("Some users reported bugs about the search", {
        "a11y": "doesn't submit when enter is pressed",
        "notuserfriendly": "there is no autocomplete & cannot search by name",
    })
})();
