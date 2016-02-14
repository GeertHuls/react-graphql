import Relay from "react-relay";

class CreateLinkMutation extends Relay.Mutation {
	getMutation() {
		return Relay.QL`
			mutation { createLink }
		`;
	}

	getVariables() {
		return {
			title: this.props.title,
			url: this.props.url
		};
	}

	getFatQuery() {
		return Relay.QL`
			fragment on CreateLinkPayload {
				linkEdge,
				store { linkConnection }
			}
		`;
	}

	getConfigs() {
		return [{
			type: 'RANGE_ADD', //use this type to add nodes to the link collection
			parentName: 'store',
			parentID: this.props.store.id,
			connectionName: 'linkConnection',
			edgeName: 'linkEdge',
			rangeBehaviors: {
				'': 'append'
			}
		}]
	}
}

export default CreateLinkMutation;