/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			gridTemplateRows: {
				// Simple 16 column grid
				10: "repeat(10, minmax(0, 1fr))",
			},
			gridRowStart: {
				6: "6",
				7: "7",
				8: "8",
				9: "9",
				10: "10",
				11: "11",
			},
			gridRowEnd: {
				6: "6",
				7: "7",
				8: "8",
				9: "9",
				10: "10",
				11: "11",
			},
		},
	},
	plugins: [],
};
