# Mindlexa: Smart Text-to-Flashcard Generator
#### Video Demo: [https://youtu.be/X1tMlgjRDxo](https://youtu.be/X1tMlgjRDxo)

#### Description:
Mindlexa is a lightweight, browser-based vocabulary learning tool that converts large text passages into interactive flashcards. It helps users analyze unfamiliar words from articles, essays, or academic materials and study them through spaced repetition-style cards. Its basically a light-weight version of my project Mindlexa (A spaced repition vocabulary flashcard app)

### Key Features:
- **Text Input → Vocabulary Extraction**: Paste any paragraph or article, and the app automatically extracts unique, meaningful words (excluding common stopwords like "the", "he", "it").
- **On-Demand Word Lookup**: Each flashcard loads data dynamically using the [WordNet API](https://api.dictionaryapi.dev/) — including part of speech, definition, synonyms, and antonyms.
- **Interactive Flashcards**: Flip between front (word) and back (details) using clicks. Navigate with next/previous buttons.
- **Word Ignore List**: Instantly ignore unhelpful words by adding them to a personalized blacklist with a single click.
- **Modern UI**: Built using HTML, CSS (Bootstrap 5), and JavaScript — clean, responsive, and mobile-friendly.

### Technologies Used:
- HTML5 + Bootstrap 5
- Vanilla JavaScript (client-side logic)
- DictionaryAPI.dev (WordNet-based free dictionary API)
- Optional: Google Fonts (Inter), smooth CSS transitions for card flip animations

### Why This Project?
As a language learner or student preparing for exams, it's common to copy-paste study material and manually build flashcards — a time-consuming task. Mindlexa automates this process and adds a touch of intelligence by filtering duplicates and focusing on difficult vocabulary.

### How It Works (Behind the Scenes):
1. **Text is parsed** → cleaned → split into words.
2. **Duplicates & common words** are removed on the client side.
3. **Flashcards are generated** dynamically using JavaScript.
4. **Definitions & related data** are fetched *only when a card is flipped* — reducing API load and speeding up the initial experience.

### Limitations:
- API queries may be slow for some uncommon words.
- No user account or saved progress (stateless, lightweight).
- Currently no full spaced repetition algorithm (designed to stay browser-only and fast).

---

### Ideal Use Cases:
- Students studying English vocabulary
- Learners preparing for competitive exams (GRE, SAT, university admissions)
- Anyone wanting to turn reading into learning

---

### Project Status:
Version 1.0 – Feature complete. May add export/save functionality or spaced repetition in future releases.

---

