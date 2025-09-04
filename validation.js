document.addEventListener('DOMContentLoaded', () => {
  const inicioRequired = [
    'manifesto','placa','qtdEntregas','qtdCidades','cidadesDistantes','kmInicial'
  ];
  const fimRequired = [
    'qtdDevolucoes','kmFinal'
  ];

  const btnEnviarInicio = document.getElementById('btnEnviarInicio');
  const btnFinalEnviar = document.getElementById('btnFinalEnviar');

  function checkInicio() {
    const fotoOk = !!(window.state?.inicio?.fotoDataUrl);
    const geoOk = !!(window.state?.inicio?.geo?.lat);
    const fieldsOk = inicioRequired.every(id => {
      const el = document.getElementById(id);
      return el && el.value.trim() !== '';
    });
    btnEnviarInicio.disabled = !(fieldsOk && fotoOk && geoOk);
  }

  function checkFim() {
    const fotoOk = !!(window.state?.fim?.fotoDataUrl);
    const geoOk = !!(window.state?.fim?.geo?.lat);
    const fieldsOk = fimRequired.every(id => {
      const el = document.getElementById(id);
      return el && el.value.trim() !== '';
    });
    btnFinalEnviar.disabled = !(fieldsOk && fotoOk && geoOk);
  }

  // Observe all inputs
  [...inicioRequired.map(id => document.getElementById(id)), 
   document.getElementById('fotoInicio')].forEach(el => {
    if (el) el.addEventListener('input', checkInicio);
    if (el) el.addEventListener('change', checkInicio);
  });

  [...fimRequired.map(id => document.getElementById(id)), 
   document.getElementById('fotoFim')].forEach(el => {
    if (el) el.addEventListener('input', checkFim);
    if (el) el.addEventListener('change', checkFim);
  });

  // Also recheck after geolocation updates
  const originalCaptureGeo = window.captureGeo;
  if (typeof originalCaptureGeo === 'function') {
    window.captureGeo = async function(section) {
      await originalCaptureGeo(section);
      if (section === 'inicio') checkInicio();
      if (section === 'fim') checkFim();
    }
  }

  checkInicio();
  checkFim();
});
