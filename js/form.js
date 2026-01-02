const MESSAGES = {
	invalidEmail: "Please enter a valid email address.",
	requiredFields: "Please complete all fields.",
	success: "✓ Message sent successfully!",
	serverError: "✗ Something went wrong. Please try again or message me on LinkedIn directly.",
	networkError: "✗ Unable to send message. Please check your connection and try again."
};

const BUTTON_TEXT = {
	default: "Send message",
	sending: "Sending..."
};

(function () {
	"use strict";
	const form = document.querySelector(".contact-form");
	if (!form) return;

	const status = form.querySelector(".form-status");
	const submitButton = form.querySelector('button[type="submit"]');

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		// Clear previous status
		status.textContent = "";
		status.className = "form-status";

		// Validate form
		if (!form.checkValidity()) {
			form.classList.add("show-errors");

			// Find first invalid field
			const firstInvalid = form.querySelector(":invalid");
			if (firstInvalid) {
				firstInvalid.focus();
			}

			const email = form.elements.email;
			if (email && email.value && !email.checkValidity()) {
				status.textContent = MESSAGES.invalidEmail;
			} else {
				status.textContent = MESSAGES.requiredFields;
			}
			return;
		}

		// Form is valid, proceed with submission
		submitButton.disabled = true;
		submitButton.textContent = BUTTON_TEXT.sending;

		try {
			const formData = new FormData(form);

			const response = await fetch(form.action, {
				method: "POST",
				body: formData,
			});

			if (response.ok) {
				// Success
				status.textContent = MESSAGES.success;
				status.classList.add("success");
				form.reset();
				form.classList.remove("show-errors");
			} else {
				// Server error
				status.textContent = MESSAGES.serverError;
				status.classList.add("error");
			}
		} catch (error) {
			// Network error
			status.textContent = MESSAGES.networkError;
			status.classList.add("error");
		} finally {
			// Re-enable submit button
			submitButton.disabled = false;
			submitButton.textContent = BUTTON_TEXT.default;
		}
	});
})();