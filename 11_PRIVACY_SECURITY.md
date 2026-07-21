# 🔒 PRIVACIDAD Y SEGURIDAD — KAIZEN PROJECT'S IA

> **Cumplimiento:** Ley 1581 de 2012 (Colombia), GDPR (Europa), LGPD (Brasil)  
> **Enfoque:** Privacy by Design, Security by Default

---

## 📋 Principios de Privacidad

1. **Minimización de datos** — Solo recolectamos lo necesario
2. **Transparencia** — El usuario sabe qué datos guardamos y por qué
3. **Control del usuario** — El usuario puede exportar, modificar y eliminar sus datos
4. **Seguridad** — Cifrado en tránsito y en reposo
5. **Retención limitada** — Datos eliminados cuando ya no son necesarios
6. **Privacidad por diseño** — Desde la arquitectura, no como afterthought

---

## 🗂️ Clasificación de Datos

| Categoría | Ejemplos | Sensibilidad | Almacenamiento |
|-----------|----------|-------------|----------------|
| **Identidad** | Email, nombre, avatar | Alta | Supabase Auth (cifrado) |
| **Proyectos** | Ideas, presupuestos, planes | Alta | PostgreSQL (cifrado) |
| **Documentos** | PDFs, estudios, contratos | Alta | Supabase Storage + R2 |
| **Conversaciones** | Chats con KAIZEN | Media | PostgreSQL + vector DB |
| **Conocimiento** | RAG, embeddings, metadata | Media | PostgreSQL + Vector |
| **Analíticas** | Uso, sesiones, clicks | Baja | PostHog (anonymized) |
| **Logs** | Errores, auditoría | Media | Sentry + PostgreSQL |

---

## 🔐 Seguridad Técnica

### Cifrado

```typescript
// packages/database/src/encryption.ts
// Cifrado de campos sensibles antes de almacenar

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = process.env.ENCRYPTION_KEY // 32 bytes, guardado en Vercel Secrets

export function encrypt(text: string): string {
  const iv = randomBytes(16)
  const cipher = createCipheriv(ALGORITHM, Buffer.from(KEY, 'hex'), iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  const authTag = cipher.getAuthTag().toString('hex')
  
  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':')
  
  const decipher = createDecipheriv(
    ALGORITHM,
    Buffer.from(KEY, 'hex'),
    Buffer.from(ivHex, 'hex')
  )
  
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}
```

### Row Level Security (RLS) — Supabase

```sql
-- Políticas RLS obligatorias para TODAS las tablas

-- 1. Usuarios solo ven sus propios proyectos
CREATE POLICY "users_own_projects"
  ON projects FOR ALL
  USING (created_by = auth.uid());

-- 2. Miembros de organización ven proyectos compartidos
CREATE POLICY "org_members_view_projects"
  ON projects FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles
      WHERE id = auth.uid()
    )
  );

-- 3. Solo el owner puede eliminar
CREATE POLICY "only_owner_delete_project"
  ON projects FOR DELETE
  USING (created_by = auth.uid());

-- 4. Los documentos siguen las reglas del proyecto
CREATE POLICY "documents_follow_project_rules"
  ON documents FOR ALL
  USING (
    project_id IN (
      SELECT id FROM projects
      WHERE created_by = auth.uid()
    )
  );

-- 5. Las conversaciones son privadas
CREATE POLICY "conversations_private"
  ON conversations FOR ALL
  USING (
    project_id IN (
      SELECT id FROM projects
      WHERE created_by = auth.uid()
    )
  );
```

### API Security

```typescript
// apps/web/src/middleware.ts
// Protección de rutas API

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Verificar sesión para rutas protegidas
  const { data: { session } } = await supabase.auth.getSession()
  
  if (req.nextUrl.pathname.startsWith('/api/')) {
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Se requiere autenticación' },
        { status: 401 }
      )
    }
  }
  
  // Rate limiting básico (por IP)
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const rateLimit = await checkRateLimit(ip)
  
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too Many Requests' },
      { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfter) } }
    )
  }
  
  return res
}

export const config = {
  matcher: ['/api/:path*', '/dashboard/:path*'],
}
```

---

## 📜 Cumplimiento Legal

### Ley 1581 de 2012 — Colombia (Habeas Data)

```typescript
// packages/privacy/src/compliance/colombia-1581.ts

export const COLOMBIA_1581_REQUIREMENTS = {
  // Política de Tratamiento de Datos
  dataPolicy: {
    controller: 'KAIZEN PROJECT'S IA',
    purpose: 'Formulación y gestión de proyectos',
    rights: ['Conocer', 'Actualizar', 'Rectificar', 'Suprimir', 'Revocar'],
    retention: 'Mientras sea necesario para la prestación del servicio',
  },

  // Consentimiento explícito requerido
  consentRequired: [
    'email',
    'full_name',
    'organization_data',
    'project_data',
  ],

  // Derechos del titular
  userRights: {
    access: 'Exportar todos sus datos en JSON',
    rectification: 'Editar perfil y proyecto',
    deletion: 'Eliminar cuenta y todos los datos asociados',
    revocation: 'Revocar consentimiento para procesamiento',
  },
}

// Componente de consentimiento
export function PrivacyConsent() {
  return (
    <div className="space-y-4 rounded-lg border p-6">
      <h2 className="text-lg font-semibold">Autorización de Tratamiento de Datos</h2>
      <p className="text-sm text-muted-foreground">
        De acuerdo con la Ley 1581 de 2012, autorizas a KAIZEN PROJECT'S IA
        para recolectar y procesar tus datos personales con el fin de:
      </p>
      <ul className="list-inside list-disc text-sm">
        <li>Crear y gestionar tu cuenta</li>
        <li>Formular proyectos basados en tu información</li>
        <li>Mejorar la plataforma mediante aprendizaje</li>
        <li>Enviar notificaciones relevantes</li>
      </ul>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="consent" required />
        <label htmlFor="consent" className="text-sm">
          Autorizo el tratamiento de mis datos personales
        </label>
      </div>
    </div>
  )
}
```

### GDPR (Europa)

```typescript
// packages/privacy/src/compliance/gdpr.ts

export const GDPR_REQUIREMENTS = {
  // Derechos del usuario (Art. 15-22)
  userRights: [
    'Right to Access: Exportar datos en formato portátil',
    'Right to Rectification: Corregir datos inexactos',
    'Right to Erasure: Derecho al olvido completo',
    'Right to Restrict Processing: Pausar procesamiento',
    'Right to Data Portability: Exportar en JSON/CSV',
    'Right to Object: Oponerse a procesamiento para ML',
  ],

  // Base legal para procesamiento
  legalBasis: 'Consentimiento explícito (Art. 6.1.a)',

  // DPO (Data Protection Officer)
  dpo: {
    name: 'Contacto de Privacidad',
    email: 'privacy@kaizen.ai',
    responseTime: '30 días',
  },

  // Data Processing Agreement (DPA)
  subprocessors: [
    { name: 'Supabase', purpose: 'Base de datos y autenticación', location: 'US (AWS us-east-1)' },
    { name: 'Vercel', purpose: 'Hosting y CDN', location: 'Global (Edge Network)' },
    { name: 'Google Cloud', purpose: 'Gemini AI APIs', location: 'US' },
    { name: 'Sentry', purpose: 'Error tracking', location: 'US' },
  ],
}
```

---

## 🗑️ Retención y Eliminación de Datos

```typescript
// packages/privacy/src/retention-policies.ts

export const RETENTION_POLICIES = {
  conversations: {
    active: 'Mientras el proyecto esté activo',
    archived: '2 años después del último acceso',
    deleted: '30 días en papelera antes de purge',
  },
  projects: {
    active: 'Indefinido mientras el usuario esté activo',
    deleted: '30 días en papelera',
    purge: 'Eliminación irreversible después de 30 días',
  },
  documents: {
    uploaded: 'Mientras el proyecto esté activo',
    deleted: '30 días en papelera',
  },
  userData: {
    account: 'Hasta que el usuario solicite eliminación',
    deleted: '30 días para recovery, luego purge irreversible',
  },
  analytics: {
    detailed: '90 días',
    aggregated: '3 años (anonymized)',
  },
  logs: {
    error: '90 días',
    audit: '5 años (requisito legal)',
  },
}

// Script de purge automático (GitHub Actions semanal)
export async function purgeOldData() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  // Purge proyectos eliminados hace > 30 días
  await supabase
    .from('projects')
    .delete()
    .eq('status', 'deleted')
    .lt('deleted_at', thirtyDaysAgo.toISOString())

  // Purge conversaciones de proyectos eliminados
  await supabase
    .from('conversations')
    .delete()
    .not('project_id', 'in', 
      supabase.from('projects').select('id').not('status', 'eq', 'deleted')
    )
}
```

---

## 🛡️ Buenas Prácticas de Seguridad

### Secrets Management

```typescript
// ❌ MAL: Hardcodeado
const GEMINI_KEY = 'AIzaSy...' 

// ✅ BIEN: Variables de entorno
const GEMINI_KEY = process.env.GEMINI_API_KEY

// ✅ MEJOR: Vercel Environment Secrets + Rotation
// Usar Vercel CLI: vercel env add GEMINI_API_KEY
// Rotar keys cada 90 días
```

### Rate Limiting por Plan

```typescript
// packages/integrations/src/security/rate-limit.ts

const RATE_LIMITS = {
  free: {
    chat: { requests: 50, window: '1h' },
    api: { requests: 100, window: '1h' },
    export: { requests: 20, window: '1h' },
  },
  pro: {
    chat: { requests: 500, window: '1h' },
    api: { requests: 1000, window: '1h' },
    export: { requests: 100, window: '1h' },
  },
}
```

### Auditoría de Acceso

```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL, -- 'view', 'create', 'update', 'delete', 'export'
  resource_type TEXT NOT NULL, -- 'project', 'document', 'conversation'
  resource_id UUID,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para consultas de auditoría
CREATE INDEX idx_audit_user ON audit_log(user_id, created_at);
CREATE INDEX idx_audit_action ON audit_log(action, created_at);
```

---

## 📋 Checklist de Seguridad

### Pre-lanzamiento
- [ ] RLS habilitado en TODAS las tablas
- [ ] Variables de entorno en Vercel Secrets (no en código)
- [ ] HTTPS obligatorio (Vercel lo hace automático)
- [ ] API Key rotation cada 90 días
- [ ] Pruebas de penetración básicas
- [ ] Política de privacidad publicada
- [ ] Términos de servicio publicados
- [ ] Consentimiento de datos implementado
- [ ] Rate limiting activo
- [ ] Auditoría de acceso funcionando
- [ ] Purge automático de datos configurado
- [ ] DPA con subprocesadores

### Post-lanzamiento
- [ ] Monitoreo de accesos sospechosos
- [ ] Alertas de seguridad (Sentry + email)
- [ ] Backup automático diario (Supabase)
- [ ] Disaster recovery plan
- [ ] Bug bounty program (cuando haya presupuesto)

---

> **¿Dudas de seguridad?** Contacta: security@kaizen.ai

---

## 📐 Nota Arquitectónica

> **✅ Next.js confirmado sobre Angular.** Este proyecto está construido sobre Next.js (App Router + API Routes) porque:
> 1. El **ecosistema AI/LLM** (Vercel AI SDK, LangChain, streaming) está optimizado para React/Next.js
> 2. **Serverless nativo** + SSR/SSG/ISR sin configuración adicional
> 3. **Costo $0/mes** en Vercel Free Tier
> 4. **Streaming en tiempo real** trivial con React Server Components
>
> Ver [ADR-013: Decisión de No Migrar a Angular](12_ADR.md#adr-013-decisión-de-no-migrar-a-angular) para el análisis completo.
