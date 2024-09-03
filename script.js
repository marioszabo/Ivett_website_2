document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(contactForm);
            
            // Send form data to FormSubmit
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                // Hide the form
                contactForm.style.display = 'none';
                
                // Show the success message
                formSuccess.classList.remove('hidden');
                formSuccess.classList.add('block');
                
                // Reset form fields
                contactForm.reset();
                
                // Hide success message and show form again after 5 seconds
                setTimeout(() => {
                    formSuccess.classList.remove('block');
                    setTimeout(() => {
                        formSuccess.classList.add('hidden');
                        contactForm.style.display = 'block';
                    }, 500); // Wait for fade out animation to complete
                }, 5000);
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hiba történt az üzenet küldése közben. Kérjük, próbálja újra később.');
            });
        });
    }

    // Initialize the map
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // Coordinates for Debrecen, Hungary
        const lat = 47.5316;
        const lng = 21.6273;
        
        var map = L.map('map').setView([lat, lng], 13); // Zoom level 13 should be good for a city view

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Add a marker for your dental clinic
        L.marker([lat, lng]).addTo(map)
            .bindPopup(`
                <strong>Dr. Kis Ivett Bernadett Fogorvos</strong><br>
                Bolyai utca 2<br>
                4032, Debrecen<br>
                <a href="tel:+36202467131">+36 20 246 7131</a>
            `)
            .openPopup();

        // Invalidate size and recenter map after load
        setTimeout(() => {
            map.invalidateSize();
            map.setView([lat, lng], 13);
        }, 0);
    }

    const topBar = document.getElementById('top-bar');
    const stickyHeader = document.getElementById('sticky-header');
    let topBarHeight;
    let lastScrollTop = 0;

    function updateTopBarHeight() {
        topBarHeight = topBar.offsetHeight;
        if (window.innerWidth <= 768) { // Change to match Tailwind's md breakpoint
            stickyHeader.style.top = `${topBarHeight}px`;
            // Remove or adjust this line:
            // document.body.style.paddingTop = `${topBarHeight + stickyHeader.offsetHeight}px`;
        } else {
            stickyHeader.style.top = '0';
            document.body.style.paddingTop = '0';
        }
    }

    function debounce(func, wait = 20, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    const handleScroll = debounce(function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (window.innerWidth <= 768) { // Change to match Tailwind's md breakpoint
            if (scrollTop > lastScrollTop && scrollTop > topBarHeight) {
                // Scrolling down
                topBar.style.top = `-${topBarHeight}px`;
                stickyHeader.style.top = '0';
            } else {
                // Scrolling up
                topBar.style.top = '0';
                stickyHeader.style.top = `${topBarHeight}px`;
            }
        }

        lastScrollTop = scrollTop;
    });

    window.addEventListener('resize', updateTopBarHeight);
    window.addEventListener('scroll', handleScroll);
    updateTopBarHeight();

    // Smooth scrolling for the appointment button
    const appointmentBtn = document.getElementById('appointment-btn');
    if (appointmentBtn) {
        appointmentBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // Add mobile menu toggle functionality
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Back to top button
    const backToTopButton = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.remove('hidden');
        } else {
            backToTopButton.classList.add('hidden');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
