document.addEventListener('DOMContentLoaded', () => {
  const inicioRequired = [
    'manifesto', 'placa', 'qtdEntregas', 'qtdCidades',
    'cidadesDistantes', 'kmInicial'
  ];
  const fimRequired = ['qtdDevolucoes', 'kmFinal'];

  const btnInicio = document.getElementById('btnEnviarInicio');
  const btnFim = document.getElementById('btnFinalEnviar');

  function getState() {
    try {
      return JSON.parse(localStorage.getItem('frz_state_v1')) || {};
    } catch {
      return {};
    }
  }

  function isFilled(id) {
    const el = document.getElementById(id);
    return el && el.value.trim() !== '';
  }

  function hasPhoto(section) {
    const state = getState();
    return section === 'inicio'
      ? !!state.inicio?.fotoDataUrl
      : !!state.fim?.fotoDataUrl;
  }

  function hasGeo(section) {
    const state = getState();
    return section === 'inicio'
      ? !!state.inicio?.geo?.lat
      : !!state.fim?.geo?.lat;
  }

  function validateInicio() {
    const allFilled = inicioRequired.every(isFilled);
    btnInicio.disabled = !(allFilled && hasPhoto('inicio') && hasGeo('inicio'));
  }

  function validateFim() {
    const allFilled = fimRequired.every(isFilled);
    btnFim.disabled = !(allFilled && hasPhoto('fim') && hasGeo('fim'));
  }

  // Automatic geolocation request
  async function requestLocation(section) {
    if (!navigator.geolocation) return;

    const geoEl = section === 'inicio'
      ? document.getElementById('geoInicio')
      : document.getElementById('geoFim');

    if (geoEl) geoEl.textContent = 'Obtendo localização…';

    navigator.geolocation.getCurrentPosition(
      async pos => {
        const coords = {
          lat: Math.round(pos.coords.latitude * 100000) / 100000,
          lon: Math.round(pos.coords.longitude * 100000) / 100000,
          acc: Math.round(pos.coords.accuracy || 0)
        };
        const state = getState();
        if (!state[section]) state[section] = {};
        state[section].geo = coords;
        localStorage.setItem('frz_state_v1', JSON.stringify(state));

        if (geoEl) {
          geoEl.textContent = `Lat: ${coords.lat}, Lon: ${coords.lon} ±${coords.acc}m`;
        }

        if (section === 'inicio') validateInicio();
        else validateFim();
      },
      err => {
        console.error('Erro ao obter geolocalização:', err);
        if (geoEl) geoEl.textContent = 'Localização indisponível (verifique permissões)';
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  // Attach listeners for all relevant fields
  inicioRequired.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', validateInicio);
  });
  fimRequired.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', validateFim);
  });

  document.getElementById('fotoInicio')?.addEventListener('change', () => {
    requestLocation('inicio');
    validateInicio();
  });
  document.getElementById('fotoFim')?.addEventListener('change', () => {
    requestLocation('fim');
    validateFim();
  });

  // Request location immediately when screens load
  requestLocation('inicio');
  requestLocation('fim');

  // Initial validation
  validateInicio();
  validateFim();
});
