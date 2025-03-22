let editingIndex = null; // Variável para rastrear o índice do link em edição

// Função para carregar links do localStorage
function loadLinks() {
  const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  const categoryFilter = document.getElementById('categoryFilter').value;
  const links = JSON.parse(localStorage.getItem('links')) || [];
  let filteredLinks = links;

  // Filtrar por título
  if (searchQuery) {
    filteredLinks = filteredLinks.filter(link => link.title.toLowerCase().includes(searchQuery));
  }

  // Filtrar por categoria
  if (categoryFilter) {
    filteredLinks = filteredLinks.filter(link => link.category === categoryFilter);
  }

  const linksList = document.getElementById('linksList');
  linksList.innerHTML = '';

  if (filteredLinks.length === 0) {
    linksList.innerHTML = '<p class="text-center text-gray-500">Nenhum link encontrado.</p>';
    return;
  }

  filteredLinks.forEach((link, index) => {
    const linkCard = document.createElement('div');
    linkCard.className = 'bg-gray-50 p-4 rounded-lg shadow-sm flex flex-col space-y-2';
    linkCard.innerHTML = `
      <h2 class="text-lg font-semibold">${link.title}</h2>
      <a href="${link.url}" target="_blank" class="text-indigo-600 hover:underline">${link.url}</a>
      <p class="text-gray-600">${link.description}</p>
      <p class="text-sm text-gray-500">Categoria: ${link.category || 'Sem categoria'}</p>
      <div class="flex space-x-2">
        <button onclick="editLink(${index})" class="text-indigo-600 hover:text-indigo-800">Editar</button>
        <button onclick="deleteLink(${index})" class="text-red-600 hover:text-red-800">Remover</button>
      </div>
    `;
    linksList.appendChild(linkCard);
  });
}

// Função para salvar links no localStorage
function saveLinks(links) {
  localStorage.setItem('links', JSON.stringify(links));
  loadLinks();
}

// Função para adicionar/editar um link
document.getElementById('linkForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const url = document.getElementById('url').value.trim();
  const category = document.getElementById('category').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!title || !url) {
    alert('Por favor, preencha o título e o link.');
    return;
  }

  const links = JSON.parse(localStorage.getItem('links')) || [];

  if (editingIndex !== null) {
    // Modo de edição: Atualiza o link existente
    links[editingIndex] = { title, url, category, description };
    editingIndex = null; // Reseta o índice de edição
  } else {
    // Modo de criação: Adiciona um novo link
    links.push({ title, url, category, description });
  }

  saveLinks(links);

  // Limpar o formulário
  document.getElementById('linkForm').reset();
  document.querySelector('#linkForm button[type="submit"]').textContent = 'Salvar Link';
});

// Função para deletar um link
function deleteLink(index) {
  const links = JSON.parse(localStorage.getItem('links')) || [];
  links.splice(index, 1);
  saveLinks(links);
}

// Função para editar um link
function editLink(index) {
  const links = JSON.parse(localStorage.getItem('links')) || [];
  const link = links[index];
  document.getElementById('title').value = link.title;
  document.getElementById('url').value = link.url;
  document.getElementById('category').value = link.category || '';
  document.getElementById('description').value = link.description;
  editingIndex = index; // Define o índice do link em edição
  document.querySelector('#linkForm button[type="submit"]').textContent = 'Atualizar Link';
}

// Adicionar evento de busca em tempo real
document.getElementById('searchInput').addEventListener('input', loadLinks);

// Adicionar evento de filtro de categoria
document.getElementById('categoryFilter').addEventListener('change', loadLinks);

// Carregar links ao iniciar a página
window.addEventListener('load', loadLinks);

// Alternar Modo Escuro
const toggleDarkModeButton = document.getElementById('toggleDarkMode');
toggleDarkModeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});