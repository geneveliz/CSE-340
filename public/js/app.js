document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('nav a[data-category]');
  const homeContent = document.getElementById('home-content');
  const vehicleContent = document.getElementById('vehicle-content');
  const vehicleList = document.getElementById('vehicle-list');
  const categoryTitle = document.getElementById('category-title');

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const category = link.dataset.category;

      if (category === 'all') {
        homeContent.style.display = 'block';
        vehicleContent.style.display = 'none';
        return;
      }

      const filtered = vehicles.filter(v => v.category === category);
      categoryTitle.textContent =
        category.charAt(0).toUpperCase() + category.slice(1) + ' vehicles';

      vehicleList.innerHTML = filtered.map(v => `
        <div class="vehicle-card">
          <img src="${v.img}" alt="${v.name}">
          <h3>${v.name}</h3>
          <p>$${v.price.toLocaleString()}</p>
        </div>
      `).join('');

      homeContent.style.display = 'none';
      vehicleContent.style.display = 'block';
    });
  });
});
