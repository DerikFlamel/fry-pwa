document.addEventListener('DOMContentLoaded', () => {
  // Config for mandatory fields
  const inicioRequired = [
    'manifesto', 'placa', 'qtdEntregas', 'qtdCidades',
    'cidadesDistantes', 'kmInicial'
  ];
  const fimRequired = ['qtdDevolucoes', 'kmFinal'];

  const btnInicio = document.getElementById('btnEnviarInicio');
  const btnFim = document.getElementById('btnFinalEnviar');

  function isFilled(id) {
    const el = document.getElementById(id);
    return el && el.value.trim() !== '';
  }

  function hasPhoto(section) {
    const state = JSON.parse(localStorage.getItem('frz_state_v1') || '{}');
    return section === 'inicio'
      ? !!state.inicio?.fotoDataUrl
      : !!state.fim?.fotoDataUrl;
  }

  function hasGeo(section) {
    const state = JSON.parse(localStorage.getItem('frz_state_v1') || '{}');
    return section === 'inicio'
      ? !!state.inicio?.geo?.lat
      : !!state.fim?.geo?.lat;
  }

  function validateInicio() {
    const allFilled = inicioRequired.every(isFilled);
    const photoOK = hasPhoto('inicio');
    const geoOK = hasGeo('inicio');
    btnInicio.disabled = !(allFilled && photoOK && geoOK);
  }

  function validateFim() {
    const allFilled = fimRequired.every(isFilled);
    const photoOK = hasPhoto('fim');
    const geoOK = hasGeo('fim');
    btnFim.disabled = !(allFilled && photoOK && geoOK);
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

  // Watch photo changes
  document.getElementById('fotoInicio')?.addEventListener('change', validateInicio);
  document.getElementById('fotoFim')?.addEventListener('change', validateFim);

  // Run validation on load (in case of cached state)
  validateInicio();
  validateFim();
});
