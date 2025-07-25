import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				fortune: {
					gold: 'hsl(var(--fortune-gold))',
					red: 'hsl(var(--fortune-red))',
					dark: 'hsl(var(--fortune-dark))',
					ember: 'hsl(var(--fortune-ember))',
					crimson: 'hsl(var(--fortune-crimson))',
					bronze: 'hsl(var(--fortune-bronze))'
				},
				pgbet: {
					gold: 'hsl(var(--pgbet-gold))',
					red: 'hsl(var(--pgbet-red))',
					dark: 'hsl(var(--pgbet-dark))',
					emerald: 'hsl(var(--pgbet-emerald))',
					purple: 'hsl(var(--pgbet-purple))',
					amber: 'hsl(var(--pgbet-amber))',
					bronze: 'hsl(var(--pgbet-bronze))',
					crimson: 'hsl(var(--pgbet-crimson))',
					jade: 'hsl(var(--pgbet-jade))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'spin-wheel': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(1080deg)' }
				},
				'coin-flip': {
					'0%': { transform: 'rotateY(0deg) translateY(0px)' },
					'50%': { transform: 'rotateY(180deg) translateY(-20px)' },
					'100%': { transform: 'rotateY(360deg) translateY(0px)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: 'var(--glow-gold)' },
					'50%': { boxShadow: '0 0 40px hsl(45 100% 50% / 0.8)' }
				},
				'bounce-coin': {
					'0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
					'40%': { transform: 'translateY(-10px)' },
					'60%': { transform: 'translateY(-5px)' }
				},
				'yin-yang-spin': {
					'0%': { transform: 'rotate(0deg) scale(1)' },
					'25%': { transform: 'rotate(90deg) scale(1.05)' },
					'50%': { transform: 'rotate(180deg) scale(1)' },
					'75%': { transform: 'rotate(270deg) scale(1.05)' },
					'100%': { transform: 'rotate(360deg) scale(1)' }
				},
				'reel-spin': {
					'0%': { transform: 'translateY(0) rotateX(0deg)' },
					'25%': { transform: 'translateY(-10px) rotateX(15deg)' },
					'75%': { transform: 'translateY(10px) rotateX(-15deg)' },
					'100%': { transform: 'translateY(0) rotateX(0deg)' }
				},
				'coin-rain': {
					'0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
					'100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' }
				},
				'dragon-fire': {
					'0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
					'50%': { opacity: '1', transform: 'scale(1.1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'spin-wheel': 'spin-wheel 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
				'coin-flip': 'coin-flip 0.6s ease-in-out',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'bounce-coin': 'bounce-coin 0.8s ease-in-out',
				'yin-yang-spin': 'yin-yang-spin 2s ease-in-out',
				'reel-spin': 'reel-spin 1s ease-in-out infinite',
				'coin-rain': 'coin-rain 3s linear infinite',
				'dragon-fire': 'dragon-fire 1.5s ease-in-out infinite'
			},
			backgroundImage: {
				'gradient-gold': 'var(--gradient-gold)',
				'gradient-red': 'var(--gradient-red)',
				'gradient-wheel': 'var(--gradient-wheel)',
				'gradient-background': 'var(--gradient-background)',
				'gradient-reels': 'var(--gradient-reels)'
			},
			boxShadow: {
				'glow-gold': 'var(--glow-gold)',
				'glow-red': 'var(--glow-red)',
				'fortune': 'var(--shadow-fortune)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
