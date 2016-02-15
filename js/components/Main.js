import React from "react";
import Relay from "react-relay";
import {debounce} from 'lodash';

import Link from "./Link";
import CreateLinkMutation from "../mutations/CreateLinkMutation";

class Main extends React.Component {
	constructor (props) {
		super(props);

		this.search = debounce(this.search, 300);
	}
	search = (e) => {
		let query = e.target.value;
		//when you set a relay variable, relay will try to refetch the query as needed
		this.props.relay.setVariables({ query });
	};
	setLimit = (e) => {
		let newLimit = Number(e.target.value);
		this.props.relay.setVariables({limit: newLimit});
	};
	handleSubmit = (e) => {
		e.preventDefault();
		//See also: http://mgiroux.me/2016/relays-apply-update-function/
		Relay.Store.commitUpdate(
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
				Showing: &nbsp;
				<input type="text" placeholder="Search" onChange={this.search}/>
				<select onChange={this.setLimit}
					defaultValue={this.props.relay.variables.limit} >
					<option value="100">100</option>
					<option value="200">200</option>
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

//Tutorial link: https://facebook.github.io/relay/docs/tutorial.html
Main = Relay.createContainer(Main, {
	initialVariables: {
		limit: 100,
		query: ''
	},
	fragments: {
		store: () => Relay.QL`
			fragment on Store {
				id,
				linkConnection(first: $limit, query: $query) {
					edges {
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