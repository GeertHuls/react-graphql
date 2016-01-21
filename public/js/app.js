import React from "react";
import ReactDOM from "react-dom";

class Hello extends React.Component {
	render(){
		return <h3>Hello ES6</h3>;
	}
}

ReactDOM.render(<Hello />, document.getElementById('react'));