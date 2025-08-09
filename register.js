// Wait until the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded!');

    const registrationForm = document.querySelector('.registration-form');

    //  Correct name for fields array
    // ERROR: The code later used 'formFields' which was never defined — changed all to 'fieldsToStore'
    const fieldsToStore = [
        'firstName', 'lastName', 'email', 'phone', 'department', 'yearLevel',
        'teacherDepartment', 'disciplineRole', 'password', 'confirmPassword', 'terms'
    ];

    // Temporary storage
    let temporaryFormData = {};

    // Restore saved data if available
    loadSavedFormData();

    // Listen for any input changes in the form
    registrationForm.addEventListener('input', function (event) {
        const changedField = event.target;

        //  FIX: Changed 'formFields' → 'fieldsToStore'
        if (fieldsToStore.includes(changedField.name)) {

            //  FIX: Template string needed backticks
            // ERROR: Used console.log(User changed: ${var}) without backticks
            console.log(User changed: ${changedField.name});

            saveFieldTemporarily(changedField);
        }
    });

    // Handle terms checkbox separately
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', () => {
            const isChecked = termsCheckbox.checked;

            //  FIX: Added backticks to template string
            console.log(Terms checkbox changed: ${isChecked});

            temporaryFormData['terms'] = isChecked;
        });
    }

    // Form submission and validation
    registrationForm.addEventListener('submit', event => {
        console.log('User trying to submit form...');
        clearAllErrors();

        const isFormValid = validateAllFields();

        if (!isFormValid) {
            event.preventDefault();
            console.log('Form has errors - submission stopped');
            showSummaryMessage('Please fix the errors above.', 'error');
        } else {
            temporaryFormData = {}; // clear temp data
            console.log('Form is valid - submitting!');
            showSummaryMessage('Account created successfully!', 'success');
        }
    });

    // --- Helper Functions ---
    function saveFieldTemporarily(field) {
        if (field.type === 'checkbox') {
            temporaryFormData[field.name] = field.checked;
        } else {
            temporaryFormData[field.name] = field.value.trim();
        }
    }

    function loadSavedFormData() {
        //  FIX: Changed 'formFields' → 'fieldsToStore'
        fieldsToStore.forEach(name => {

            //  FIX: Wrong selector syntax
            // ERROR: querySelector([name="${name}"]) is invalid
            const field = registrationForm.querySelector([name="${name}"]);

            if (field && temporaryFormData[name] !== undefined) {
                if (field.type === 'checkbox') {
                    field.checked = temporaryFormData[name];
                } else {
                    field.value = temporaryFormData[name];
                }
            }
        });
    }

    function validateAllFields() {
        let isValid = true;

        //  FIX: Changed 'formFields' → 'fieldsToStore'
        fieldsToStore.forEach(name => {

            //  FIX: Wrong selector syntax
            const field = registrationForm.querySelector([name="${name}"]);
            if (!field) return;

            // Basic required field check (optional teacherDepartment/disciplineRole)
            if (['teacherDepartment', 'disciplineRole'].includes(name) === false && !field.value.trim()) {
                showFieldError(field, 'This field is required.');
                isValid = false;
            }

            // Email format validation
            if (name === 'email' && field.value.trim()) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(field.value.trim())) {
                    showFieldError(field, 'Please enter a valid email address.');
                    isValid = false;
                }
            }

            //  FIX: Password length check updated to match HTML minlength=8
            if (name === 'password' && field.value.length < 8) {
                showFieldError(field, 'Password must be at least 8 characters.');
                isValid = false;
            }

            // Confirm password match
            if (name === 'confirmPassword') {
                const passwordField = registrationForm.querySelector('[name="password"]');
                if (passwordField && field.value !== passwordField.value) {
                    showFieldError(field, 'Passwords do not match.');
                    isValid = false;
                }
            }

            // Terms checkbox validation
            if (name === 'terms') {
                const termsChecked = registrationForm.querySelector('[name="terms"]').checked;
                if (!termsChecked) {
                    showFieldError(field, 'You must agree to the terms.');
                    isValid = false;
                }
            }
        });

        return isValid;
    }

    function showFieldError(field, message) {
        const error = document.createElement('span');
        error.className = 'error-message';
        error.style.color = 'red';
        error.textContent = message;
        field.classList.add('error');
        if (field.parentElement) {
            field.parentElement.appendChild(error);
        }
    }

    function clearAllErrors() {
        registrationForm.querySelectorAll('.error-message').forEach(msg => msg.remove());
        registrationForm.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
    }

    function showSummaryMessage(message, type) {
        let summary = document.querySelector('.form-summary');
        if (!summary) {
            summary = document.createElement('div');
            summary.className = 'form-summary';
            registrationForm.prepend(summary);
        }
        summary.textContent = message;
        summary.style.color = type === 'error' ? 'red' : 'green';
        summary.style.marginBottom = '10px';
        summary.style.fontWeight = 'bold';
    }
});