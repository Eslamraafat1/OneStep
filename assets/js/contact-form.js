/*
 * Contact form (static front end).
 * There is no server-side mail handler in this repository (production runs on the
 * client's Laravel back end), so the form validates in the browser and then opens
 * the visitor's email client with a pre-filled message to info@onestepcorp.com.
 */
(function () {
    'use strict';

    var RECIPIENT = 'info@onestepcorp.com';
    var form = document.getElementById('contact-form');
    if (!form) return;

    var status = form.querySelector('.form-status');
    var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var PHONE_RE = /^\+?[0-9\s()-]{7,20}$/;

    function setError(field, message) {
        var wrap = field.closest('.form-clt') || field.parentNode;
        var note = wrap.querySelector('.field-error');
        if (!note) {
            note = document.createElement('small');
            note.className = 'field-error';
            note.setAttribute('role', 'alert');
            wrap.appendChild(note);
        }
        note.textContent = message || '';
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function validate() {
        var ok = true;
        var name = form.elements.name;
        var email = form.elements.email;
        var phone = form.elements.phone;
        var message = form.elements.message;

        if (name.value.trim().length < 2) { setError(name, 'Please enter your full name.'); ok = false; } else setError(name, '');
        if (!EMAIL_RE.test(email.value.trim())) { setError(email, 'Please enter a valid email address.'); ok = false; } else setError(email, '');
        if (!PHONE_RE.test(phone.value.trim())) { setError(phone, 'Please enter a valid phone number.'); ok = false; } else setError(phone, '');
        if (message.value.trim().length < 10) { setError(message, 'Please write a short message (at least 10 characters).'); ok = false; } else setError(message, '');
        return ok;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!validate()) {
            if (status) status.textContent = 'Please correct the highlighted fields.';
            var firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        var topic = form.elements.topic ? form.elements.topic.value : '';
        var subject = 'Website enquiry' + (topic ? ': ' + topic : '');
        var body = [
            'Name: ' + form.elements.name.value.trim(),
            'Email: ' + form.elements.email.value.trim(),
            'Phone: ' + form.elements.phone.value.trim(),
            topic ? 'Topic: ' + topic : '',
            '',
            form.elements.message.value.trim()
        ].filter(function (line, i) { return line !== '' || i === 4; }).join('\n');

        window.location.href = 'mailto:' + RECIPIENT +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);
        if (status) status.textContent = 'Your email app should open with the message ready to send. If it does not, email us at ' + RECIPIENT + '.';
    });
})();
