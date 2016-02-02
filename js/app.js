import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/Main";
import Relay from "react-relay";

ReactDOM.render(<Main limit={3} />, document.getElementById('react'));

console.log(
	Relay.QL`
		query Test {
			links {
				title,
				url
			}
		}
	`
);
