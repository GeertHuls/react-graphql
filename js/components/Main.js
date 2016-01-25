import React from "react";
import API from "../API";
import LinkStore from "../stores/LinkStore";

export default class Main extends React.Component {

	componentDidMount() {
		API.fetchLinks();
	}

	render() {
		return (
			<div>
				<h3>links</h3>
				<ul>
					<li>Link...</li>
					<li>Link...</li>
				</ul>
			</div>
		);
	}
}