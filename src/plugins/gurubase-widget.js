module.exports = function (context) {
	return {
		name: "docusaurus-plugin-gurubase-widget", // Feel free to change this name
		injectHtmlTags() {
			return {
				postBodyTags: [
					{
						tagName: "script",
						attributes: {
							src: "https://widget.gurubase.io/widget.latest.min.js",
							"data-widget-id": "5Qdn4o4C4JVH_fpIy6C9rbtLz94ENT73QtXFVpl6uIM", // Replace with your widget ID
							"data-text": "Ask AI", // Optional
							"data-margins": '{"bottom": "20px", "right": "20px"}', // Optional
							"data-light-mode": "false", // Optional
							// "data-name": "YOUR_NAME", // Optional
							// "data-icon-url": "YOUR_ICON_URL", // Optional
							"data-bg-color": "#000000", // Optional
							defer: true,
							id: "guru-widget-id", // Do not change this
						},
					},
				],
			};
		},
	};
};