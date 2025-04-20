document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Basic validation
        if (!name || !email || !message) {
            Swal.fire({
                title: 'Error!',
                text: 'Please fill in all fields',
                icon: 'error',
                confirmButtonColor: '#c41e3a'
            });
            return;
        }

        if (!isValidEmail(email)) {
            Swal.fire({
                title: 'Invalid Email',
                text: 'Please enter a valid email address',
                icon: 'warning',
                confirmButtonColor: '#c41e3a'
            });
            return;
        }

        // Simulate form submission
        Swal.fire({
            title: 'Success!',
            text: 'Message sent successfully! We will contact you soon.',
            icon: 'success',
            confirmButtonColor: '#28a745'
        }).then((result) => {
            if (result.isConfirmed) {
                contactForm.reset();
            }
        });
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
});