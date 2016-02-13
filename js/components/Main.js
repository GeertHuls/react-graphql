import React from "react";
import Relay from "react-relay";

import Link from "./Link";

class Main extends React.Component {
	render() {
		let content = this.props.store.linkConnection.edges.map(edge => {
			return 	<Link key={edge.node.id} link={edge.node} />;
		});
		return (
			<div>
				<h3>links</h3>
				<ul>
					{content}
				</ul>
			</div>
		);
	}
}

//Declare the data requirement for this component
Main = Relay.createContainer(Main, {
	fragments: {
		store: () => Relay.QL `
			fragment on Store {
				linkConnection(first: 5) {
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