## 📄 Structuur (`question_<id>.json`)

### Algemene metadata (ook te vinden in `results.json`)

```json
{
  "id": "D11", // id van de vraag
  "question": "D11. How old are you?", // de vraag zelf
  "subquestion": "nan", // optionele subvraag
  "old_values_A": true, // als er oude antwoorden zijn uit volume A
  "old_values_B": true, // als er oude antwoorden zijn uit volume B
  ...
}
```

### Mogelijke antwoorden op de vraag

```json
"answers": [
  "15-24",
  "25-39",
  "40-54",
  "55+",
  "Refusal",
  "Average"
]
```

---

## 📊 `volume_A`: Data per land

Structuur:

```json
"volume_A": {
  "<LANDCODE>": {
    "total": <int>,
    "values": [<float>, ...],
    "percentages": [<float>, ...],
    "total_old": <int>,
    "values_old": [<float>, ...],
    "percentages_old": [<float>, ...]
  },
  ...
}
```

📌 *Voorbeeldland (`BE`):*

```json
"BE": {
  "total": 1011,
  "values": [141, 235, 240, 395, 0, 47.83],
  "percentages": [0.14, 0.23, 0.24, 0.39, 0, -1],
  "total_old": 1051,
  "values_old": [153, 251, 278, 368, 0, 46.99],
  "percentages_old": [0.15, 0.24, 0.26, 0.35, 0, -1]
}
```

---

## 📉 `volume_B`: Data per subgroep

Structuur:

```json
"volume_B": {
  "<Thema>": {
    "<Subgroep>": {
      "total": <int>,
      "values": [<float>, ...],
      "percentages": [<float>, ...],
      "total_old": <int>,
      "values_old": [<float>, ...],
      "percentages_old": [<float>, ...]
    },
    ...
  },
  ...
}
```

📌 *Voorbeeld (`Gender`):*

```json
"Gender": {
  "Man": {
    "total": 12834,
    "values": [1695, 2956, 3317, 4866, 0, 47.74],
    "percentages": [0.13, 0.23, 0.26, 0.38, 0, -1],
    "total_old": 12790,
    "values_old": [1688, 2946, 3306, 4850, 1, 47.78],
    "percentages_old": [0.13, 0.23, 0.26, 0.38, 0, -1],
    ...
  },
  "Woman": {
    ...
  }
}
```

📌 **Het is mogelijk dat er enkel nieuwe of oude gegevens zijn!**
---

