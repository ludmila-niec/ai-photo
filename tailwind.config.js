module.exports = {
    theme: {
      extend: {
        animation: {
          'dash-border': 'dash 4s linear infinite', // Custom animation utility name and duration
        },
        keyframes: {
          dash: {
            '0%': { backgroundPosition: '0 0' },
            '100%': { backgroundPosition: '100% 0' }, // Animates the background position
          },
        },
      },
    },
    plugins: [],
  };