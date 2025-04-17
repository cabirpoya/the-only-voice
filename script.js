let poems = JSON.parse(localStorage.getItem('poemDB')) || [];

function saveToStorage() {
  localStorage.setItem('poemDB', JSON.stringify(poems));
}

function renderPoems(filter = '') {
  const list = document.getElementById('poemList');
  list.innerHTML = '';
  poems
    .filter(p => p.title.toLowerCase().includes(filter.toLowerCase()) ||
                 p.author.toLowerCase().includes(filter.toLowerCase()) ||
                 p.content.toLowerCase().includes(filter.toLowerCase()))
    .forEach(poem => {
      const div = document.createElement('div');
      div.className = 'poem-card';
      div.innerHTML = `
        <h3>${poem.title}</h3>
        <small>By ${poem.author} | ${poem.category || '—'}</small>
        <pre>${poem.content}</pre>
        <div class="card-buttons">
          <button onclick="editPoem(${poem.id})">✏️ Edit</button>
          <button onclick="deletePoem(${poem.id})">🗑 Delete</button>
        </div>
      `;
      list.appendChild(div);
    });
}

function showForm() {
  document.getElementById('poemFormContainer').classList.remove('hidden');
}

function hideForm() {
  document.getElementById('poemForm').reset();
  document.getElementById('poemId').value = '';
  document.getElementById('poemFormContainer').classList.add('hidden');
}

function editPoem(id) {
  const poem = poems.find(p => p.id === id);
  document.getElementById('poemId').value = poem.id;
  document.getElementById('title').value = poem.title;
  document.getElementById('author').value = poem.author;
  document.getElementById('category').value = poem.category || '';
  document.getElementById('content').value = poem.content;
  showForm();
}

function deletePoem(id) {
  if (confirm('Are you sure you want to delete this poem?')) {
    poems = poems.filter(p => p.id !== id);
    saveToStorage();
    renderPoems(document.getElementById('searchInput').value);
  }
}

document.getElementById('poemForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const id = document.getElementById('poemId').value;
  const poem = {
    id: id ? parseInt(id) : Date.now(),
    title: document.getElementById('title').value,
    author: document.getElementById('author').value,
    category: document.getElementById('category').value,
    content: document.getElementById('content').value
  };

  if (id) {
    poems = poems.map(p => (p.id === poem.id ? poem : p));
  } else {
    poems.push(poem);
  }

  saveToStorage();
  renderPoems();
  hideForm();
});

document.getElementById('searchInput').addEventListener('input', (e) => {
  renderPoems(e.target.value);
});

function filterAlphabet(letter) {
  renderPoems(letter);
}

renderPoems();
