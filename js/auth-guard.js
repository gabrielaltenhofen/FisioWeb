// auth-guard.js
function checkAuth() {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const userName = getCookie('userName');

    if (!userName) {
        window.location.href = 'index.html';
    }
}

// Execute a função assim que o script for carregado
checkAuth();
