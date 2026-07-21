# 🔑 CHECKLIST COMPLETO DE CUENTAS Y APIs — KAIZEN PROJECT'S IA

> **Ordenado por prioridad:** Primero lo que necesitas para arrancar  
> **Tiempo total estimado:** 45-60 minutos  
> **Costo total:** $0 (solo requiere tarjeta de crédito para verificar identidad en algunos servicios)

---

## 🎯 ANTES DE EMPEZAR

Ten a mano:
- ✅ Una cuenta de Google (Gmail) — la usarás para múltiples servicios
- ✅ Una tarjeta de crédito/débito — muchos free tiers la piden para verificar identidad (no cobran)
- ✅ Un bloc de notas o gestor de contraseñas para guardar las API keys
- ✅ Un nombre para tu proyecto (ej: `kaizen-project`, `kaizen-ai`, etc.)

---

# 📋 NIVEL 1 — CUENTAS ESENCIALES (Día 1)
> Estas las necesitas SÍ o SÍ para empezar a construir.

---

## 1️⃣ GitHub — Código fuente y CI/CD

**⏱️ Tiempo:** 5 minutos  
**🎯 Propósito:** Repositorio de código, control de versiones, CI/CD (GitHub Actions)

### Pasos:
```
[ ] 1. Ve a https://github.com
[ ] 2. Haz clic en "Sign up"
[ ] 3. Ingresa:
     - Email: tu-email@gmail.com
     - Password: (usa un password manager)
     - Username: (ej: tunombre-kaizen)
[ ] 4. Confirma tu email (te llega un código)
[ ] 5. Selecciona "Free" plan (evita el "Pro" trial)
[ ] 6. En Settings → Developer settings → Personal access tokens:
     - "Tokens (classic)"
     - "Generate new token (classic)"
     - Nombre: "kaizen-deploy"
     - Scopes: repo, workflow, admin:org (selecciona todo)
     - "Generate token"
     - 🔴 GUARDA EL TOKEN AHORA (no lo verás después)
```

**📥 Qué guardar en tu gestor de contraseñas:**
```
Sitio: github.com
Usuario: tunombre-kaizen
Password: (la que creaste)
Token: ghp_xxxxxxxxxxxxxxxxxxxxxx (token de acceso personal)
```

**✅ Verificación:** `https://github.com/tunombre-kaizen` debe cargar sin errores

---

## 2️⃣ Supabase — Base de datos + Auth + Storage + Vectores

**⏱️ Tiempo:** 15 minutos  
**🎯 Propósito:** PostgreSQL, autenticación, almacenamiento de archivos, vectores (pgvector)

### Pasos:
```
[ ] 1. Ve a https://supabase.com
[ ] 2. "Start your project" → "Sign in with GitHub"
     ⚠️ USA GITHUB PARA LOGIN (más fácil)
[ ] 3. Autoriza a Supabase a acceder a tu GitHub
[ ] 4. Una vez dentro, haz clic en "New project"
[ ] 5. Completa:
     - Name: kaizen-project (o el nombre que elegiste)
     - Database Password: Crea una contraseña SEGURA (16+ chars)
         Ej: K@iz3nPr0j3ct!2026$ecur3
     - Region: US East (N. Virginia) — cerca de Vercel
     - Pricing Plan: Free
[ ] 6. Espera 1-2 minutos mientras se crea la base de datos
[ ] 7. Ve a Project Settings → API → "Project API keys"
[ ] 8. COPIA ESTOS 3 VALORES (los necesitarás para el .env.local):

     ┌─────────────────────────────────────────────────────────┐
     │ 🔑 Project URL (anon)                                  │
     │    https://xxxxxxxxxxxxx.supabase.co                    │
     │                                                         │
     │ 🔑 anon public key                                     │
     │    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...             │
     │                                                         │
     │ 🔒 service_role key (¡NUNCA compartir!)                │
     │    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...             │
     └─────────────────────────────────────────────────────────┘

[ ] 9. Ve a SQL Editor y ejecuta este comando para verificar:
     SELECT 'Supabase funcionando!' as mensaje;
     → Deberías ver: "Supabase funcionando!"

[ ] 10. Ve a Authentication → Settings → confirmar:
      - EMAIL: "Confirm email" = ON (por defecto)
      - Google: "Enable" = ON, luego configura:
        * Client ID (lo obtienes de Google Cloud Console - paso 2b)
        * Client Secret (lo obtienes de Google Cloud Console)

[ ] 11. (OPCIONAL) Ve a Storage → "New bucket":
      - Name: documents
      - Public: OFF
      - "Create bucket"
```

### 📌 Nota sobre Google Auth en Supabase:
Para activar login con Google necesitas también crear un proyecto en Google Cloud:
```
[ ] 1. Ve a https://console.cloud.google.com
[ ] 2. Crea un proyecto nuevo: "kaizen-auth"
[ ] 3. APIs & Services → OAuth consent screen → External → Create
[ ] 4. Authorized JavaScript origins: http://localhost:3000 (después agrega tu Vercel URL)
[ ] 5. Authorized redirect URIs: https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
[ ] 6. Credentials → Create Credentials → OAuth 2.0 Client IDs → Web application
[ ] 7. Copia el Client ID y Client Secret
[ ] 8. Pégalos en Supabase: Authentication → Providers → Google
```

**📥 Qué guardar:**
```
Sitio: supabase.com/project/xxxxxxxx
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon key: eyJhbGciOiJIUzI1NiIs...
service_role key: eyJhbGciOiJIUzI1NiIs...
DB Password: K@iz3nPr0j3ct!2026$ecur3
```

**✅ Verificación:** `Settings → API → Project URL` debe cargar sin errores

---

## 3️⃣ Google AI Studio — Gemini API (LLM principal)

**⏱️ Tiempo:** 5 minutos  
**🎯 Propósito:** Modelo de IA gratuito para chat, agentes y análisis (Gemini 2.0 Flash)

### Pasos:
```
[ ] 1. Ve a https://aistudio.google.com
[ ] 2. Inicia sesión con tu cuenta de Google (Gmail)
[ ] 3. Acepta los términos de servicio
[ ] 4. Haz clic en "Get API Key" (botón en la parte superior)
[ ] 5. En la nueva página, haz clic en "Create API Key"
[ ] 6. Selecciona o crea un proyecto en Google Cloud:
     - "Create new project" → "kaizen-gemini"
[ ] 7. COPIA LA API KEY:

     ┌─────────────────────────────────────────────────────────┐
     │ API Key: AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx      │
     └─────────────────────────────────────────────────────────┘

[ ] 8. Para verificar que funciona, abre esta URL en el navegador:
     https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyB...tu-api-key

     → Deberías ver un JSON con la lista de modelos disponibles
```

⚠️ **IMPORTANTE:**
- Tiene límite de 60 requests/minuto (suficiente para desarrollo y ~5 usuarios concurrentes)
- Nunca compartas esta API key públicamente
- Si la necesitas rotar, puedes crear una nueva desde la misma página

**📥 Qué guardar:**
```
Sitio: aistudio.google.com
Project: kaizenprojectsai
GEMINI_API_KEY: AQ.Ab8RN6IdejjufYxq_IM_cYVZwHiaMBTkdHJdFrjnEtF6w-Dzxg
```

**✅ Verificación:** La URL https://generativelanguage.googleapis.com/... devuelve JSON con modelos

---

## 4️⃣ Vercel — Hosting y deployment

**⏱️ Tiempo:** 5 minutos  
**🎯 Propósito:** Hosting gratuito del frontend y API (Next.js)

### Pasos:
```
[ ] 1. Ve a https://vercel.com
[ ] 2. "Sign Up" → "Continue with GitHub"
[ ] 3. Autoriza Vercel a acceder a tu GitHub
[ ] 4. Completa tu perfil:
     - Name: tu nombre
     - What's the goal: "Personal project"
[ ] 5. Ya tienes la cuenta. Por ahora no necesitas crear más.

[ ] 6. (Para después, cuando tengas el código listo)
     Ve a https://vercel.com/account/tokens
     "Create Token" → nombre: "kaizen-ci" → scope: "full"
     COPIA: VERCEL_TOKEN = xxxxxx

[ ] 7. Para obtener el VERCEL_ORG_ID y VERCEL_PROJECT_ID:
     (se obtienen al hacer el primer deploy - documentado en FASE 1)
```

**📥 Qué guardar:**
```
Sitio: vercel.com
Cuenta conectada a: GitHub
VERCEL_TOKEN: (lo obtienes después)
```

**✅ Verificación:** Puedes entrar a `vercel.com/dashboard` y ver tu dashboard

---

# 📋 NIVEL 2 — MUY RECOMENDADAS (Semana 1-2)
> Estas no son estrictamente necesarias el día 1, pero las necesitarás pronto.

---

## 5️⃣ OpenRouter — Fallback de modelos de IA

**⏱️ Tiempo:** 5 minutos  
**🎯 Propósito:** Acceso gratuito a múltiples modelos como respaldo cuando Gemini tenga límites

### Pasos:
```
[ ] 1. Ve a https://openrouter.ai
[ ] 2. "Sign Up" → usa "Continue with Google" (tu misma cuenta)
[ ] 3. Una vez dentro, ve a "Keys" → "Create Key"
[ ] 4. Dale un nombre: "kaizen-fallback"
[ ] 5. COPIA LA API KEY:

     ┌─────────────────────────────────────────────────────────┐
     │ Key: sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │
     └─────────────────────────────────────────────────────────┘

[ ] 6. Ve a "Models" → filtra por "Free" para ver los modelos gratuitos disponibles
     (los nombres cambian, verifica los que están activos hoy)
```

⚠️ **NOTA:** OpenRouter cambia frecuentemente qué modelos son gratuitos. Al momento de escribir esto hay opciones como `meta-llama/llama-3.2-3b-instruct:free`. Verifica siempre los modelos gratuitos actuales en su página.

**📥 Qué guardar:**
```
Sitio: openrouter.ai
OPENROUTER_API_KEY: sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 6️⃣ Cloudflare — CDN, DNS, R2 Storage

**⏱️ Tiempo:** 10 minutos  
**🎯 Propósito:** Almacenamiento gratuito de documentos (10GB), CDN, DNS para dominio personalizado

### Pasos:
```
[ ] 1. Ve a https://dash.cloudflare.com
[ ] 2. "Sign Up" → usa tu email (o Google)
[ ] 3. Selecciona "Free" plan
[ ] 4. Confirma tu email

[ ] 5. Ve a R2 → "Create bucket" (para almacenar documentos):
     - Bucket name: kaizen-documents
     - Location: Automatic
     - "Create bucket"

[ ] 6. En R2 → "Manage R2 API Tokens":
     - "Create API Token"
     - Permission: "Admin Read & Write"
     - TTL: "No expiration"
     - COPIA:
       ┌─────────────────────────────────────────────────────────┐
       │ Access Key ID: xxxxxxxxxxxxxxxxxxxx                     │
       │ Secret Access Key: xxxxxxxxxxxxxxxxxxxxxx               │
       └─────────────────────────────────────────────────────────┘
       🔴 CIERRA ESTA VENTANA DESPUÉS DE COPIAR (no se muestra otra vez)
```

**📥 Qué guardar:**
```
Sitio: dash.cloudflare.com
R2 Bucket: kaizen-documents
R2 Access Key ID: xxxxxxxxxxxxxxxxxxxx
R2 Secret Access Key: xxxxxxxxxxxxxxxxxxxxxx
```

---

## 7️⃣ Sentry — Monitoreo de errores

**⏱️ Tiempo:** 5 minutos  
**🎯 Propósito:** Detectar errores en producción antes de que los usuarios los reporten

### Pasos:
```
[ ] 1. Ve a https://sentry.io
[ ] 2. "Get Started" → "Sign Up" → usa "Continue with Google"
[ ] 3. Completa: "Personal project" → "Next.js"
[ ] 4. En "Create Project", selecciona "Next.js" y dale nombre "kaizen-web"
[ ] 5. COPIA EL DSN:

     ┌─────────────────────────────────────────────────────────┐
     │ DSN: https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@sentry.io │
     │      /1234567                                           │
     └─────────────────────────────────────────────────────────┘

[ ] 6. Te mostrará instrucciones de instalación (puedes saltarlas por ahora)
```

⚠️ **Límite free:** 5,000 eventos de error por mes (suficiente para desarrollo y early adopters)

**📥 Qué guardar:**
```
Sitio: sentry.io
SENTRY_DSN: https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@sentry.io/1234567
```

---

## 8️⃣ PostHog — Product Analytics

**⏱️ Tiempo:** 5 minutos  
**🎯 Propósito:** Entender cómo usan los usuarios la plataforma (qué funciones usan más, dónde se quedan atascados)

### Pasos:
```
[ ] 1. Ve a https://us.posthog.com/signup
[ ] 2. "Continue with Google"
[ ] 3. Completa:
     - Company name: "KAIZEN Project"
     - How did you hear: "Other"
     - Size: "Just me"
[ ] 4. "Create project" → nombre: "kaizen"
[ ] 5. En "How to connect to PostHog" → copia:

     ┌─────────────────────────────────────────────────────────┐
     │ API Key: phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │
     │ Host: https://us.posthog.com                           │
     └─────────────────────────────────────────────────────────┘
```

⚠️ **Límite free:** 1,000,000 de eventos por mes (¡generoso!)

**📥 Qué guardar:**
```
Sitio: us.posthog.com
NEXT_PUBLIC_POSTHOG_KEY: phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST: https://us.posthog.com
```

---

# 📋 NIVEL 3 — OPCIONALES PERO ÚTILES (Semana 2-4)
> Estas las agregarás más adelante según necesites.

---

## 9️⃣ Groq — LLM alternativo ultra-rápido

**⏱️ Tiempo:** 5 minutos  
**🎯 Propósito:** Alternativa a Gemini cuando necesites velocidad (30 req/segundo)

### Pasos:
```
[ ] 1. Ve a https://console.groq.com
[ ] 2. "Sign In" → "Continue with Google"
[ ] 3. Ve a "API Keys" → "Create API Key"
[ ] 4. Nombre: "kaizen"
[ ] 5. COPIA:

     ┌─────────────────────────────────────────────────────────┐
     │ Key: gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   │
     └─────────────────────────────────────────────────────────┘
```

**📥 Qué guardar:**
```
GROQ_API_KEY: gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🔟 Resend — Emails transaccionales

**⏱️ Tiempo:** 5 minutos  
**🎯 Propósito:** Enviar emails (bienvenida, notificaciones, recuperación de contraseña)

### Pasos:
```
[ ] 1. Ve a https://resend.com
[ ] 2. "Sign Up" → "Continue with Google"
[ ] 3. Verifica tu dominio (o usa el sandbox @resend.dev para pruebas)
[ ] 4. Ve a "API Keys" → "Create API Key"
[ ] 5. COPIA:

     ┌─────────────────────────────────────────────────────────┐
     │ Key: re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    │
     └─────────────────────────────────────────────────────────┘
```

⚠️ **Límite free:** 100 emails/día

**📥 Qué guardar:**
```
RESEND_API_KEY: re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 1️⃣1️⃣ Hugging Face — Modelos open source

**⏱️ Tiempo:** 5 minutos  
**🎯 Propósito:** Acceder a modelos de IA open source adicionales

### Pasos:
```
[ ] 1. Ve a https://huggingface.co/join
[ ] 2. Crea cuenta con email o Google
[ ] 3. Ve a Settings → Access Tokens → "New token"
[ ] 4. Nombre: "kaizen" → Role: "read"
[ ] 5. COPIA:

     ┌─────────────────────────────────────────────────────────┐
     │ Token: hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  │
     └─────────────────────────────────────────────────────────┘
```

---

# 📋 NIVEL 4 — FUTURAS (Semana 3+)
> Para cuando el proyecto esté más avanzado.

---

## 1️⃣2️⃣ Upstash — Redis + Vector (caché)

**⏱️ Tiempo:** 5 minutos  
**🎯 Propósito:** Cachear respuestas de IA, sesiones, colas de procesamiento

### Pasos:
```
[ ] 1. Ve a https://console.upstash.com
[ ] 2. "Login" → "Continue with Google"
[ ] 3. "Create Database" → "Redis" → "Free"
[ ] 4. COPIA:

     ┌─────────────────────────────────────────────────────────┐
     │ UPSTASH_REDIS_REST_URL: https://xxxx.upstash.io        │
     │ UPSTASH_REDIS_REST_TOKEN: xxxxxx                       │
     └─────────────────────────────────────────────────────────┘
```

---

## 1️⃣3️⃣ Firecrawl — Web scraping (convocatorias)

**⏱️ Tiempo:** 5 minutos  
**🎯 Propósito:** Extraer información de páginas web de entidades gubernamentales (convocatorias)

### Pasos:
```
[ ] 1. Ve a https://www.firecrawl.dev
[ ] 2. "Sign Up" → "Continue with Google"
[ ] 3. Ve a "API Keys" → copia:

     ┌─────────────────────────────────────────────────────────┐
     │ Key: fc-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    │
     └─────────────────────────────────────────────────────────┘
```

⚠️ **Límite free:** 500 créditos/mes

---

# 📋 NIVEL 5 — EXTRAS (Semana 4+)

## 1️⃣4️⃣ Meilisearch — Búsqueda full-text avanzada

**⏱️ Tiempo:** 10 minutos  
**🎯 Propósito:** Búsqueda ultra-rápida en documentos y proyectos (self-hosted, gratuito)

### Pasos:
```
[ ] 1. Ve a https://www.meilisearch.com
[ ] 2. "Download" → "Get started for free"
[ ] 3. Para desarrollo local:
     ```bash
     brew install meilisearch  # Mac
     # o Docker:
     docker run -p 7700:7700 getmeili/meilisearch
     ```
[ ] 4. O usa Cloud version con 10GB gratis:
     https://cloud.meilisearch.com
```

---

# 📋 CHECKLIST RESUMEN — Para imprimir y marcar

```
NIVEL 1 — ESENCIALES (Día 1):
[ ] 1. GitHub → Usuario creado, token personal listo
[ ] 2. Supabase → Proyecto creado, URL + keys copiadas
[ ] 3. Google AI Studio → Gemini API key obtenida
[ ] 4. Vercel → Cuenta conectada a GitHub

NIVEL 2 — RECOMENDADAS (Semana 1-2):
[ ] 5. OpenRouter → API key para fallback
[ ] 6. Cloudflare → R2 bucket + API tokens
[ ] 7. Sentry → DSN de error tracking
[ ] 8. PostHog → API key de analytics

NIVEL 3 — OPCIONALES (Semana 2-4):
[ ] 9. Groq → API key para LLM rápido
[ ] 10. Resend → API key para emails
[ ] 11. Hugging Face → Token de modelos

NIVEL 4 — FUTURAS (Semana 3+):
[ ] 12. Upstash → Redis URL + token (caché)
[ ] 13. Firecrawl → API key (scraping)

NIVEL 5 — EXTRAS:
[ ] 14. Meilisearch → Búsqueda avanzada
```

---

# 📝 TEMPLATE COMPLETO DE .env.local

Cuando tengas todas las keys, pégalas aquí:

```env
# === SUPABASE (NIVEL 1 - ESENCIAL) ===
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# === GOOGLE GEMINI (NIVEL 1 - ESENCIAL) ===
GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxx

# === OPENROUTER (NIVEL 2) ===
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# === CLOUDFLARE R2 (NIVEL 2) ===
R2_ACCESS_KEY_ID=xxxxxxxxxxxxxxxxxxxx
R2_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
R2_BUCKET_NAME=kaizen-documents

# === SENTRY (NIVEL 2) ===
NEXT_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxx@sentry.io/1234567

# === POSTHOG (NIVEL 2) ===
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.posthog.com

# === GROQ (NIVEL 3) ===
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# === RESEND (NIVEL 3) ===
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# === HUGGING FACE (NIVEL 3) ===
HUGGINGFACE_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# === UPSTASH (NIVEL 4) ===
UPSTASH_REDIS_REST_URL=https://xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxx

# === FIRECRAWL (NIVEL 4) ===
FIRECRAWL_API_KEY=fc-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# === VERCEL (para CI/CD) ===
# Se configuran en Vercel Dashboard, no en .env.local
```

---

# ⚠️ ADVERTENCIAS IMPORTANTES

1. **NUNCA subas** estas keys a GitHub (el `.env.local` está en `.gitignore`)
2. **NUNCA compartas** tu `service_role` key de Supabase (tiene acceso total)
3. **Rota las keys** cada 90 días por seguridad
4. **Monitorea el uso** de las APIs gratuitas para no exceder límites
5. **Algunos free tiers piden tarjeta** de crédito (Vercel, Supabase) pero no cobran mientras estés en el free plan
6. **Guarda todo** en un gestor de contraseñas (Bitwarden, 1Password, o incluso Google Password Manager)

---

> **¿Listo para empezar a codificar?** → [09_GETTING_STARTED.md](09_GETTING_STARTED.md)
