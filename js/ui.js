const UI = {
    init: function() {
        this.renderNavbar();
        this.renderFooter();
    },

    renderNavbar: function() {
        const placeholder = document.getElementById('navbar-placeholder');
        if (!placeholder) return;
        
        // Determine if we're in the admin folder for relative links
        const path = window.location.pathname;
        const isAdminFolder = path.includes('/admin/');
        const prefix = isAdminFolder ? '../' : '';
        
        const currentUser = window.Store ? Store.getCurrentUser() : null;
        
        let navLinks = '';
        if (currentUser) {
            navLinks = `
                <a href="${prefix}dashboard.html" class="hover:text-festival-fuchsia font-medium transition-colors">Dashboard</a>
                <a href="${prefix}my-bookings.html" class="hover:text-festival-fuchsia font-medium transition-colors">My Bookings</a>
                ${currentUser.isAdmin ? `<a href="${isAdminFolder ? '' : 'admin/'}dashboard.html" class="text-red-500 font-bold hover:text-red-600 transition-colors"><i class="fa-solid fa-shield-halved"></i> Admin</a>` : ''}
                <a href="${prefix}index.html" class="px-4 py-2 border border-slate-300 rounded-full hover:bg-slate-100 transition-colors font-medium" onclick="Store.clearCurrentUser()">Logout</a>
            `;
        } else {
            navLinks = `
                <a href="${prefix}login.html" class="hover:text-festival-fuchsia font-medium transition-colors">Login</a>
                <a href="${prefix}register.html" class="px-5 py-2 bg-festival-gradient text-white rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all">Sign Up</a>
            `;
        }

        const navHtml = `
            <header class="glass sticky top-0 z-50 shadow-sm w-full">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-20">
                        <div class="flex-shrink-0 flex items-center gap-2">
                            <a href="${prefix}index.html" class="text-2xl font-extrabold text-festival-slate tracking-tight flex items-center gap-2">
                                <i class="fa-solid fa-water text-festival-violet"></i> 
                                Festi<span class="text-festival-fuchsia">Flow</span>
                            </a>
                        </div>
                        <div class="hidden md:flex items-center space-x-6">
                            ${navLinks}
                        </div>
                    </div>
                </div>
            </header>
        `;
        placeholder.innerHTML = navHtml;
    },

    renderFooter: function() {
        const placeholder = document.getElementById('footer-placeholder');
        if (!placeholder) return;
        
        placeholder.innerHTML = `
            <footer class="bg-festival-slate text-white mt-20 py-12">
                <div class="max-w-7xl mx-auto px-4 text-center">
                    <p class="text-gray-400 font-medium">© ${new Date().getFullYear()} FestiFlow. Revolutionizing festival crowd management.</p>
                </div>
            </footer>
        `;
    },

    showError: function(inputId, errorElementId, message) {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(errorElementId);
        if (input) {
            input.classList.add('border-red-500', 'focus:ring-red-500');
            input.classList.remove('border-gray-300', 'focus:ring-festival-violet');
        }
        if (errorEl) {
            errorEl.innerText = message;
            errorEl.classList.remove('hidden');
        }
    },

    clearError: function(inputId, errorElementId) {
        const input = document.getElementById(inputId);
        const errorEl = document.getElementById(errorElementId);
        if (input) {
            input.classList.remove('border-red-500', 'focus:ring-red-500');
            input.classList.add('border-gray-300', 'focus:ring-festival-violet');
        }
        if (errorEl) {
            errorEl.classList.add('hidden');
        }
    },

    showLoading: function(buttonId, loadingText = "Processing...") {
        const btn = document.getElementById(buttonId);
        if (!btn) return;
        btn.dataset.originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin mr-2"></i> ${loadingText}`;
        btn.classList.add('opacity-75', 'cursor-not-allowed');
    },

    hideLoading: function(buttonId) {
        const btn = document.getElementById(buttonId);
        if (!btn) return;
        btn.disabled = false;
        btn.innerHTML = btn.dataset.originalText || "Submit";
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
};
