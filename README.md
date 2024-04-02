# event-timer2

A very simple static webpage to help with timing of mHealth experiments (or any other experiments). A rework of [the original](https://github.com/HAbitsLab/EventTimerTool).

<img width="1624" alt="Screenshot 2024-04-02 at 00 02 44" src="https://github.com/HAbitsLab/event-timer2/assets/1065690/5828187c-1989-4a14-a6f3-5136e605173f">

## Features
* Add "events" with duration in seconds
* Export events as JSON (copy text area)
* Import events as JSON
* Countdown timer for each event in sequence
* Record start and end time of each event
* Export event times as CSV

## Run

Open `index.html` in a browser or, preferred, run a local webserver to serve the static site

```bash
python -m http.server 8000 
```
