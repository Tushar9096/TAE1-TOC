# TAE-1: Modular Turing Machine – Copy String Subroutine

**Student:** Tushar Dhanraj Khangare (CM24119)  
**Course:** Theory of Computation (N-PCCCM503T)  
**Semester:** 5th Sem, Session 2026-27 (ODD)  
**Department:** Emerging Technologies (AI&ML)

## Problem statement
Create a modular Turing Machine simulation that implements a **copy string subroutine** for the transformation **w → w B w**, while dynamically updating tape contents and head direction.

## What the app demonstrates
- Input validation for binary strings.
- INIT module that creates the blank separator `B`.
- COPY_SUBROUTINE using temporary markers `X` and `Y`.
- Dynamic `L/R` head movement after every TM action.
- Step-by-step transition trace.
- Final verification against the expected form `w B w`.

## How to run
The project is intentionally dependency-free.

1. Open `index.html` directly in Chrome/Edge, **or**
2. Run a local server:
   - `python -m http.server 8000`
   - Open `http://localhost:8000`

## Valid demo inputs
`1011`, `00101`, `11010`

## Invalid demo inputs
Empty string, `1012`, `10a1`, `110 1`

## Submission-ready GitHub structure
- `index.html` – complete interactive application
- `README.md` – setup and explanation
- `TAE1_TM_Copy_String_Report.docx` – project report
- `TAE1_TM_Prompt_Log.xlsx` – prompt used for app/model generation and test cases
