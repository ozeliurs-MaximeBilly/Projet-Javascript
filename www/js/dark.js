window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const theme = event.matches ? "dark" : "";
     document.body.classList = theme;
});
