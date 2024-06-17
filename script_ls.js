// import { txt } from './Text.js';

const WORDS = 'WORDS';

let word_items_init = {
  A: [234234],
  B: [],
  C: [],
  D: [],
  E: [],
  F: [],
  G: [],
  H: [],
  I: [],
  J: [],
  K: [],
  L: [],
  M: [],
  N: [],
  O: [],
  P: [],
  Q: [],
  R: [],
  S: [],
  T: [],
  U: [],
  V: [],
  W: [],
  X: [],
  Y: [],
  Z: []
};

let word_items_input;
const $fileInput = document.getElementById('fileInput');
$fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target.result;
    word_items_input = JSON.parse(content);
  };
  reader.readAsText(file);
});

const $loadTxt = document.getElementById('loadTxt');
$loadTxt.addEventListener('click', () => {
  saveItem(word_items_input);
});

function loadInitialData() {
  const storedData = localStorage.getItem(WORDS);
  return storedData ? JSON.parse(storedData) : word_items_init;
}

function saveItem(data) {
  localStorage.setItem(WORDS, JSON.stringify(data));
}

const wordsItems = loadInitialData();

const $wordInput = document.getElementById('wordInput');
const $translationInput = document.getElementById('translationInput');
const $addButton = document.getElementById('addButton');

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function superCapitalize(cadena) {
  let palabras = cadena.split(/[,\s]+/);

  let resultado = palabras.map((palabra) => {
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
  });

  return resultado.join(', ');
}

// Add word - translation
$addButton.addEventListener('click', (event) => {
  event.preventDefault();
  const word = $wordInput.value.trim();
  const translation = $translationInput.value.trim();

  if (word && translation) {
    const newWord = {
      id: Date.now(),
      word: capitalize(word),
      translation: superCapitalize(translation)
    };
    const firstLetter = word.charAt(0).toUpperCase();

    try {
      wordsItems[firstLetter].push(newWord);
      saveItem(wordsItems);

      $wordInput.value = '';
      $translationInput.value = '';
    } catch (error) {
      console.error('Error al agregar palabra:', error);
    }
  } else {
    alert('Por favor, ingresa una palabra y su traducción.');
  }
});

const $alphabet = document.querySelector('.alphabet');
const $wordList = document.getElementById('wordList');
const $modal = document.querySelector('.modal');
const $closeButton = document.querySelector('.close-button');

$alphabet.addEventListener('click', async (e) => {
  openModal();
  const letterValue = e.target.value;

  const data = wordsItems[letterValue];

  if (!data || data.length === 0) {
    $wordList.style.textAlign = 'center';
    $wordList.innerText = 'No hay palabras agregadas';
    return;
  }

  renderWordList(data);
});

// Función para renderizar la lista de palabras en la modal
const renderWordList = (data) => {
  $wordList.innerHTML = '';
  const fragment = document.createDocumentFragment();

  data.forEach(({ id, word, translation }) => {
    const div = document.createElement('div');
    div.classList.add('form-row');
    const formRowHTML = `
    <form id="${id}">
    <input type="text" name="word" placeholder="Palabra" class="word-input" value='${word}' >
    <input type="text" name="translation" placeholder="Traducción" class="translation-input" value="${translation}">
    <button type="submit" class="edit-button">Editar</button>
    <button type="submit" class="delete-button">Eliminar</button>
    </form>
    `;
    div.innerHTML = formRowHTML;
    fragment.appendChild(div);
  });

  $wordList.appendChild(fragment);
};

// Evento para manejar la edición y eliminación de palabras
$wordList.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const word = form.word.value.trim();
  const translation = form.translation.value.trim();
  const id = form.id;

  if (word && translation) {
    const newWord = {
      word,
      translation
    };
    const firstLetter = word.charAt(0).toUpperCase();

    try {
      const index = wordsItems[firstLetter].findIndex((item) => item.id == id);

      if (e.submitter.classList.contains('edit-button')) {
        if (index !== -1) {
          wordsItems[firstLetter][index] = {
            ...wordsItems[firstLetter][index],
            ...newWord
          };
          saveItem(wordsItems);
        }
      }

      if (e.submitter.classList.contains('delete-button')) {
        const confirmDelete = confirm(`¿Eliminar la palabra ${word}?`);
        if (confirmDelete) {
          wordsItems[firstLetter].splice(index, 1);
          saveItem(wordsItems);
        }
      }

      // Actualizar la lista después de editar o eliminar
      renderWordList(wordsItems[firstLetter]);
    } catch (error) {
      console.error('Error al editar o eliminar la palabra:', error);
    }
  }
});

// Función para abrir la modal
const openModal = () => {
  $modal.style.display = 'flex';
};

// Función para cerrar la modal
const closeModal = () => {
  $modal.style.display = 'none';
  $wordList.innerHTML = ''; // Limpiamos la lista al cerrar la modal
};

// Evento para cerrar la modal al hacer clic en el botón de cerrar
$closeButton.addEventListener('click', closeModal);

const $saveInDBBtn = document.getElementById('saveDBButton');
$saveInDBBtn.addEventListener('click', () => {
  saveWordsInDB(wordsItems);
});

// Evento para cerrar la modal al hacer clic afuera del modal-content
$modal.addEventListener('click', (e) => {
  console.log();
  if (e.target.classList.contains('modal')) {
    closeModal();
  }
});

document.getElementById('saveDBButton').addEventListener('click', () => {
  const content = JSON.stringify(wordsItems);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'my_words.txt';
  a.click();
  URL.revokeObjectURL(url);
});

setInterval(() => {
  const content = JSON.stringify(wordsItems);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'words_en_es.txt';
  a.click();
  URL.revokeObjectURL(url);
}, 600000);

// Insert text whit local storage
const $insertText = document.getElementById('insertText');
const text = localStorage.getItem('text') || 'No hay texto'; // Use || for default value

window.document.addEventListener('DOMContentLoaded', () => {
  $insertText.innerText = text;
});

$insertText.addEventListener('click', (e) => {
  $insertText.setAttribute('contenteditable', 'true');
  if (text === 'No hay texto') {
    $insertText.innerText = '';
  }
});

const $saveText = document.getElementById('saveText');
$saveText.addEventListener('click', () => {
  $insertText.setAttribute('contenteditable', 'false');
  localStorage.setItem('text', $insertText.innerText);
});
