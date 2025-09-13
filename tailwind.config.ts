import type { Config } from 'tailwindcss'


export default {
content: [
'./app/**/*.{ts,tsx}',
'./components/**/*.{ts,tsx}'
],
theme: {
extend: {
colors: {
brand: {
DEFAULT: '#3B82F6',
50: '#EFF6FF',
}
},
boxShadow: {
card: '0 2px 8px rgba(0,0,0,0.06)'
}
}
},
plugins: []
} satisfies Config