import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';

import Navigation from '../components/navigation';
import Footer1 from '../components/footer1';
import './homepage.css';

/**
 * Em dev:
 *  - Suba o backend:  uvicorn app.main:app --reload --port 8000
 *  - Se quiser evitar CORS, no package.json (raiz) adicione: "proxy": "http://127.0.0.1:8000"
 *  - Aí pode trocar API_BASE para '' e fazer fetch('/process')
 */
const API_BASE =
  process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : ''; // ajuste em produção

const Homepage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const emailTextareaRef = useRef(null);

  // refs dos elementos de saída
  const statusRef = useRef(null);
  const outCategoryRef = useRef(null);
  const outConfidenceRef = useRef(null);
  const outSuggestedRef = useRef(null);
  const processBtnRef = useRef(null);
  const uploadAreaRef = useRef(null);

  useEffect(() => {
    const uploadArea = uploadAreaRef.current;
    const fileInput = fileInputRef.current;

    if (uploadArea) {
      // click para abrir seletor de arquivo
      uploadArea.addEventListener('click', () => {
        fileInput?.click();
      });

      // drag & drop
      const onDragOver = (e) => {
        e.preventDefault();
        uploadArea.classList.add('is-dragover');
      };
      const onDragLeave = (e) => {
        e.preventDefault();
        uploadArea.classList.remove('is-dragover');
      };
      const onDrop = (e) => {
        e.preventDefault();
        uploadArea.classList.remove('is-dragover');
        const file = e.dataTransfer?.files?.[0];
        if (file) {
          if (!/\.(pdf|txt)$/i.test(file.name)) {
            alert('Formatos suportados: .pdf, .txt');
            return;
          }
          if (file.size > 5 * 1024 * 1024) {
            alert('Arquivo acima de 5MB.');
            return;
          }
          setSelectedFile(file);
          // feedback visual
          uploadArea.querySelector('.demo-upload-subtitle')?.classList.add('hidden');
          uploadArea.querySelector('.demo-upload-formats')?.classList.add('hidden');
          const title = uploadArea.querySelector('.demo-upload-title');
          if (title) title.textContent = `Selecionado: ${file.name}`;
        }
      };

      uploadArea.addEventListener('dragover', onDragOver);
      uploadArea.addEventListener('dragleave', onDragLeave);
      uploadArea.addEventListener('drop', onDrop);

      return () => {
        uploadArea.removeEventListener('dragover', onDragOver);
        uploadArea.removeEventListener('dragleave', onDragLeave);
        uploadArea.removeEventListener('drop', onDrop);
      };
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (!/\.(pdf|txt)$/i.test(file.name)) {
      alert('Formatos suportados: .pdf, .txt');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo acima de 5MB.');
      return;
    }
    setSelectedFile(file);
    // feedback visual
    if (uploadAreaRef.current) {
      uploadAreaRef.current.querySelector('.demo-upload-subtitle')?.classList.add('hidden');
      uploadAreaRef.current.querySelector('.demo-upload-formats')?.classList.add('hidden');
      const title = uploadAreaRef.current.querySelector('.demo-upload-title');
      if (title) title.textContent = `Selecionado: ${file.name}`;
    }
  };

  const handleCopy = async () => {
    const node = outSuggestedRef.current;
    const text = node?.innerText || node?.value || '';
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      alert('Resposta copiada!');
    } catch {
      alert('Não foi possível copiar.');
    }
  };

  const handleProcess = async () => {
    const btn = processBtnRef.current;
    const statusEl = statusRef.current;
    const outCat = outCategoryRef.current;
    const outConf = outConfidenceRef.current;
    const outSug = outSuggestedRef.current;
    const text = emailTextareaRef.current?.value?.trim() || '';

    if (!text && !selectedFile) {
      alert('Envie um arquivo .pdf/.txt ou cole um texto.');
      return;
    }

    // UI: loading
    if (btn) {
      btn.disabled = true;
      btn.classList.add('is-loading');
      btn.innerText = 'Processando...';
    }
    if (statusEl) {
      statusEl.classList.add('active');
      statusEl.innerHTML = '<span class="demo-status-dot"></span><span>Processando...</span>';
    }

    try {
      const form = new FormData();
      if (selectedFile) form.append('file', selectedFile);
      if (text) form.append('text', text);

      const res = await fetch(`${API_BASE}/process`, { method: 'POST', body: form });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();

      if (outCat) outCat.textContent = data.category || '—';
      if (outConf) outConf.textContent = data.confidence != null ? `${(data.confidence * 100).toFixed(0)}%` : '—';
      if (outSug) {
        // se for <div>, usa textContent/innerHTML; se for <textarea>, usa value
        if ('value' in outSug) outSug.value = data.suggested_response || '';
        else outSug.innerText = data.suggested_response || '';
      }

      if (statusEl) {
        statusEl.innerHTML = '<span class="demo-status-dot"></span><span>Análise concluída</span>';
      }
    } catch (e) {
      alert(e?.message || 'Falha ao processar');
      if (statusEl) {
        statusEl.innerHTML = '<span class="demo-status-dot"></span><span>Erro ao processar</span>';
      }
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('is-loading');
        btn.innerText = 'Processar E-mail';
      }
    }
  };

  return (
    <div className="homepage-container1">
      <Helmet>
        <title>Email Classifier AI</title>
        <meta property="og:title" content="Email Classifier AI" />
      </Helmet>

      <Navigation rootClassName="navigationroot-class-name" />

      {/* HERO */}
      <section id="hero-section" className="hero-wrapper">
        <video
          src="https://videos.pexels.com/video-files/34127955/14471454_640_360_30fps.mp4"
          loop
          muted
          autoPlay
          aria-hidden="true"
          playsInline
          className="hero-background-video"
        />
        <div className="hero-overlay" />
        <div className="hero-content-container">
          <div className="hero-grid">
            <div className="hero-text-content">
              <div className="hero-badge">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594zM20 2v4m2-2h-4" />
                    <circle r="2" cx="4" cy="20" />
                  </g>
                </svg>
                <span>Powered by AI</span>
              </div>
              <h1 className="hero-title">Email Classifier AI</h1>
              <p className="hero-subtitle">
                Automatize a leitura e classificação de e-mails com inteligência artificial
              </p>
              <div className="hero-cta-group">
                <button className="btn btn-lg btn-primary" onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}>
                  Testar Agora
                </button>
                <a className="btn-outline btn btn-lg" href="https://github.com/" target="_blank" rel="noreferrer">
                  Ver no GitHub
                </a>
              </div>
              <div className="hero-stats">
                <div className="hero-stat-item">
                  <div className="hero-stat-value"><span>93%</span></div>
                  <div className="hero-stat-label"><span>Precisão</span></div>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat-item">
                  <div className="hero-stat-value"><span>2.5s</span></div>
                  <div className="hero-stat-label"><span>Tempo médio</span></div>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat-item">
                  <div className="hero-stat-value"><span>100%</span></div>
                  <div className="hero-stat-label"><span>Automático</span></div>
                </div>
              </div>
            </div>

            {/* cartão de visual */}
            <div className="hero-visual-content">
              <div className="hero-demo-card">
                <div className="hero-demo-header">
                  <div className="hero-demo-dots">
                    <span className="hero-demo-dot" />
                    <span className="hero-demo-dot" />
                    <span className="hero-demo-dot" />
                  </div>
                  <div className="hero-demo-title"><span>Email Processing</span></div>
                </div>
                <div className="hero-demo-body">
                  <div className="hero-demo-email">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m22 7l-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                        <rect x="2" y="4" rx="2" width="20" height="16" />
                      </g>
                    </svg>
                    <span>Analisando e-mail...</span>
                  </div>
                  <div className="hero-demo-progress"><div className="hero-demo-progress-bar" /></div>
                  <div className="hero-demo-result">
                    <div className="demo-result-label"><span>Classificação</span></div>
                    <div className="demo-result-value"><span>Produtivo</span></div>
                    <div className="demo-result-confidence">
                      <svg width="16" height="16" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span>93% confiança</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>{/* /visual */}
          </div>
        </div>
        <div className="hero-glow-effect" />
      </section>

      {/* COMO FUNCIONA */}
      <section id="how-it-works-section" className="how-it-works-wrapper">
        {/* ... mantém seu conteúdo como está ... */}
      </section>

      {/* DEMO REAL */}
      <section id="demo-section" className="demo-wrapper">
        <div className="demo-container">
          <div className="section-header">
            <h2 className="section-title">Demonstração Interativa</h2>
            <p className="section-subtitle">Experimente o classificador em ação</p>
          </div>

          <div className="demo-grid">
            {/* Painel de entrada */}
            <div className="demo-input-panel">
              <div id="demo-upload-area" ref={uploadAreaRef} className="demo-upload-area" role="button" tabIndex={0}>
                <svg width="48" height="48" viewBox="0 0 24 24">
                  <path d="M12 3v12m5-7l-5-5l-5 5m14 7v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="demo-upload-title">Arraste seu arquivo aqui</h3>
                <p className="demo-upload-subtitle">Ou clique para selecionar</p>
                <p className="demo-upload-formats">PDF ou TXT • Máx 5MB</p>
                {/* input oculto para selecionar arquivo por clique */}
                <input
                  id="demo-file-input"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>

              <div className="demo-divider"><span>ou</span></div>

              <div className="demo-textarea-wrapper">
                <label className="demo-label" htmlFor="demo-email-input">Cole o conteúdo do e-mail</label>
                <textarea
                  id="demo-email-input"
                  ref={emailTextareaRef}
                  rows="8"
                  placeholder="Cole aqui o texto do e-mail para classificação..."
                  className="demo-textarea"
                />
              </div>

              <button
                id="demo-process-btn"
                ref={processBtnRef}
                className="demo-process-btn btn btn-lg btn-primary"
                onClick={handleProcess}
                type="button"
              >
                ⚡ Processar E-mail
              </button>
            </div>

            {/* Painel de saída */}
            <div id="demo-output-panel" className="demo-output-panel">
              <div className="demo-output-header">
                <h3 className="demo-output-title">Resultado da Análise</h3>
                <div id="demo-status" ref={statusRef} className="demo-status">
                  <span className="demo-status-dot" />
                  <span>Aguardando entrada</span>
                </div>
              </div>

              <div id="demo-results" className="demo-results">
                <div className="demo-result-card">
                  <div className="demo-result-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle r="10" cx="12" cy="12" />
                        <circle r="6" cx="12" cy="12" />
                        <circle r="2" cx="12" cy="12" />
                      </g>
                    </svg>
                  </div>
                  <div className="demo-result-content">
                    <div className="demo-result-label"><span>Classificação</span></div>
                    <div id="demo-classification" ref={outCategoryRef} className="demo-result-value"><span>—</span></div>
                  </div>
                </div>

                <div className="demo-result-card">
                  <div className="demo-result-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className="demo-result-content">
                    <div className="demo-result-label"><span>Confiança</span></div>
                    <div id="demo-confidence" ref={outConfidenceRef} className="demo-result-value"><span>—</span></div>
                  </div>
                </div>
              </div>

              <div id="demo-response-area" className="demo-response-area">
                <div className="demo-response-header">
                  <span className="demo-response-label">Resposta Sugerida</span>
                  <button id="demo-copy-btn" className="demo-copy-btn" type="button" onClick={handleCopy}>
                    Copiar
                  </button>
                </div>
                <div id="demo-response-content" ref={outSuggestedRef} className="demo-response-content">
                  <p>A resposta sugerida aparecerá aqui após o processamento...</p>
                </div>
              </div>
            </div>{/* /output */}
          </div>
        </div>
        <div className="demo-glow-effect" />
      </section>

      {/* BENEFÍCIOS e SOBRE (mantém seus blocos originais) */}
      <section id="benefits-section" className="benefits-wrapper">{/* ... */}</section>
      <section id="about-section" className="about-wrapper">{/* ... */}</section>

      <Footer1 />
    </div>
  );
};

export default Homepage;
