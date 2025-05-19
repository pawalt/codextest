const form = document.getElementById('recipe-form');
const recipesEl = document.getElementById('recipes');

function loadRecipes() {
  const data = localStorage.getItem('recipes');
  return data ? JSON.parse(data) : [];
}

function saveRecipes(list) {
  localStorage.setItem('recipes', JSON.stringify(list));
}

function render() {
  const recipes = loadRecipes();
  recipesEl.innerHTML = '';
  recipes.forEach((r, index) => {
    const div = document.createElement('div');
    div.className = 'recipe';
    div.innerHTML = `<h3>${r.name}</h3>
      <p><strong>Cook Time:</strong> ${r.cooktime} mins</p>
      <p><strong>Ingredients:</strong><br>${r.ingredients.replace(/\n/g,'<br>')}</p>
      <p><strong>Instructions:</strong><br>${r.instructions.replace(/\n/g,'<br>')}</p>`;
    recipesEl.appendChild(div);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const recipe = {
    name: form.name.value.trim(),
    ingredients: form.ingredients.value.trim(),
    instructions: form.instructions.value.trim(),
    cooktime: form.cooktime.value.trim(),
  };
  const recipes = loadRecipes();
  recipes.push(recipe);
  saveRecipes(recipes);
  form.reset();
  render();
});

// Speech recognition for dictation
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  document.querySelectorAll('.dictate').forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      const input = document.getElementById(targetId);
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.onresult = event => {
        const text = Array.from(event.results).map(r => r[0].transcript).join(' ');
        if (input.tagName === 'TEXTAREA') {
          input.value += (input.value ? '\n' : '') + text;
        } else {
          input.value = text;
        }
      };
      recognition.start();
    });
  });
}

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }
  render();
});
