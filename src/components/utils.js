export function formatarDinheiro(valor) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

export function ConvertMes(mes) {
  const meses = {
    '01': 'Janeiro',
    1: 'Janeiro',
    1: 'Janeiro',
    '02': 'Fevereiro',
    2: 'Fevereiro',
    2: 'Fevereiro',
    '03': 'Março',
    3: 'Março',
    3: 'Março',
    '04': 'Abril',
    4: 'Abril',
    4: 'Abril',
    '05': 'Maio',
    5: 'Maio',
    5: 'Maio',
    '06': 'Junho',
    6: 'Junho',
    6: 'Junho',
    '07': 'Julho',
    7: 'Julho',
    7: 'Julho',
    '08': 'Agosto',
    8: 'Agosto',
    8: 'Agosto',
    '09': 'Setembro',
    9: 'Setembro',
    9: 'Setembro',
    10: 'Outubro',
    10: 'Outubro',
    11: 'Novembro',
    11: 'Novembro',
    12: 'Dezembro',
    12: 'Dezembro',
  };

  return meses[mes] || '';
}

export function topNotice(obj, opts = {}) {
  const duration = typeof opts.duration === 'number' ? opts.duration : 4000;
  const containerId = '__top_notice_container';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    Object.assign(container.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      alignItems: 'center',
      pointerEvents: 'none',
      padding: '8px',
    });
    document.body.appendChild(container);
  }

  const type = obj.success
    ? 'success'
    : obj.succes
    ? 'success'
    : obj.error
    ? 'error'
    : 'info';
  const text = obj.success ?? obj.succes ?? obj.error ?? obj.info ?? '';

  const el = document.createElement('div');
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  Object.assign(el.style, {
    pointerEvents: 'auto',
    minWidth: '240px',
    maxWidth: 'calc(100% - 32px)',
    boxSizing: 'border-box',
    padding: '12px 16px',
    borderRadius: '10px',
    color: '#fff',
    fontFamily:
      "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    transform: 'translateY(-10px)',
    opacity: '0',
    transition: 'transform 240ms ease, opacity 240ms ease',
  });

  const colors = {
    success: 'linear-gradient(90deg,#16a34a,#059669)',
    error: 'linear-gradient(90deg,#ef4444,#dc2626)',
    info: 'linear-gradient(90deg,#2563eb,#0ea5e9)',
  };

  el.style.background = colors[type] || colors.info;

  const msg = document.createElement('div');
  msg.style.flex = '1 1 auto';
  msg.style.fontSize = '14px';
  msg.style.lineHeight = '1.2';
  msg.textContent = text;

  const btn = document.createElement('button');
  btn.innerHTML = '✕';
  Object.assign(btn.style, {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.9)',
    cursor: 'pointer',
    padding: '4px',
    fontSize: '14px',
    lineHeight: '1',
  });

  btn.addEventListener('click', () => dismiss(el));

  el.appendChild(msg);
  el.appendChild(btn);
  container.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = 'translateY(0)';
    el.style.opacity = '1';
  });

  let hideTimeout = setTimeout(() => dismiss(el), duration);

  function dismiss(node) {
    clearTimeout(hideTimeout);
    node.style.transform = 'translateY(-10px)';
    node.style.opacity = '0';
    node.style.transition = 'transform 180ms ease, opacity 180ms ease';
    setTimeout(() => {
      if (node && node.parentElement) node.parentElement.removeChild(node);
      if (
        container &&
        container.children.length === 0 &&
        container.parentElement
      ) {
        container.parentElement.removeChild(container);
      }
    }, 220);
  }

  el.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
  el.addEventListener(
    'mouseleave',
    () => (hideTimeout = setTimeout(() => dismiss(el), 1500))
  );
}

export function toggleLoading(status) {
  let loader = document.getElementById('global-loader');

  if (status === 'ativar') {
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'global-loader';
      loader.className =
        'fixed inset-0 z-[9999] flex items-center justify-center bg-black/40';

      loader.innerHTML = `
        <div class="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      `;

      document.body.appendChild(loader);
    }
  }

  if (status === 'desativar' && loader) {
    loader.remove();
  }
}
