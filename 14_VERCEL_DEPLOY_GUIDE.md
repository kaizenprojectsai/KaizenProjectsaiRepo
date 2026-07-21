# 🚀 Guía Rápida: Configurar VERCEL_TOKEN en GitHub Secrets

> **Propósito:** Habilitar el deploy automático del repositorio a Vercel cada vez que hagas push a `main`

---

## 📍 Paso 1: Agregar el Token a GitHub Secrets

Abre tu navegador y ve a esta URL:

```
https://github.com/kaizenprojectsai/KaizenProjectsaiRepo/settings/secrets/actions
```

O manualmente:
1. Ve a **https://github.com/kaizenprojectsai/KaizenProjectsaiRepo**
2. Click en **Settings** (pestaña superior)
3. Menú izquierdo → **Secrets and variables** → **Actions**
4. Click en **"New repository secret"**
5. Agrega estos **3 secrets**:

| # | Nombre | Valor | ¿Qué es? |
|---|--------|-------|----------|
| 1️⃣ | `VERCEL_TOKEN` | `FnO8DhXpTQqogCJwFopiLhHz` | 🔑 El token que ya tienes |
| 2️⃣ | `VERCEL_ORG_ID` | (pendiente) | 🆔 ID de tu equipo/org en Vercel |
| 3️⃣ | `VERCEL_PROJECT_ID` | (pendiente) | 🆔 ID de tu proyecto en Vercel |

---

## 📍 Paso 2: Obtener VERCEL_ORG_ID y VERCEL_PROJECT_ID

Abre tu terminal en VS Code y ejecuta:

```bash
# 1. Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# 2. Vincular proyecto
npx vercel link

# Responde:
# ? Set up "d:\Projects\Kaizen Projects AI"? → Y (yes)
# ? Which scope? → Selecciona tu cuenta personal o "kaizenprojectsai"
# ? Link to existing project? → N (no, crear nuevo)

# 3. Obtener PROJECT_ID
npx vercel project ls
# Deberías ver algo como:
#   Name                    Project ID
#   kaizen-project-xyz      prj_xxxxxxxxxxxxxxxxxxxx
#                                    ^^^^^^^^^^^^^^^^^^^^ este es el PROJECT_ID

# 4. Obtener ORG_ID (opcional, si usas equipo)
npx vercel teams ls
# Si estás en un equipo, verás algo como:
#   team_xxxxxxxxxxxxxxxxxxxx
```

---

## 📍 Paso 3: Agregar ORG_ID y PROJECT_ID a GitHub Secrets

Repite el proceso del **Paso 1** para agregar:
- `VERCEL_ORG_ID` → el valor que obtuviste (o déjalo vacío si usas cuenta personal)
- `VERCEL_PROJECT_ID` → el valor que empieza con `prj_`

---

## ✅ Resultado Final

Cuando termines, tus secrets deberían verse así:

```
GitHub → Settings → Secrets → Actions:

VERCEL_TOKEN      =  FnO8DhXpTQqogCJwFopiLhHz 🔑
VERCEL_ORG_ID     =  team_xxxxxxxxxxxxxxxx  (o vacío)
VERCEL_PROJECT_ID =  prj_xxxxxxxxxxxxxxxx
```

¡Y listo! A partir de ahora, cada vez que hagas push a `main`, GitHub Actions ejecutará automáticamente:

1. ✅ TypeScript check
2. ✅ Lint
3. ✅ Tests
4. 🚀 Deploy a Vercel

---

## ⚙️ ¿Necesitas ayuda adicional?

Si tienes dudas, ejecuta este comando y comparte el resultado:

```bash
npx vercel whoami
```

Eso mostrará tu cuenta actual de Vercel. También puedes preguntarme si algo no queda claro.

