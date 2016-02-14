import React from "react";
import Relay from "react-relay";

import Link from "./Link";
import CreateLinkMutation from "../mutations/CreateLinkMutation";

class Main extends React.Component {
	setLimit = (e) => {
		let newLimit = Number(e.target.value);
		this.props.relay.setVariables({limit: newLimit});
	};
	handleSubmit = (e) => {
		e.preventDefault();
		Relay.Store.update(
			new CreateLinkMutation({
				title: this.refs.newTitle.value,
				url: this.refs.newUrl.value,
				//notify parent (eg update count)
				store: this.props.store
			})
		);
		this.refs.newTitle.value = "";
		this.refs.newUrl.value = "";
	};
	render() {
		let content = this.props.store.linkConnection.edges.map(edge => {
			return 	<Link key={edge.node.id} link={edge.node} />;
		});
		return (
			<div>
				<h3>links</h3>
				<form onSubmit={this.handleSubmit}>
					<input type="text" placeholder="Title" ref="newTitle" />
					<input type="text" placeholder="Url" ref="newUrl" />
					<button type="submit">Add</button>
				</form>
				Showing: <select onChange={this.setLimit}>
					<option value="5">5</option>
					<option value="10" selected>10</option>
				</select>
				<ul>
					{content}
				</ul>
			</div>
		);
	};
}

//See docs: https://facebook.github.io/relay/docs/api-reference-relay-container.html
//Declare the data requirement for this component
Main = Relay.createContainer(Main, {
	initialVariables: {
		limit: 10
	},
	fragments: {
		store: () => Relay.QL`
			fragment on Store {
				linkConnection(first: $limit) {
					edges{
						node {
							id,
							${Link.getFragment('link')}
						}
					}
				}
			}
		`
	}
});

export default Main;