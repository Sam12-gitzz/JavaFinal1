tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'sans-serif'],
            },
            colors: {
                festival: {
                    violet: '#8b5cf6',
                    fuchsia: '#d946ef',
                    orange: '#f97316',
                    slate: '#0f172a'
                }
            },
            backgroundImage: {
                'festival-gradient': 'linear-gradient(to right, #8b5cf6, #d946ef, #f97316)',
            }
        }
    }
}
