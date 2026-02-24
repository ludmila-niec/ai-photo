module.exports = {
    theme: {
      extend: {
        animation: {
          blob: 'blob 1s linear infinite',
        },
        keyframes: {
          dash: {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '100% 0' }, // Animates the background position
          },
          blob: {
            '0%': { transform: 'translate(0, 0) scale(1)' },
            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
            '100%': { transform: 'translate(0, 0) scale(1)' },
          }
        },
      },
    },
    plugins: [],
  };