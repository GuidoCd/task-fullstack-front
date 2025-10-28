# Task Management App (Frontend con Vue)

Esta es la interfaz de usuario para la aplicación de gestión de tareas, construida con Vue 3, Vite y Pinia.

---

## ✨ Características

-   **CRUD completo** para tareas a través de una interfaz modal.
-   **Cambio de estado** interactivo y con actualización optimista.
-   **Filtrado dinámico** por estado y fecha de vencimiento.
-   Gestión de estado centralizada con **Pinia**.
-   Diseño limpio y responsive con **Tailwind CSS**.
-   Notificaciones "Toast" para feedback del usuario.
-   Pruebas unitarias del store con **Vitest**.

---

## 💻 Stack Tecnológico

-   Vue 3 (Composition API)
-   Vite
-   TypeScript
-   Pinia (State Management)
-   Vue Router
-   Tailwind CSS
-   Axios
-   Vitest (para pruebas)

---

## 🚀 Instalación y Puesta en Marcha

Asegúrate de tener **Node.js** (versión 18 o superior) instalado.

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/tu-repo-frontend.git](https://github.com/tu-usuario/tu-repo-frontend.git)
    cd tu-repo-frontend
    ```

2.  **Instalar dependencias de NPM:**
    ```bash
    npm install
    ```

3.  **Configurar la URL de la API:**
    Asegúrate de que el backend de Laravel esté corriendo. Luego, abre el archivo `src/api/axios.ts` y verifica que la `baseURL` apunte a la dirección correcta de tu API (ej. `http://localhost` o `http://localhost:8080` si usas un puerto diferente).

4.  **Ejecutar el servidor de desarrollo:**
    ```bash
    npm run dev
    ```

¡Listo! La aplicación ahora está corriendo, usualmente en `http://localhost:5173`.

---

## ⚙️ Comandos Útiles

-   **Iniciar el servidor de desarrollo:** `npm run dev`
-   **Ejecutar las pruebas unitarias:** `npm run test:unit`
-   **Construir para producción:** `npm run build`