function showLoading() {
    const div = document.createElement("div");
    div.classList.add("loading-bg", "centralize"); 

    const spinner = document.createElement("i");
    spinner.classList.add("fas", "fa-spinner", "fa-spin", "fa-3x", "icon-spin"); 

    const label = document.createElement("label");
    label.innerText = "Carregando...";

    div.appendChild(spinner);
    div.appendChild(label);

    document.body.appendChild(div);
}

function hideLoading() {
    const loadings = document.getElementsByClassName("loading");
    if (loadings.length) {
        loadings[0].style.opacity = 0;
        setTimeout(() => {
            loadings[0].remove();
        }, 5000);
    }
}
