var Hello = React.createClass({
	render: function() {
		return React.createElement("h3", null, "Hello React");
	}
});

ReactDOM.render(React.createElement(Hello), document.getElementById('react'));