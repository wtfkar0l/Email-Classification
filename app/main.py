import os
import re
import time
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from starlette.responses import JSONResponse

# ----- OpenAI (client oficial) -----
# pip install openai>=1.0.0
from openai import OpenAI

# ----- NLP utilitário simples (sem dependências pesadas) -----
# Se quiser usar spaCy/pt_core_news_sm, basta descomentar e ajustar:
# import spacy
# nlp = spacy.load("pt_core_news_sm")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY não está definida. Configure-a no ambiente ou no GitHub Actions.")

if not OPENAI_API_KEY:
  print("[WARN] OPENAI_API_KEY não definido no ambiente.")
client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI(title="Email Classifier AutoU", version="0.1.0")

# Libera CORS para front rodando localmente ou em cloud
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ajuste para seu domínio em produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Helpers: leitura e limpeza
# -------------------------------
ALLOWED_EXT = {".txt", ".pdf"}
STOPWORDS_PT = {
    "a", "o", "as", "os", "de", "da", "do", "das", "dos", "e", "é", "em", "para",
    "por", "com", "na", "no", "nas", "nos", "um", "uma", "uns", "umas", "ao", "à",
    "se", "que", "qual", "quais", "sobre", "sem", "até", "entre"
}
STOPWORDS_EN = {
    "the", "a", "an", "and", "or", "for", "to", "in", "on", "of", "is", "are",
    "as", "by", "with", "at", "from", "this", "that", "these", "those"
}
STOPWORDS = STOPWORDS_PT | STOPWORDS_EN

def read_txt_bytes(b: bytes) -> str:
    try:
        return b.decode("utf-8", errors="ignore")
    except Exception:
        return b.decode("latin-1", errors="ignore")

def read_pdf_bytes(b: bytes) -> str:
    # Leitura simples via pdfminer.six (recomendado no requirements)
    # pip install pdfminer.six
    try:
        from io import BytesIO
        from pdfminer.high_level import extract_text
        return extract_text(BytesIO(b))
    except Exception:
        return ""

HTML_TAG_RE = re.compile(r"<[^>]+>")
MULTISPACE_RE = re.compile(r"\s+")

def basic_clean(text: str) -> str:
    text = text.replace("\r", " ").replace("\n", " ").strip()
    text = HTML_TAG_RE.sub(" ", text)
    text = MULTISPACE_RE.sub(" ", text)
    return text

def normalize_and_filter(text: str) -> str:
    text = text.lower()
    tokens = re.findall(r"[a-zA-ZÀ-ÿ0-9#]+", text)
    tokens = [t for t in tokens if t not in STOPWORDS and len(t) > 1]
    return " ".join(tokens)

# -------------------------------
# Prompt de classificação + resposta
# -------------------------------
SYSTEM_PROMPT = """Você é um assistente para triagem de e-mails corporativos no setor financeiro.
Classifique cada e-mail como 'Produtivo' (requer ação/resposta) ou 'Improdutivo' (não requer).
Retorne JSON estrito no formato:
{
  "category": "Produtivo" | "Improdutivo",
  "confidence": 0.0-1.0,
  "suggested_response": "string concisa e educada em pt-BR"
}
A resposta sugerida deve ser útil e prática. Não inclua código, nem formatação Markdown.
"""

USER_FMT = """E-MAIL ORIGINAL:

{original}

INDÍCIOS PRÉ-PROCESSADOS (para contexto do classificador):

{signals}

Regras:
- Se pedir status de chamado, suporte ou ação -> Produtivo.
- Se for apenas felicitação, agradecimento, correntes -> Improdutivo.
- Confidence: 0 a 1. Não use strings, apenas número.
- suggested_response: escreva em pt-BR, tom profissional objetivo.
"""

# -------------------------------
# Modelos de entrada/saída (pydantic)
# -------------------------------
class ProcessResponse(BaseModel):
    category: str
    confidence: float
    suggested_response: str
    processing_time: float
    metadata: dict

# -------------------------------
# Core: processar texto
# -------------------------------
def classify_and_respond(text: str) -> ProcessResponse:
    t0 = time.time()
    original = basic_clean(text)
    if not original:
        raise HTTPException(status_code=400, detail="Texto vazio após limpeza.")

    signals = normalize_and_filter(original)

    # Heurística simples (fallback): detectar sinais de produtividade
    heur_prod = any(k in signals for k in [
        "status", "chamado", "ticket", "suporte", "atualizacao", "atualização",
        "erro", "problema", "anexo", "fatura", "contrato", "prazo", "deadline",
        "urgente", "reunião", "reuniao", "agendar", "solicito", "solicitação", "solicitacao"
    ])

    # Chamada OpenAI para confirmar/gerar resposta
    try:
        completion = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": USER_FMT.format(original=original[:6000], signals=signals[:6000])}
            ],
            timeout=30,
        )
        content = completion.choices[0].message.content
    except Exception as e:
        # Fallback em caso de indisponibilidade da API
        category = "Produtivo" if heur_prod else "Improdutivo"
        suggested = (
            "Olá, obrigado pelo contato. Já registrei sua solicitação e retornarei com uma atualização em breve."
            if heur_prod else
            "Olá, obrigado pela mensagem! Ficamos à disposição."
        )
        dt = time.time() - t0
        return ProcessResponse(
            category=category,
            confidence=0.65 if heur_prod else 0.55,
            suggested_response=suggested,
            processing_time=round(dt, 3),
            metadata={
                "timestamp": datetime.utcnow().isoformat(),
                "text_length": len(original),
                "processed_length": len(signals),
                "source": "fallback-heuristic",
            }
        )

    # Parse JSON da IA
    import json
    try:
        parsed = json.loads(content)
        category = parsed.get("category", "Improdutivo")
        confidence = float(parsed.get("confidence", 0.6))
        suggested = parsed.get("suggested_response", "").strip()
    except Exception:
        # fallback de parsing
        category = "Produtivo" if heur_prod else "Improdutivo"
        confidence = 0.65 if heur_prod else 0.55
        suggested = (
            "Olá, obrigado pelo contato. Já registrei sua solicitação e retornarei com uma atualização em breve."
            if heur_prod else
            "Olá, obrigado pela mensagem! Ficamos à disposição."
        )

    dt = time.time() - t0
    return ProcessResponse(
        category=category,
        confidence=max(0.0, min(1.0, confidence)),
        suggested_response=suggested,
        processing_time=round(dt, 3),
        metadata={
            "timestamp": datetime.utcnow().isoformat(),
            "text_length": len(original),
            "processed_length": len(signals),
            "source": "openai",
        }
    )

# -------------------------------
# Rota principal
# -------------------------------
@app.post("/process", response_model=ProcessResponse)
async def process_email(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None),
):
    if not file and not text:
        raise HTTPException(status_code=400, detail="Envie um arquivo (.txt/.pdf) ou o campo 'text'.")

    content = ""
    filename = None

    if file:
        filename = file.filename or "upload"
        ext = "." + filename.split(".")[-1].lower() if "." in filename else ""
        raw = await file.read()

        if ext not in ALLOWED_EXT:
            raise HTTPException(status_code=400, detail=f"Extensão não suportada: {ext}. Use .txt ou .pdf")

        if ext == ".txt":
            content = read_txt_bytes(raw)
        elif ext == ".pdf":
            content = read_pdf_bytes(raw)

    if text and not content:
        content = text

    if not content or not content.strip():
        raise HTTPException(status_code=400, detail="Conteúdo vazio.")

    result = classify_and_respond(content)

    # adiciona info de arquivo (se houver)
    if filename:
        result.metadata["filename"] = filename

    return JSONResponse(result.model_dump())
