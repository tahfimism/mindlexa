const ignoredWords = new Set([
  // Articles & Determiners
  "a", "an", "the", "this", "that", "these", "those", "some", "any", "each", "every", "either", "neither",

  // Pronouns
  "i", "me", "my", "mine", "we", "us", "our", "ours",
  "you", "your", "yours",
  "he", "him", "his", "she", "her", "hers",
  "it", "its", "they", "them", "their", "theirs",
  "myself", "yourself", "himself", "herself", "itself", "ourselves", "yourselves", "themselves",

  // Be-verbs
  "is", "am", "are", "was", "were", "be", "been", "being",

  // Auxiliary verbs
  "do", "does", "did", "doing",
  "have", "has", "had", "having",
  "can", "could", "will", "would", "shall", "should", "may", "might", "must", "ought",

  // Conjunctions
  "and", "or", "but", "nor", "yet", "so", "although", "though", "because", "since", "unless", "while", "whereas",

  // Prepositions
  "at", "by", "for", "from", "in", "into", "of", "on", "to", "with", "about", "above", "across", "after", "against", "along", "among", "around", "before", "behind", "below", "beneath", "beside", "between", "beyond", "during", "inside", "near", "outside", "over", "past", "through", "under", "until", "up", "upon", "within", "without",

  // Other common junk words
  "not", "no", "yes", "if", "than", "then", "as", "such", "just", "only", "also", "too", "very", "more", "most", "much", "many", "fewer", "less", "few", "now", "still", "yet", "even", "once", "ever", "never", "already"
]);

let cardData = [];
let currentIndex = 0;
const wordCache = new Map();

// Clean, tokenize, filter, and populate cardData
function processText() {
  const text = document.getElementById("textInput").value;
  const doc = nlp(text);

  const uniqueWords = [];
  const seenLemmas = new Set();

  doc.terms().forEach(term => {
    const word = term.text();
    if (!/^[a-zA-Z]+$/.test(word)) {
      return; // Skip punctuation and other non-word terms
    }

    let lemma = term.verbs().toInfinitive().out('text') || term.nouns().toSingular().out('text') || word;
    lemma = lemma.toLowerCase();

    if (!seenLemmas.has(lemma) && !ignoredWords.has(word.toLowerCase())) {
      seenLemmas.add(lemma);
      uniqueWords.push(lemma);
    }
  });

  cardData = uniqueWords.map(word => ({
    word,
    fetched: false,
    meaning: ""
  }));

  currentIndex = 0;
  if (cardData.length === 0) {
    document.getElementById("status").innerText = "No valid words to display.";
  } else {
    document.getElementById("status").innerText = `Found ${cardData.length} unique words. Click the card to load meaning.`;
    updateCardDisplay();
  }
}

// Update the front of the card with current word
function updateCardDisplay() {
  const current = cardData[currentIndex];
  document.getElementById("cardFront").innerText = current.word;
  document.getElementById("cardBack").innerText = current.fetched ? current.meaning : "Click to load meaning...";
}

// Flip and lazy-load meaning if needed
async function flipCard() {
  const card = document.getElementById("card");
  card.classList.toggle("flip");

  const current = cardData[currentIndex];
  const back = document.getElementById("cardBack");

  if (!current.fetched) {
    back.innerText = "Loading...";
    const data = await fetchMeaning(current.word);

    current.fetched = true;
    if (data) {
      current.meaning = formatCardBack(data);
      back.innerHTML = current.meaning;
    } else {
      current.meaning = "❌ No data found.";
      back.innerText = current.meaning;
    }
  } else {
    back.innerHTML = current.meaning;
  }
}

// Format data for display
function formatCardBack(data) {
  let html = "";
  if (!data || data.title === "No Definitions Found") {
    return "❌ No data found.";
  }

  let examples = [];

  data.forEach(entry => {
    entry.meanings.forEach(meaning => {
      html += `<div class="pos-section">`;
      html += `<h4>${meaning.partOfSpeech}</h4>`;
      const definitionsToShow = meaning.definitions.slice(0, 2);
      definitionsToShow.forEach((def, index) => {
        html += `<div class="definition">`;
        html += `<p><b>${index + 1}.</b> ${def.definition}</p>`;
        if (def.example) {
          examples.push(def.example);
        }
        if (def.synonyms && def.synonyms.length > 0) {
          html += `<p><b>Synonyms:</b> ${def.synonyms.join(", ")}</p>`;
        }
        if (def.antonyms && def.antonyms.length > 0) {
          html += `<p><b>Antonyms:</b> ${def.antonyms.join(", ")}</p>`;
        }
        html += `</div>`;
      });
      html += `</div>`;
    });
  });

  if (examples.length > 0) {
    html += `<div class="examples-section">`;
    html += `<h4>Examples</h4>`;
    const examplesToShow = examples.slice(0, 2);
    examplesToShow.forEach(example => {
      html += `<p><em>${example}</em></p>`;
    });
    html += `</div>`;
  }

  return html.trim() || "No detailed info.";
}



// API call with caching
async function fetchMeaning(word) {
  if (wordCache.has(word)) return wordCache.get(word);

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) return null;

    const json = await res.json();
    wordCache.set(word, json);
    return json;
  } catch (e) {
    return null;
  }
}


// Navigation controls
function nextCard() {
  if (currentIndex < cardData.length - 1) {
    currentIndex++;
    resetFlip();
    updateCardDisplay();
  }
}

function prevCard() {
  if (currentIndex > 0) {
    currentIndex--;
    resetFlip();
    updateCardDisplay();
  }
}

// Ignore current word
function ignoreCurrentWord() {
  ignoredWords.add(cardData[currentIndex].word);
  cardData.splice(currentIndex, 1);

  if (cardData.length === 0) {
    document.getElementById("status").innerText = "All words ignored.";
    document.getElementById("cardFront").innerText = "";
    document.getElementById("cardBack").innerText = "";
    return;
  }

  if (currentIndex >= cardData.length) currentIndex = cardData.length - 1;
  resetFlip();
  updateCardDisplay();
}

// Unflip if needed
function resetFlip() {
  document.getElementById("card").classList.remove("flip");
}