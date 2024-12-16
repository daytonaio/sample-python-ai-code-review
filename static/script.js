document.getElementById('submitFeedbackBtn').addEventListener('click', function(event) {
    event.preventDefault();
    submitCodeForFeedback();
});

document.getElementById('convertCodeBtn').addEventListener('click', function(event) {
    event.preventDefault();
    convertCode();
});

function submitCodeForFeedback() {
    let code = document.getElementById('code').value;
    let language = document.getElementById('language').value;
    let feedbackElement = document.getElementById('feedback');
    let loadingElement = document.getElementById('loading');
    let fileInput = document.getElementById('codeFile').files[0];

    feedbackElement.innerHTML = '';
    loadingElement.style.display = 'block';

    let formData = new FormData();
    formData.append('code', code);
    formData.append('language', language);

    if (fileInput) {
        let reader = new FileReader();
        reader.onload = function(e) {
            formData.set('code', e.target.result);
            sendFeedbackRequest(formData);
        };
        reader.readAsText(fileInput);
    } else {
        sendFeedbackRequest(formData);
    }
}

function sendFeedbackRequest(formData) {
    fetch('/submit_code', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('feedback').innerHTML = data.feedback;
    })
    .catch(error => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('feedback').innerHTML = '<p>Error: Something went wrong. Please try again.</p>';
    });
}

function convertCode() {
    let code = document.getElementById('code').value;
    let language = document.getElementById('language').value;
    let targetLanguage = document.getElementById('targetLanguage').value;
    let feedbackElement = document.getElementById('feedback');
    let loadingElement = document.getElementById('loading');
    let fileInput = document.getElementById('codeFile').files[0];

    if (targetLanguage === 'none') {
        feedbackElement.innerHTML = '<p>Please select a target language for conversion.</p>';
        return;
    }

    feedbackElement.innerHTML = '';
    loadingElement.style.display = 'block';

    let formData = new FormData();
    formData.append('code', code);
    formData.append('language', language);
    formData.append('targetLanguage', targetLanguage);

    if (fileInput) {
        let reader = new FileReader();
        reader.onload = function(e) {
            formData.set('code', e.target.result);
            sendConversionRequest(formData);
        };
        reader.readAsText(fileInput);
    } else {
        sendConversionRequest(formData);
    }
}

function sendConversionRequest(formData) {
    fetch('/convert_code', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('feedback').innerHTML = `<pre>${data.convertedCode}</pre>`;
    })
    .catch(error => {
        document.getElementById('loading').style.display = 'none';
        document.getElementById('feedback').innerHTML = '<p>Error: Something went wrong. Please try again.</p>';
    });
}

function toggleMode() {
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        modeToggle.textContent = '🌙 Dark Mode';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        modeToggle.textContent = '☀️ Light Mode';
        localStorage.setItem('theme', 'dark');
    }
}

window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const body = document.body;
    const modeToggle = document.getElementById('mode-toggle');

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        modeToggle.textContent = '☀️ Light Mode';
    } else {
        body.classList.add('light-mode');
        modeToggle.textContent = '🌙 Dark Mode';
    }

    modeToggle.addEventListener('click', toggleMode);
});
