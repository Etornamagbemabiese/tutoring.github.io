// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add active class to navigation items based on scroll position
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav ul li a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Experience items animation and interaction
const experienceItems = document.querySelectorAll('.experience-item');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

experienceItems.forEach(item => {
    // Initial styles
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
    
    // Click handler
    item.addEventListener('click', function() {
        // Close all other items
        experienceItems.forEach(otherItem => {
            if (otherItem !== this) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current item
        this.classList.toggle('active');
    });
});

// Add animation to skills
const skills = document.querySelectorAll('.skills li');
skills.forEach((skill, index) => {
    skill.style.opacity = '0';
    skill.style.transform = 'scale(0.8)';
    skill.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
        skill.style.opacity = '1';
        skill.style.transform = 'scale(1)';
    }, 100 * index);
});

// Add animation to contact items
const contactItems = document.querySelectorAll('.contact-info p');
contactItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
    }, 200 * index);
});

// Start Section Animation
const startOverlay = document.getElementById('start-overlay');
const techText = document.querySelector('.tech-text');
const techIcons = document.querySelectorAll('.tech-icons i');
const startButton = document.querySelector('.start-button');

const techPhrases = [
    "Financial Analysis",
    "Product Management",
    "Leadership",
    "Project Management",
    "Technical Support",
    "Customer Service",
    "Event Planning",
    "Budget Management",
    "Public Speaking",
    "Teamwork"
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const currentPhrase = techPhrases[currentPhraseIndex];
    
    if (isDeleting) {
        techText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50;
    } else {
        techText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && currentCharIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 1500;
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % techPhrases.length;
        typingSpeed = 500;
    }

    setTimeout(typeText, typingSpeed);
}

// Start the typing animation
typeText();

// Add hover effect to tech icons
techIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.transform = 'scale(1.2)';
        icon.style.opacity = '1';
    });

    icon.addEventListener('mouseleave', () => {
        icon.style.transform = 'scale(1)';
        icon.style.opacity = '0.8';
    });
});

// Handle overlay click
startOverlay.addEventListener('click', () => {
    startOverlay.style.animation = 'fadeOut 0.5s forwards';
    setTimeout(() => {
        startOverlay.style.display = 'none';
    }, 500);
});

// Click to Start interaction
startButton.addEventListener('click', () => {
    // Animate icons
    techIcons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.transform = 'translateY(-50px) scale(1.5)';
            icon.style.opacity = '0';
        }, index * 200);
    });

    // Animate button
    startButton.style.transform = 'scale(1.2)';
    startButton.style.opacity = '0';

    // Redirect or perform action after animation
    setTimeout(() => {
        // You can add your desired action here
        console.log('Starting journey...');
        // For example: window.location.href = 'your-link-here';
    }, 1000);
}); 