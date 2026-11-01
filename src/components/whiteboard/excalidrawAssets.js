// Must be imported before @excalidraw/excalidraw: the library reads this global at
// module load to locate its fonts. Serving them from a pinned CDN keeps ~MBs of
// font files out of the repo and works under any basename (/home on GitHub Pages).
// Keep the version in sync with package.json.
window.EXCALIDRAW_ASSET_PATH = "https://unpkg.com/@excalidraw/excalidraw@0.18.1/dist/prod/";
