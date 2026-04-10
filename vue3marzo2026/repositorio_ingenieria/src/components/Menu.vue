<script setup>
    import { isLogin, logout as authLogout } from '@/services/authService';
    import appMemory from '@/services/appMemory';
    const logout = () => {
        authLogout();
        appMemory.clear();
        window.location.href = '/';
    };
</script>
<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <router-link to="/" class="navbar-brand brand-small">
                📐 Repositorio
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link to="/" class="nav-link">🏠 Inicio</router-link>
                    </li>
                    <li class="nav-item" v-if="isLogin()">
                        <router-link to="/proyectos" class="nav-link">📁 Proyectos</router-link>
                    </li>
                    <li class="nav-item" v-if="isLogin()">
                        <router-link to="/asbuilt" class="nav-link">📋 Planos As Built</router-link>
                    </li>
                </ul>
                <div>
                    <div class="nav-item d-flex align-items-center gap-3" v-if="isLogin()">
                        <span class="text-light">{{ appMemory.get('userName') }}</span>
                        <router-link to="/" class="btn btn-outline-light btn-sm" @click="logout()">
                            Cerrar sesión
                        </router-link>
                    </div>
                    <div class="nav-item" v-else>
                        <router-link to="/login" class="btn btn-outline-light btn-sm">
                            Iniciar sesión
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
.brand-small {
  font-size: 0.85rem;
  padding: 2px 6px;
}
</style>