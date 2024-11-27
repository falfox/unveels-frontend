import prefixSelector from "postcss-prefix-selector";

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-prefix-selector": {
      prefix: ".unveels-app", // Ganti dengan namespace Anda
      transform: (prefix, selector) => {
        // Jangan menambahkan prefix ke elemen global
        if (selector.startsWith("html") || selector.startsWith("body")) {
          return selector;
        }
        return `${prefix} ${selector}`;
      },
    },
  },
};
