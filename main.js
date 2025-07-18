document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const suggestionsList = document.querySelector('.suggestions');
  const repositoriesList = document.querySelector('.repositories');

  let timeoutId;

  function debounce(fn, delay) {
    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fn.apply(this, arguments)
      }, delay);
    };
  }

  async function searchRepositories(q) {
    if (!q) {
      suggestionsList.style.display = 'none';
      suggestionsList.innerHTML = '';
      return;
    }

    try {
      const response = await fetch(`https://api.github.com/search/repositories?q=${q}&per_page=5`);
      const data = await response.json();
      showSuggestions(data.items);
    } catch (e) {
      console.error('Error fetch:', e);
    }
  }

  function showSuggestions(repositories) {
    suggestionsList.innerHTML = '';

    if (repositories && repositories.length > 0) {
      repositories.forEach(repo => {
        const li = document.createElement('li');
        li.textContent = repo.full_name;
        li.addEventListener('click', () => addRepository(repo));
        suggestionsList.appendChild(li);
      });
      suggestionsList.style.display = 'block';
    } else {
      suggestionsList.style.display = 'none';
    }
  }

  function addRepository(repo) {
    const li = document.createElement('li');

    li.innerHTML = `
  <div>
        <strong>${repo.name}</strong><br>
        <small>Owner: ${repo.owner.login}</small><br>
        <small>Stars: ${repo.stargazers_count}</small>
      </div>
      <button class="remove-btn"></button>
  `;

    li.querySelector('.remove-btn').addEventListener('click', () => {
      li.remove();
    })
    repositoriesList.appendChild(li);
    searchInput.value = '';
    suggestionsList.style.display = 'none';
  }

  searchInput.addEventListener('input', debounce((e) => {
    searchRepositories(e.target.value.trim());
  }, 400));

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.autocomplete')) {
      suggestionsList.style.display = 'none';
    }
  });
});