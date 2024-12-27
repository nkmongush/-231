document.addEventListener('DOMContentLoaded', function () {
    let registrationForm,
        nameInput,
        dateInput,
        genderMale,
        genderFemale,
        nameError,
        dateError,
        genderError,
        profileSlide,
        nameDiv,
        dateDiv,
        genderDiv,
        registrationModal,
        editForm,
        images,
        currentIndex = 0,
        checkTestButton,
        resetTestButton,
        quizDiv,
        resultsDiv,
        galleryContainer,
        galleryImages,
        prevButton,
        nextButton,
        searchInput,
        searchButton,
        endSearchButton,
        glossaryItems;
    let currentPath = window.location.pathname;

    function showCustomError(message, element) {
        if (!element) {
            console.error("Element is null, cannot show custom error:", message);
            return;
        }
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        element.parentNode.insertBefore(errorElement, element.nextSibling);
        setTimeout(() => errorElement.remove(), 5000);
    }

    function showCustomSuccess(message, element) {
        const successElement = document.createElement('div');
        successElement.className = 'custom-success';
        successElement.textContent = message;
        element.parentNode.insertBefore(successElement, element.nextSibling);
        setTimeout(() => successElement.remove(), 3000);
    }

    function initRegistration() {
        registrationForm = document.getElementById('registrationForm');
        nameInput = document.getElementById('nameInput');
        dateInput = document.getElementById('dateInput');
        genderMale = document.getElementById('genderMale');
        genderFemale = document.getElementById('genderFemale');
        registrationModal = document.getElementById('registrationModal');

        if (registrationForm && registrationModal) {
            registrationForm.addEventListener('submit', handleRegistration);
        }
    }

    function handleRegistration(event) {
        event.preventDefault();
        let isValid = true;

        isValid = validateField(nameInput, nameError, "Пожалуйста, введите имя.");
        isValid = validateField(dateInput, dateError, "Пожалуйста, выберите дату рождения.") && isValid;

        let selectedGender;
        if (genderMale.checked) {
            selectedGender = genderMale.value;
        } else if (genderFemale.checked) {
            selectedGender = genderFemale.value;
        } else {
            isValid = false;
            showCustomError("Пожалуйста, выберите пол.", registrationForm);
        }

        if (isValid) {
            const registrationData = {
                name: nameInput.value,
                date: dateInput.value,
                gender: selectedGender,
            };
            localStorage.setItem('registrationData', JSON.stringify(registrationData));
            registrationModal.style.display = 'none';
            updateProfileDisplay();
            showCustomSuccess('Регистрация прошла успешно!', registrationForm);
        }
    }


    function validateField(field, errorElement, message) {
        if (!field.value.trim() || !field.validity.valid) {
            errorElement.textContent = message;
            return false;
        } else {
            errorElement.textContent = "";
            return true;
        }
    }

    function updateProfileDisplay() {
        profileSlide = document.getElementById('profile-slide');
        nameDiv = document.getElementById('name');
        dateDiv = document.getElementById('date');
        genderDiv = document.getElementById('gender');

        if (!profileSlide || !nameDiv || !dateDiv || !genderDiv) return;
        try {
            const registrationData = localStorage.getItem('registrationData');
            if (registrationData) {
                const data = JSON.parse(registrationData);
                if (data.name) nameDiv.textContent = `Имя: ${data.name}`;
                if (data.date) dateDiv.textContent = `Дата рождения: ${data.date}`;
                if (data.gender) genderDiv.textContent = `Пол: ${data.gender}`;
                profileSlide.style.display = 'block';
            } else {
                profileSlide.style.display = 'none';
            }
        } catch (error) {
            showCustomError("Ошибка при загрузке данных профиля.", profileSlide);
            console.error("Error parsing registration data:", error);
        }
    }
    function initGallery() {
        galleryContainer = document.querySelector('.gallery-container');
        if (!galleryContainer) return;
        galleryImages = galleryContainer.querySelector('.gallery-images');
        prevButton = galleryContainer.querySelector('#prevButton');
        nextButton = galleryContainer.querySelector('#nextButton');

        if (galleryImages && prevButton && nextButton) {
            images = galleryContainer.querySelectorAll('.gallery-images img');
            if (images) {
                currentIndex = 0;
                updateGallery();
                prevButton.addEventListener('click', () => {
                    currentIndex = Math.max(0, currentIndex - 1);
                    updateGallery();
                });
                nextButton.addEventListener('click', () => {
                    currentIndex = Math.min(images.length - 1, currentIndex + 1);
                    updateGallery();
                });
            }
        }
    }
    function updateGallery() {
        if (!galleryContainer) return;
        images = images || galleryContainer.querySelectorAll('.gallery-images img');
        if (!images || images.length === 0) return;

        const offset = -currentIndex * 100;
        galleryImages.style.transform = `translateX(${offset}%)`;
        if (prevButton)
            prevButton.disabled = currentIndex === 0;
        if (nextButton)
            nextButton.disabled = currentIndex === images.length - 1;
    }
    function handleCheckTest(event) {
        event.preventDefault();
        if (!quizDiv || !resultsDiv) {
            showCustomError("Ошибка: Элементы quiz и results не найдены!", quizDiv);
            return;
        }
        resultsDiv.innerHTML = '';
        const answers = {
            q1: 'солдат-76',
            q2: 'молот, щит, рывок',
            q3: 'C',
            q4: 'A',
            q5: 'D',
            q6: 'A'
        };
        let score = 0;
        let feedback = '';
        for (let i = 1; i <= 6; i++) {
            const question = `q${i}`;
            let userAnswer;
            if (question === 'q1' || question === 'q2') {
                userAnswer = quizDiv.querySelector(`input[name="${question}"]`).value?.toLowerCase();
            } else {
                userAnswer = quizDiv.querySelector(`input[name="${question}"]:checked`)?.value;
            }
            if (userAnswer) {
                if (question === 'q1' || question === 'q2') {
                    if (userAnswer.includes(answers[question].toLowerCase())) {
                        score++;
                        feedback += `<p>Вопрос ${i}: Верно!</p>`;
                    } else {
                        feedback += `<p>Вопрос ${i}: Неверно. Правильный ответ: ${answers[question]}</p>`;
                    }
                } else {
                    if (userAnswer === answers[question]) {
                        score++;
                        feedback += `<p>Вопрос ${i}: Верно!</p>`;
                    } else {
                        feedback += `<p>Вопрос ${i}: Неверно. Правильный ответ: ${answers[question]}</p>`;
                    }
                }
            } else {
                feedback += `<p>Вопрос ${i}: Не был дан ответ</p>`;
            }
        }
        resultsDiv.innerHTML = `<h2>Ваш результат: ${score} из 6</h2>${feedback}`;
        if (checkTestButton) {
            checkTestButton.style.display = 'none';
        }
        if (resetTestButton) {
            resetTestButton.style.display = 'block';
        }
    }


    function handleResetTest(event) {
        event.preventDefault();
        if (!quizDiv || !resultsDiv) {
            showCustomError('Невозможно найти элементы теста.', quizDiv);
            return;
        }
        resultsDiv.innerHTML = '';
        const inputs = quizDiv.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.type === 'radio') input.checked = false;
            else if (input.type === 'text') input.value = '';
        });
        if (checkTestButton) {
            checkTestButton.style.display = 'block';
        }
        if (resetTestButton) {
            resetTestButton.style.display = 'none';
        }
    }

    function handleSearch() {
        if (!searchInput) return;
        try {
            const searchTerm = searchInput.value.toLowerCase();
            glossaryItems.forEach(item => {
                const term = item.querySelector('.term')?.textContent?.toLowerCase();
                item.style.display = term?.includes(searchTerm) ? 'flex' : 'none';
            });
            searchButton.style.display = 'none';
            endSearchButton.style.display = 'inline-block';
        } catch (error) {
            showCustomError('Ошибка при поиске терминов.', searchButton);
        }
    }


    function handleEndSearch() {
        if (!searchInput) return;
        try {
            searchInput.value = '';
            glossaryItems.forEach(item => {
                item.style.display = 'flex';
            });
            searchButton.style.display = 'inline-block';
            endSearchButton.style.display = 'none';
        } catch (error) {
            showCustomError('Ошибка при завершении поиска.', searchButton);
        }
    }

    function handleEditForm(event) {
        event.preventDefault();
        const editNameInput = document.getElementById('editName');
        const editDateInput = document.getElementById('editDate');
        const editGenderMale = document.getElementById('editGenderMale');
        const editGenderFemale = document.getElementById('editGenderFemale');
        let gender = 'не указан';
        if (editGenderMale.checked) gender = 'мужской';
        if (editGenderFemale.checked) gender = 'женский';
        const registrationData = { name: editNameInput.value, date: editDateInput.value, gender };
        localStorage.setItem('registrationData', JSON.stringify(registrationData));
        updateProfileDisplay();
        if (editForm) {
            editForm.style.display = 'none';
        }
        if (profileSlide) {
            profileSlide.style.display = 'block';
        }
        showCustomSuccess("Профиль изменён!", editForm);
    }

    if (document.getElementById("registrationModal") && document.getElementById("registrationForm")) {
        initRegistration();
    }
    if (document.querySelector('.gallery-container')) {
        initGallery();
    }

    if (currentPath.includes('index.html')) {
        updateProfileDisplay();
        editForm = document.getElementById('editForm');
        const editProfileButton = document.getElementById('editProfile');
        if (editProfileButton) {
            editProfileButton.addEventListener('click', function () {
                if (profileSlide && editForm) {
                    profileSlide.style.display = 'none';
                    editForm.style.display = 'block';
                }
            });
        }
        if (editForm) {
            editForm.addEventListener('submit', handleEditForm);
        }
    }
    if (currentPath.includes('test.html')) {
        quizDiv = document.getElementById('quiz');
        resultsDiv = document.getElementById('results');
        checkTestButton = document.getElementById('checkTestButton');
        resetTestButton = document.getElementById('resetTestButton');
        if (checkTestButton) {
            checkTestButton.addEventListener('click', handleCheckTest);
        }
        if (resetTestButton) {
            resetTestButton.addEventListener('click', handleResetTest);
            resetTestButton.style.display = 'none';
        }
    }

    if (currentPath.includes('glossary.html')) {
        searchInput = document.getElementById('search-term');
        searchButton = document.getElementById('search-button');
        endSearchButton = document.getElementById('end-search-button');
        glossaryItems = document.querySelectorAll('#glossary-list li');
        if (searchButton && endSearchButton && searchInput) {
            searchButton.addEventListener('click', handleSearch);
            endSearchButton.addEventListener('click', handleEndSearch);
        }
    }

    registrationModal = document.getElementById('registrationModal');
    const registrationData = localStorage.getItem('registrationData');
    if (!registrationData && registrationModal) {
        registrationModal.style.display = 'block';
    }

});