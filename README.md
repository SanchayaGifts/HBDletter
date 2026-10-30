# 💌 Aesthetic Birthday Love Letter Website

A romantic, interactive Birthday Wishes Website built using **pure HTML5, CSS3, and vanilla JavaScript**.

This website provides a realistic experience of receiving a romantic love letter, complete with:
- **Scene 1**: 3D envelope with a realistic wax seal and heartbeat pulse animation.
- **Scene 2**: Smooth envelope opening and realistic 3D paper emergence.
- **Scene 3**: Cream stationery paper unfolding with pressed dried roses, vintage postage stamp, and handwritten message reveal.
- **Scene 4**: Smooth, magical letter-erasing transition where the letter text dissolves like ink turning to shimmering stardust.
- **Scene 5**: Perfectly symmetrical, fully closed glowing 3D heart surprise centerpiece with an emotional closing message.

---

## 🎨 Color Palette & Aesthetics

- **Deep Black**: `#0D0D0D`
- **Dark Cherry Red**: `#800020`
- **Romantic Red**: `#C1123F`
- **Soft Pink**: `#F8C8DC`
- **Blush Pink**: `#FADADD`
- **Rose Pink**: `#E75480`
- **Warm Cream Paper**: `#FFF4E6`
- **Dark Ink**: `#3B2028`

---

## 📁 Project Structure

```text
├── index.html       # Semantic HTML structure & editable letter content
├── style.css        # Responsive styling, 3D envelope, paper textures & animations
├── script.js        # Envelope interaction, unfolding logic, audio control & canvas particles
├── love-song.mp3    # Romantic background music (Gymnopédie No. 1)
└── README.md        # Documentation
```

---

## ✏️ How to Customize

### 1. Change Typing Speed
Open [script.js](script.js) and adjust the `TYPING_CONFIG` values at the top:
```javascript
const TYPING_CONFIG = {
  speed: 28, // Milliseconds per character (e.g., 15 for fast, 28 for default, 50 for slow)
  pauseBetweenParagraphs: 240, // Pause between paragraphs
  musicVolume: 0.55 // Continuous background music volume
};
```

### 2. Customize Names, Letter Content & Date
All letter text is written in semantic HTML inside [index.html](index.html):
- **Recipient Greeting**: Edit `To My Favourite Person, ♡` inside `#letter-greeting`
- **Sender Signature**: Edit `[YOUR NAME] ♡` inside `#sender-signature-name` and `#surprise-sender-name`
- **Date**: Edit `#letter-date`
- **Letter Body**: Edit paragraphs inside `<div class="letter-paragraphs">`
- **Background Music**: Replace `love-song.mp3` with any song of your choice (plays automatically in the background)

---

## 🚀 How to Run Locally

1. Clone or download this repository.
2. Open `index.html` in your browser or run with a local web server (e.g. `npx serve .` or VS Code Live Server).
3. Tap the envelope to experience the opening sequence!
