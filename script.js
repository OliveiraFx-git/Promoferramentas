(() => {
  const groupUrl = 'https://chat.whatsapp.com/LV3jQsyw0WZ0f5xTl92rGP';
  document.querySelectorAll('.join-button').forEach(button => {
    button.href = groupUrl;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
  });

  // Contador demonstrativo; não representa vagas reais no grupo.
  const vacancyNode = document.getElementById('vacancies');
  let vacancies = Math.floor(Math.random() * 11) + 10;
  if (vacancyNode) vacancyNode.textContent = vacancies;
  window.setInterval(() => {
    if (vacancies > 0) {
      vacancies -= 1;
      if (vacancyNode) vacancyNode.textContent = vacancies;
    }
  }, 60000);

  // Notificações ilustrativas, sem afirmar entradas reais no grupo.
  const names = ['Miguel','Arthur','Heitor','Gael','Theo','Davi','Bernardo','Gabriel','Ravi','Noah','Samuel','Pedro','Anthony','Isaac','Benício','Benjamin','Matheus','Lucas','Joaquim','Nicolas','Henrique','Lorenzo','Guilherme','Murilo','Júlia','Helena','Alice','Laura','Maria','Valentina','Heloísa','Sophia','Manuela','Isabella','Luísa','Cecília','Eloá','Maitê','Liz','Aurora','Lívia','Antonella','Isadora','Mariana','Beatriz','Ana','Lara','Yasmin','Rebeca','Sarah'];
  const toast = document.getElementById('toast-name');
  let nameIndex = 0;
  const toastBox = toast && toast.closest('.join-toast');
  const showToast = () => {
    if (!toast || !toastBox) return;
    toast.textContent = `${names[nameIndex]} entrou no grupo`;
    toastBox.classList.add('show');
    window.setTimeout(() => {
      toastBox.classList.remove('show');
      nameIndex = (nameIndex + 1) % names.length;
    }, 3000);
  };
  window.setTimeout(() => {
    showToast();
    window.setInterval(showToast, 8000);
  }, 1000);

  // Entrada gradual das seções quando entram na área visível.
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // Contagem crescente dos cartões, disparada quando ficam visíveis.
  const counters = document.querySelectorAll('.count');
  const formatCount = value => value.toLocaleString('pt-BR');
  const animateCount = el => {
    if (el.dataset.done) return;
    el.dataset.done = 'true';
    const target = Number(el.dataset.target || 0);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    const frame = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(Math.round(target * eased)) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  if ('IntersectionObserver' in window) {
    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    counters.forEach(el => countObserver.observe(el));
  } else counters.forEach(animateCount);

  // Se o arquivo MP4 ainda não estiver presente, mostra a imagem extraída do PSD.
  const video = document.getElementById('group-video');
  const fallback = document.querySelector('.screen-fallback');
  if (video) {
    video.addEventListener('loadeddata', () => { if (fallback) fallback.hidden = true; });
    video.addEventListener('error', () => { if (fallback) fallback.hidden = false; });
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.controls = false;
    video.disablePictureInPicture = true;
    video.src = 'imagens/video-grupo.mp4';
    video.load();
    const playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === 'function') playAttempt.catch(() => {});
  }

  // Dúvidas frequentes: abre e fecha com animação suave de altura.
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.faq details').forEach(item => {
    const summary = item.querySelector('summary');
    let anim = null;
    summary.addEventListener('click', event => {
      if (reduceMotion || !item.animate) return;
      event.preventDefault();
      if (anim) anim.cancel();
      const opening = !item.open;
      const start = item.offsetHeight;
      const border = item.offsetHeight - item.clientHeight;
      item.style.overflow = 'hidden';
      let end;
      if (opening) {
        item.open = true;
        end = item.offsetHeight;
      } else {
        item.classList.add('closing');
        end = summary.offsetHeight + border;
      }
      anim = item.animate({ height: [start + 'px', end + 'px'] }, { duration: 450, easing: 'cubic-bezier(.33,0,.2,1)' });
      const done = () => {
        if (!opening) item.open = false;
        item.classList.remove('closing');
        item.style.overflow = '';
        anim = null;
      };
      anim.onfinish = done;
      anim.oncancel = () => { item.style.overflow = ''; };
    });
  });
})();
