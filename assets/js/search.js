document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        // Get all content sections
        const content = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
        const results = [];

        content.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                const result = {
                    title: element.textContent,
                    element: element
                };
                results.push(result);
            }
        });

        // Display results
        if (results.length > 0) {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result">
                    <a href="#${result.element.id}">${result.title}</a>
                </div>
            `).join('');
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="search-result">No results found</div>';
            searchResults.style.display = 'block';
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = 'none';
        }
    });
});
