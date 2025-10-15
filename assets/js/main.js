const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');

if (navToggle && siteNav) {
  const toggleNav = () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if (expanded) {
      siteNav.setAttribute('data-collapsed', '');
    } else {
      siteNav.removeAttribute('data-collapsed');
    }
  };

  navToggle.addEventListener('click', toggleNav);
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        navToggle.setAttribute('aria-expanded', 'false');
        siteNav.setAttribute('data-collapsed', '');
      }
    });
  });

  window.addEventListener('keyup', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      toggleNav();
    }
  });
}

const motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

if (motionOK) {
  const revealables = Array.from(
    new Set(
      Array.from(document.querySelectorAll('[data-delay], [data-reveal]'))
    )
  );

  revealables.forEach((element) => {
    const rawDelay = element.dataset.delay;
    if (rawDelay !== undefined) {
      const delay = Number(rawDelay);
      if (!Number.isNaN(delay)) {
        element.style.transitionDelay = String(Math.max(delay, 0)) + 's';
      }
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -18%',
      threshold: 0.2,
    }
  );

  revealables.forEach((element) => observer.observe(element));
}

document.getElementById('year')?.replaceChildren(
  document.createTextNode(String(new Date().getFullYear()))
);

const modal = document.querySelector('.modal');
const modalImage = modal?.querySelector('.modal__image');
const modalCaption = modal?.querySelector('.modal__caption');
const modalOverlay = modal?.querySelector('.modal__overlay');

if (modal && modalImage && modalCaption && modalOverlay) {
  const openModal = (trigger) => {
    const imageSrc = trigger.getAttribute('data-modal-image');
    if (!imageSrc) {
      return;
    }

    const title = trigger.getAttribute('data-modal-title') || '';
    const description = trigger.getAttribute('data-modal-description') || '';

    modalImage.src = imageSrc;
    modalImage.alt = title ? title + ' - full render' : 'Full render';
    modalCaption.textContent = description || title;

    modal.removeAttribute('hidden');
    document.body.classList.add('has-modal');
    modalImage.focus?.();
  };

  const closeModal = () => {
    modal.setAttribute('hidden', '');
    document.body.classList.remove('has-modal');
    modalImage.src = '';
  };

  document.querySelectorAll('[data-modal-open]').forEach((trigger) => {
    trigger.addEventListener('click', () => openModal(trigger));
    trigger.addEventListener('keydown', (event) => {
      if ((event.key === 'Enter' || event.key === ' ') && !event.defaultPrevented) {
        event.preventDefault();
        openModal(trigger);
      }
    });
  });

  modal.querySelectorAll('[data-modal-close]').forEach((closer) => {
    closer.addEventListener('click', closeModal);
  });

  modalOverlay.addEventListener('click', closeModal);

  window.addEventListener('keyup', (event) => {
    if (event.key === 'Escape' && !modal.hasAttribute('hidden')) {
      closeModal();
    }
  });
}

const splash = document.querySelector('[data-splash]');

if (splash) {
  window.addEventListener('load', () => {
    window.setTimeout(() => {
      splash.classList.add('is-hidden');
      window.setTimeout(() => splash.remove(), 700);
    }, 450);
  });
}

const emailTrigger = document.querySelector('[data-email-trigger]');
const emailOptions = document.querySelector('[data-email-options]');
const gmailButton = emailOptions?.querySelector('[data-gmail]');
const mailtoLink = emailOptions?.querySelector('[data-mailto]');
let hideEmailOptions = null;

if (emailTrigger && emailOptions) {
  hideEmailOptions = () => {
    if (!emailOptions.hasAttribute('hidden')) {
      emailOptions.classList.remove('is-visible');
      window.setTimeout(() => emailOptions.setAttribute('hidden', ''), 260);
    }
  };

  emailTrigger.addEventListener('click', () => {
    if (emailOptions.hasAttribute('hidden')) {
      emailOptions.removeAttribute('hidden');
      requestAnimationFrame(() => emailOptions.classList.add('is-visible'));
      gmailButton?.focus();
    } else {
      hideEmailOptions();
    }
  });

  document.addEventListener('click', (event) => {
    if (!emailOptions.contains(event.target) && event.target !== emailTrigger) {
      hideEmailOptions();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideEmailOptions();
    }
  });
}

if (gmailButton) {
  gmailButton.addEventListener('click', () => {
    const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=statusquo13372@gmail.com&su=Project%20with%20statusqu0';
    window.open(gmailUrl, '_blank', 'noopener');
    hideEmailOptions?.();
  });
}

if (mailtoLink) {
  mailtoLink.addEventListener('click', () => {
    hideEmailOptions?.();
  });
}
